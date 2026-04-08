# Grove — Supabase Schema Design

This document describes the database schema for Grove, derived directly from the frontend data structures in `data/dummy.ts` and the architectural decisions in `START_HERE.md`.

---

## Design Principles

1. **Multi-user from day one** — every table has `user_id`, RLS on everything
2. **Frontend-driven** — every column maps to a field the frontend already renders
3. **Gardener-writable** — branches, leaves, suggestions, and context are all mutable by the Gardener via service_role
4. **Emergent branches** — branches are database rows, not hardcoded constants
5. **Media-ready** — `media_url` column on leaves points to Supabase Storage

---

## Tables

### `profiles`
Extends Supabase `auth.users` with app-specific fields. Auto-created on sign-up via trigger.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | References `auth.users` |
| `display_name` | text | From Google OAuth metadata |
| `avatar_url` | text | From Google OAuth metadata |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | Auto-updated via trigger |

### `branches`
The emergent categories on the 3D tree. The Gardener creates, renames, repositions, and merges these.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | |
| `user_id` | uuid (FK) | References `auth.users` |
| `name` | text | e.g. "Love", "Memory" |
| `color` | text | Hex color, e.g. `#c17f6b` |
| `attachment` | double precision | Y position on trunk |
| `direction_x` | double precision | X component of tip offset |
| `direction_y` | double precision | Y component of tip offset |
| `direction_z` | double precision | Z component of tip offset |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | Auto-updated via trigger |

**Frontend mapping:** `BranchData.direction: [number, number, number]` → split into `direction_x`, `direction_y`, `direction_z` columns (Postgres doesn't have native tuple columns; three floats are simpler to query/index than a JSON array).

### `leaves`
Individual memories — the core data unit of Grove.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | |
| `user_id` | uuid (FK) | References `auth.users` |
| `branch_id` | uuid (FK) | References `branches` |
| `type` | `leaf_type` enum | `text`, `image`, `audio`, `bucket`, `capsule`, `gift`, `own_writing` |
| `content` | text | Text content, caption, or description |
| `date` | date | User-facing date of the memory |
| `person` | text | Attribution (person's name) |
| `sealed` | boolean | Default `false` |
| `sealed_until` | date | When a capsule opens |
| `is_own_writing` | boolean | Default `false` |
| `is_resurfaced` | boolean | Default `false` |
| `bucket_done` | boolean | Default `false` |
| `language` | text | e.g. "Italian" |
| `media_url` | text | Supabase Storage URL for image/audio |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | Auto-updated via trigger |

**Frontend mapping:** Direct 1:1 with `LeafData` interface. `branch` (string ID) becomes `branch_id` (uuid FK). Added `media_url` for Phase 2 media support.

### `nightly_logs`
Journal entries from the NightlyLog panel ("what sparked something today?").

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | |
| `user_id` | uuid (FK) | References `auth.users` |
| `date` | date | |
| `entry` | text | |
| `positive` | boolean | Default `true` — drives the 7-day streak dots |
| `created_at` | timestamptz | |

**Frontend mapping:** Direct 1:1 with `nightlyLogs` array. The 7-day dots in `NightlyLog.tsx` query the last 7 entries ordered by date desc.

### `gardener_suggestions`
The Seed panel items — what the Gardener thinks the tree wants to become.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | |
| `user_id` | uuid (FK) | References `auth.users` |
| `title` | text | |
| `why` | text | Gardener's reasoning |
| `complexity` | `suggestion_complexity` enum | `small`, `medium`, `large` |
| `claude_prompt` | text | Copyable prompt for Claude |
| `status` | `suggestion_status` enum | `pending`, `accepted`, `built`, `dismissed` |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | Auto-updated via trigger |

**Frontend mapping:** Direct 1:1 with `SuggestionData` interface. `claudePrompt` → `claude_prompt` (snake_case convention).

### `gardener_context`
The Gardener's three memory layers.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | |
| `user_id` | uuid (FK) | References `auth.users` |
| `layer` | `gardener_layer` enum | `recent`, `patterns`, `portrait` |
| `content` | text | The context document |
| `updated_at` | timestamptz | Auto-updated via trigger |

**Unique constraint:** `(user_id, layer)` — one row per user per layer.

---

## Custom Types (Postgres Enums)

| Enum | Values | Frontend Source |
|---|---|---|
| `leaf_type` | `text`, `image`, `audio`, `bucket`, `capsule`, `gift`, `own_writing` | `LeafType` union |
| `suggestion_complexity` | `small`, `medium`, `large` | `SuggestionData.complexity` |
| `suggestion_status` | `pending`, `accepted`, `built`, `dismissed` | `SuggestionData.status` |
| `gardener_layer` | `recent`, `patterns`, `portrait` | `START_HERE.md` spec |

---

## Row-Level Security

Every table has RLS enabled. Policies follow the same pattern:

- **SELECT:** `auth.uid() = user_id` (or `= id` for profiles)
- **INSERT:** `auth.uid() = user_id` (with check)
- **UPDATE:** `auth.uid() = user_id`
- **DELETE:** `auth.uid() = user_id` (on branches and leaves only — logs and suggestions are append/update only)

The Gardener operates via **service_role key** which bypasses RLS, allowing it to write suggestions, context, and manage branches.

---

## Storage

**Bucket:** `media` (private)

**Path convention:** `{user_id}/{leaf_id}/{filename}`

**RLS policies** (set via Supabase dashboard):
- SELECT/INSERT/DELETE: `auth.uid()::text = (storage.foldername(name))[1]`

This scopes all media access to the owning user via the first path segment.

---

## Indexes

| Index | Columns | Purpose |
|---|---|---|
| `idx_branches_user` | `branches(user_id)` | All queries filter by user |
| `idx_leaves_user` | `leaves(user_id)` | All queries filter by user |
| `idx_leaves_branch` | `leaves(branch_id)` | Join leaves to branches |
| `idx_leaves_user_date` | `leaves(user_id, date DESC)` | Recent leaves, ArrivalVeil random pick |
| `idx_leaves_user_type` | `leaves(user_id, type)` | Filter by leaf type |
| `idx_nightly_logs_user` | `nightly_logs(user_id, date DESC)` | Last 7 days for streak dots |
| `idx_suggestions_user` | `gardener_suggestions(user_id)` | Seed panel query |
| `idx_gardener_ctx_user` | `gardener_context(user_id)` | Context lookup |

---

## Triggers

- **`update_updated_at`** — fires `BEFORE UPDATE` on all tables with `updated_at`, sets it to `now()`
- **`handle_new_user`** — fires `AFTER INSERT` on `auth.users`, auto-creates a `profiles` row from Google OAuth metadata

---

## Seed Data

Migration `00002_seed_dummy_data.sql` contains all data from `data/dummy.ts` translated to SQL inserts. Uses a placeholder `user_id` (`00000000-0000-0000-0000-000000000001`) that should be updated to a real user UUID after the first Google OAuth sign-in.

---

## What Needs to Happen Next

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Run migration 00001** in the SQL editor (or via Supabase CLI)
3. **Enable Google OAuth** in Supabase Auth settings
4. **Create the `media` storage bucket** via dashboard
5. **Run migration 00002** to seed dummy data (via service_role context)
6. **Build `lib/supabase.ts`** — client initialization with env vars
7. **Build `lib/types.ts`** — TypeScript types matching the DB schema (adapt from `data/dummy.ts`)
8. **Build `lib/hooks.ts`** — React hooks (`useBranches`, `useLeaves`, `useNightlyLogs`, etc.)
9. **Wire frontend** — replace `data/dummy.ts` imports with hook calls
