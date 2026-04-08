-- Grove — Initial Supabase Schema
-- Derived from frontend data structures in data/dummy.ts and START_HERE.md
-- Multi-user from day one: every table has user_id + RLS

-- ============================================================
-- EXTENSIONS
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- CUSTOM TYPES (enums matching frontend TypeScript unions)
-- ============================================================

create type leaf_type as enum (
  'text',
  'image',
  'audio',
  'bucket',
  'capsule',
  'gift',
  'own_writing'
);

create type suggestion_complexity as enum (
  'small',
  'medium',
  'large'
);

create type suggestion_status as enum (
  'pending',
  'accepted',
  'built',
  'dismissed'
);

create type gardener_layer as enum (
  'recent',
  'patterns',
  'portrait'
);

-- ============================================================
-- TABLES
-- ============================================================

-- Profiles: extends Supabase auth.users with app-specific fields
create table profiles (
  id          uuid primary key references auth.users on delete cascade,
  display_name text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Branches: the emergent categories on the 3D tree
-- The Gardener creates, renames, repositions, and merges these
create table branches (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users on delete cascade,
  name        text not null,
  color       text not null,                  -- hex color, e.g. '#c17f6b'
  attachment  double precision not null,       -- y position on trunk where branch starts
  direction_x double precision not null,       -- x component of tip offset
  direction_y double precision not null,       -- y component of tip offset
  direction_z double precision not null,       -- z component of tip offset
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Leaves: individual memories — the core data unit
create table leaves (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references auth.users on delete cascade,
  branch_id       uuid not null references branches on delete cascade,
  type            leaf_type not null,
  content         text not null,               -- text content, caption, or description
  date            date not null,               -- user-facing date of the memory
  person          text,                        -- attribution (person's name)
  sealed          boolean not null default false,
  sealed_until    date,                        -- when a capsule opens
  is_own_writing  boolean not null default false,
  is_resurfaced   boolean not null default false,
  bucket_done     boolean not null default false,
  language        text,                        -- e.g. 'Italian'
  media_url       text,                        -- Supabase Storage URL for image/audio
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Nightly logs: journal entries ("what sparked something today?")
create table nightly_logs (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users on delete cascade,
  date        date not null,
  entry       text not null,
  positive    boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Gardener suggestions: the Seed panel items
create table gardener_suggestions (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references auth.users on delete cascade,
  title           text not null,
  why             text not null,
  complexity      suggestion_complexity not null default 'small',
  claude_prompt   text not null,
  status          suggestion_status not null default 'pending',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Gardener context: the three memory layers (recent, patterns, portrait)
create table gardener_context (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users on delete cascade,
  layer       gardener_layer not null,
  content     text not null default '',        -- the context document
  updated_at  timestamptz not null default now(),

  -- One row per user per layer
  unique (user_id, layer)
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Every table is queried by user_id first
create index idx_branches_user        on branches (user_id);
create index idx_leaves_user          on leaves (user_id);
create index idx_leaves_branch        on leaves (branch_id);
create index idx_leaves_user_date     on leaves (user_id, date desc);
create index idx_leaves_user_type     on leaves (user_id, type);
create index idx_nightly_logs_user    on nightly_logs (user_id, date desc);
create index idx_suggestions_user     on gardener_suggestions (user_id);
create index idx_gardener_ctx_user    on gardener_context (user_id);

-- ============================================================
-- ROW-LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
alter table profiles             enable row level security;
alter table branches             enable row level security;
alter table leaves               enable row level security;
alter table nightly_logs         enable row level security;
alter table gardener_suggestions enable row level security;
alter table gardener_context     enable row level security;

-- Profiles: users can only read/write their own profile
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Branches: users can only access their own branches
create policy "Users can view own branches"
  on branches for select
  using (auth.uid() = user_id);

create policy "Users can insert own branches"
  on branches for insert
  with check (auth.uid() = user_id);

create policy "Users can update own branches"
  on branches for update
  using (auth.uid() = user_id);

create policy "Users can delete own branches"
  on branches for delete
  using (auth.uid() = user_id);

-- Leaves: users can only access their own leaves
create policy "Users can view own leaves"
  on leaves for select
  using (auth.uid() = user_id);

create policy "Users can insert own leaves"
  on leaves for insert
  with check (auth.uid() = user_id);

create policy "Users can update own leaves"
  on leaves for update
  using (auth.uid() = user_id);

create policy "Users can delete own leaves"
  on leaves for delete
  using (auth.uid() = user_id);

-- Nightly logs: users can only access their own logs
create policy "Users can view own logs"
  on nightly_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own logs"
  on nightly_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own logs"
  on nightly_logs for update
  using (auth.uid() = user_id);

-- Gardener suggestions: users can only access their own suggestions
create policy "Users can view own suggestions"
  on gardener_suggestions for select
  using (auth.uid() = user_id);

create policy "Users can insert own suggestions"
  on gardener_suggestions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own suggestions"
  on gardener_suggestions for update
  using (auth.uid() = user_id);

-- Gardener context: users can only access their own context
create policy "Users can view own context"
  on gardener_context for select
  using (auth.uid() = user_id);

create policy "Users can insert own context"
  on gardener_context for insert
  with check (auth.uid() = user_id);

create policy "Users can update own context"
  on gardener_context for update
  using (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
-- Run via Supabase dashboard or supabase CLI:
--   supabase storage create media --public=false
--
-- Storage RLS policies (applied in dashboard):
--   SELECT: auth.uid()::text = (storage.foldername(name))[1]
--   INSERT: auth.uid()::text = (storage.foldername(name))[1]
--   DELETE: auth.uid()::text = (storage.foldername(name))[1]
--
-- File path convention: {user_id}/{leaf_id}/{filename}
-- This ensures RLS can scope access by the first folder segment.

-- ============================================================
-- TRIGGERS: auto-update updated_at
-- ============================================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on profiles
  for each row execute function update_updated_at();

create trigger set_updated_at before update on branches
  for each row execute function update_updated_at();

create trigger set_updated_at before update on leaves
  for each row execute function update_updated_at();

create trigger set_updated_at before update on gardener_suggestions
  for each row execute function update_updated_at();

create trigger set_updated_at before update on gardener_context
  for each row execute function update_updated_at();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGN-UP
-- ============================================================

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
