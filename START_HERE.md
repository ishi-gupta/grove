# Grove — Start Here

This document is the full picture of Grove: what it is, what's built, what's missing, and the honest design questions that need answering before a coding agent can take it further.

---

## What is Grove?

Grove is a personal memory and life-documentation app visualised as a living 3D tree. The metaphor: your life has branches (themes — Love, Memory, Becoming, etc.), and each moment, quote, goal, or piece of writing you save becomes a leaf on the right branch.

The tree grows as you live. An AI called **the Gardener** reads the tree and surfaces observations, connections, and suggestions back to you.

Four core interactions:
- **Explore** — orbit the 3D tree, click leaves, read your moments
- **Feed** — add something new (text, URL, image, audio)
- **Log** — nightly journal prompt ("what sparked something today?")
- **Seed** — the Gardener's suggestions for what the tree wants to become

---

## What is actually built (frontend, fully working)

### The 3D Tree
- Trunk, 10 branches, organic leaf shapes — all rendered in Three.js via React Three Fiber
- Branch curves are procedurally generated (deterministic, seeded by branch ID — no random jitter on re-render)
- Branch thickness scales with leaf count
- Leaves distributed along branches using golden-angle spacing
- Per-branch colours, bloom post-processing, fog, stars, ambient particles
- Orbit controls (auto-rotate, min/max zoom/angle)
- Click a leaf → opens ExpandedLeaf panel
- Click a branch label → highlights that branch, dims all others

### Leaf visual system
- 8 leaf types with distinct visual treatments: `text`, `image`, `audio`, `bucket`, `capsule`, `gift`, `own_writing`
- Sealed leaves (time capsules) show a lock + open year on hover
- Own writing gets a left-border treatment in ExpandedLeaf
- Bucket list leaves show a checkbox + "still ahead / done · migrating to memory"
- Resurfaced leaves get a "this found its way back to you" note
- Gift leaves (from the Gardener) get a purple tint and attribution

### Arrival Veil
- 4.2s intro animation on first load
- Fades in a quote from your own writing, shows a waveform "your music" indicator, then dissolves into the tree
- Currently hardcodes one specific quote (see design concerns below)

### Navigation
- Floating pill at bottom: Grove / Feed / Log / Seed
- Appears after the arrival animation completes
- Active state uses Framer Motion layoutId for smooth transitions

### ExpandedLeaf panel
- Full content card on leaf click
- Shows: branch, "your words" badge, content, person attribution, time ago, bucket checkbox, gift/resurfaced notes

### NightlyLog
- Daily journal prompt: "What sparked something in you today?"
- 7-day streak dots (glowing = positive day, dim = harder day)
- Submits → "the tree is listening." → closes

### SeedPanel (the Gardener's suggestions)
- Slide-out panel listing AI-generated feature/content suggestions
- Each suggestion has: title, reasoning ("why the tree wants this"), complexity badge, and a copyable Claude prompt
- Footer: "Copy a prompt and paste it into Claude Code. The tree builds itself."

### Feed input (RootOpening)
- Input bar at bottom centre
- 5 input type toggles: text, URL, file, mic, camera
- Animated root glow beneath the input
- Sends content onSubmit

---

## What is not built (backend is 0%)

| Feature | Status |
|---|---|
| Any backend / database | Not started |
| User authentication | Not started |
| Data persistence | Not started — all data resets on refresh |
| Feed submit | Calls `console.log` + comment: `// Phase 2: Gardener API` |
| NightlyLog submit | Shows confirmation UI, saves nothing |
| Mic recording | Button exists, no Web Audio API wired |
| Camera capture | Button exists, no camera access |
| URL parsing / ingestion | Button exists, no parsing |
| File / image upload | Button exists, no file handling |
| The Gardener AI | Hardcoded suggestions in `dummy.ts`, no actual AI |
| Search / retrieval | No mechanism at all |
| Mobile layout | Not considered |

All content currently lives in `/data/dummy.ts` — 10 branches, ~40 leaves, 3 seed suggestions, 7 nightly log entries. The data is personal and intentional (this is clearly Ishita's actual life content used as seed data), which is useful for understanding the tone and intent of the app.

---

## The stack

- **Next.js 14** (App Router, TypeScript)
- **Three.js + React Three Fiber + Drei** — 3D tree
- **@react-three/postprocessing** — bloom effect
- **Framer Motion** — all panel animations
- **Tailwind CSS** — layout utilities
- **Lucide React** — icons
- No backend, no database, no auth library yet

---

## Design decisions that are solid — keep these

**The tree metaphor itself.** Branches as life themes, leaves as moments — this is coherent and emotionally resonant. The content in dummy.ts proves the concept works. Leaves that are sealed until a future date, leaves that resurface, leaves that migrate from bucket list to memory when completed — these mechanics are genuinely interesting.

**The visual aesthetic.** Dark background (`#0a0a14`), warm gold tones (`rgba(200, 180, 140, ...)`), Lora serif for content + Inter light for UI chrome, bloom glow on leaves — this is a deliberate and consistent design language. Don't mess with it.

**The Gardener concept.** An AI that reads your tree and leaves observations and suggestions is a compelling differentiator. The SeedPanel even includes pre-written Claude prompts for the Gardener to use when building features — there's a meta layer here (the app uses AI to improve itself) that's interesting.

**The leaf data model.** The `LeafData` type is well-thought-out: type, content, date, branch, person, sealed, sealedUntil, isOwnWriting, isResurfaced, bucketDone, language. These fields cover a lot of real use cases and are mostly justified by the dummy data.

**The NightlyLog tone.** "What sparked something in you today?" is a better prompt than any journaling app ships. The 7-day dot streak is subtle and non-gamified. Keep this.

---

## Design decisions worth questioning before going further

### 1. Is the 3D tree the right primary interface?

The tree looks incredible. But consider: if you have 200 leaves, how do you find the one you're thinking of? You can't search. You can't sort. At certain camera angles the branch labels overlap. The orbit controls are desktop-first and will be painful on mobile.

The 3D tree is a *visualisation* of your life — it works for browsing and wonder. But the actual useful interactions (adding content, reading a specific leaf, daily logging) don't benefit from being in 3D space. The panels that do the real work are all flat UI overlaid on the canvas.

**The question:** Is the 3D the product, or is it a beautiful wrapper around what's actually a flat data app? This matters because maintaining Three.js complexity is expensive. If the tree is the soul of the app, that's fine — but be explicit about it and accept the tradeoff.

### 2. Leaf content is all text descriptions — images and audio don't actually exist

The `type` field has `image`, `audio`, `url` etc. but none of these render differently. An "image" leaf ("India — the light at 5pm in October") is just a string describing a photo. An "audio" leaf ("Tum Se Hi — Jab We Met") is just a song title.

Should this app actually store and render media? That's a very different engineering problem from storing text. If yes, you need: file upload, storage (S3/Cloudflare R2), a media player in ExpandedLeaf, image rendering. If no — and the app is text-first, with media as references — then the type system is misleading and some types (image, audio) should probably be reconsidered.

### 3. The Arrival Veil hardcodes one specific quote

The opening quote ("I will take shitty feeling every day rather than not feeling at all.") is hardcoded in `ArrivalVeil.tsx`. Once you've seen it 10 times it loses its power. The intent is clearly for it to surface *something from your own tree* — a random own-writing leaf, or the most recently added one. This is a small fix but worth doing early because it changes how the app feels fundamentally.

### 4. The Feed input is very ambitious

The RootOpening component has 5 input modes: text, URL, file, mic, camera. Each is a separate engineering problem:
- **URL**: detect type (Spotify, Instagram, article), fetch OG data, extract meaningful content
- **File / image**: upload, store, OCR or describe with AI?
- **Mic**: Web Audio API, speech-to-text (Whisper?)
- **Camera**: camera access, capture, process

All of these need to eventually resolve into a `LeafData` object. That processing pipeline (raw input → structured leaf) is probably the core backend challenge and it's entirely undefined. Recommend: **ship text-only first**, get the backend working, then layer in media types one at a time.

### 5. Branches are hardcoded — should users create their own?

The 10 branches (Love, Memory, Becoming, Beauty, Icons, Body, Alive, Words, Horizon, People) are hardcoded in `dummy.ts` with specific 3D positions and directions. The branch data model *supports* custom branches (just an id, name, color, attachment point, direction vector) but there's no UI to create one and the 3D layout would need to handle dynamic branch placement.

Decision needed: is Grove opinionated about life themes (fixed branches, curated by you), or is it user-configurable? Fixed branches are simpler and might actually be more emotionally coherent — the tree looks intentional because it is.

### 6. The Gardener is undefined beyond vibes

The SeedPanel hardcodes 3 suggestions. But the actual Gardener should:
- Read all your leaf content
- Detect patterns, co-occurrences, themes
- Surface memories you haven't thought about in a while (isResurfaced mechanic)
- Generate gifts (the gift leaf type)
- Propose structural changes to the tree

None of this is specced. What triggers the Gardener? (Nightly cron? On-demand?) What does it actually do with your data? (Embeddings + semantic search? Raw Claude API call? Both?) What does it write back? (New leaves? Notifications? Just the SeedPanel suggestions?)

This is the most interesting and most undefined part of the app.

---

## Recommended order of work for a coding agent

1. **Backend foundation** — pick a stack (Supabase is the natural fit: Postgres + auth + storage + realtime). Schema: users, branches, leaves, nightly_logs. Wire up the existing frontend to real data.

2. **Auth** — single user to start (this reads as a personal app, not multi-tenant). Magic link or Google OAuth.

3. **Feed → text only** — make the text input actually save a leaf to the database. Branch classification: either user picks, or a quick Claude call classifies it.

4. **NightlyLog persistence** — save log entries, wire the 7-day dots to real data.

5. **Fix the ArrivalVeil** — pull a random `isOwnWriting` leaf from the tree instead of the hardcoded quote.

6. **The Gardener v1** — a nightly job that calls Claude with your recent leaves and writes back: one resurfaced leaf, one gift leaf, updates the SeedPanel suggestions.

7. **Media types** — image upload first (most common), then audio, then URL parsing.

8. **Search** — even a simple sidebar search over leaf content would dramatically improve utility at scale.

9. **Mobile** — the 3D tree needs touch controls and the panels need responsive design.

---

## Open questions that need answers before building

- **Where does data live?** (Supabase, Firebase, local-first with sync, custom backend?)
- **Is this single-user or multi-user?** (Personal tool vs social/shared?)
- **What does the Gardener actually do, technically?** (Claude API? embeddings? schedule?)
- **Are images/audio first-class content, or are they references/descriptions?**
- **Are branches fixed or user-created?**
- **What platform is primary?** (Desktop web, mobile web, native app?)
- **Is there a sharing mechanic?** (Can you share a leaf, a branch, the whole tree?)

---

---

## The vision: a Gardener that modifies its own codebase

This is the most important architectural idea in the project and it should shape every decision.

The goal is not just an AI that reads your data and makes suggestions. The goal is a **coding agent that treats Grove's own source code as part of the tree** — something it can tend, grow, and reshape based on what it learns about you.

### What this looks like in practice

1. The Gardener runs on a schedule (nightly, or triggered by activity)
2. It reads your leaf content, nightly logs, and usage patterns
3. It identifies something: a recurring theme, a missing feature, a mechanic that would serve you better
4. It writes the code — new component, new backend route, updated data model, whatever it takes
5. It opens a GitHub PR with a plain-English description of what it built and why
6. You review, approve or reject, merge

The tree literally builds itself. The SeedPanel already points at this — it has pre-written Claude prompts for features. Right now you copy-paste them manually. This just closes the loop.

### Why this isn't scary

Everything goes through a PR. Nothing merges without you. Git means nothing is irreversible. The Gardener can be wrong or overreaching — you just close the PR.

The risk isn't "AI modifying code." The risk is a Gardener with no taste — one that adds features compulsively without serving the actual vision. The constraint that keeps it grounded: **the Gardener should only build things that deepen the existing metaphor, not invent a new product.** That constraint should be part of its system prompt.

### What the Gardener needs to be this

- Access to the codebase (read + write files, run the dev server, run tests)
- Access to your leaf data and nightly logs
- A system prompt that encodes the vision, the aesthetic rules, and what "in taste" means for Grove
- Ability to create a git branch, commit, and open a GitHub PR
- A tool to write back to the SeedPanel (so you can see what it's *considering* before it builds it)

### The system prompt is the soul

The Gardener's system prompt is the most important file in this project — more important than any component. It should contain:
- What Grove is and what it is not
- The aesthetic rules (the visual language, the tone, what "in taste" means)
- The constraint that it serves the user's existing vision, not its own
- Examples of good and bad Gardener decisions

This document is a first draft of that system prompt. When you're ready to build the Gardener, start here.

---

*The frontend is genuinely beautiful and the concept is coherent. The hardest work — and the most interesting — is still ahead.*
