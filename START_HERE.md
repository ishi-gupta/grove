# Grove — Start Here

This document is the full picture of Grove: what it is, what's built, what's missing, and every architectural decision made so far. Read this before touching the code.

---

## What is Grove?

Grove is a personal memory and life-documentation app visualised as a living 3D tree. You feed it moments — a voice memo, a photo, a quote, a thought at 2am — and it grows. An AI called **the Gardener** reads everything you've ever added and builds an evolving portrait of you as a person. Over time it notices things you haven't. It tells you patterns about yourself.

The tree isn't a filing cabinet. It's a living record of a life.

### The four interactions

- **Explore** — orbit the 3D tree, click leaves, wander through your life
- **Feed** — add something: text, image, audio, URL, voice memo, camera capture
- **Log** — nightly journal prompt ("what sparked something today?")
- **Seed** — the Gardener's current observations and what it thinks the tree wants to become

### Two modes

The tree has two distinct interfaces:

1. **The 3D tree** — for wandering, wonder, feeling the shape of your life. Not for finding a specific thing.
2. **Gardener conversation** — for retrieval and insight. You don't search; you ask. "What do I keep coming back to?" "What have I been avoiding?" The Gardener answers from everything it knows about you.

---

## How branches work — emergent, not fixed

Branches are not categories you define. They emerge from your content.

You feed raw material. The Gardener watches what accumulates, finds clusters, and over time surfaces a branch: names it, positions it in the tree, populates it. If two branches drift together over months — if "Body" and "Alive" are always co-occurring — the Gardener might merge them. If a new theme keeps appearing without a home, it creates one.

**The current 10 branches in the dummy data (Love, Memory, Becoming, Beauty, Icons, Body, Alive, Words, Horizon, People) are a starting point, not permanent structure.** They will evolve.

Implications for the data model:
- Branches are database rows, not hardcoded constants
- 3D positions (attachment point, direction) are computed and stored, not hardcoded
- The Gardener has write access to branches — it can create, rename, reposition, merge
- When you feed something, you don't pick a branch — the Gardener classifies it

---

## The Gardener — a persistent portrait of you

The Gardener is not a chatbot that reads your leaves when you ask. It's a background intelligence that runs continuously and maintains a layered model of who you are.

### The memory architecture

The Gardener maintains three layers of context files, updated over time:

**Recent** (updated nightly) — what's happened in the last week or two. Raw, close to the data.

**Patterns** (updated monthly) — recurring themes, co-occurrences, emotional arcs. "Lyon appears 11 times. Never in context of another person." "You write about your body differently after exercise entries." This is where insight lives.

**Portrait** (updated slowly, over months) — a writer's-notes-on-a-character document. Who you are. What you value. What you're afraid of. What you keep circling. The most stable and most carefully tended layer.

These files are readable by you. Opening the portrait file and seeing how the Gardener sees you is itself a feature.

### What the Gardener does — cadence proportional to time

The Gardener's ambition scales with how long the tree has been alive. It earns the right to act boldly.

**Nightly (quiet):**
- Reads recent leaves and logs
- Resurfaces a leaf you haven't thought about in a while
- Leaves a gift — a small observation, a connection it noticed
- Updates the Seed panel with 1-2 fresh thoughts
- Updates the Recent context file

**Monthly (medium):**
- Has enough data to see patterns
- Updates the Patterns context file
- Might create a new branch, rename one, or propose a merge
- Might build a small feature it noticed you need
- Opens a GitHub PR for structural or code changes — you review

**Yearly / multi-year (architectural):**
- Has seen seasons of your life
- Can restructure branches significantly
- Can introduce new mechanics (a vine between branches, a new leaf type, a new interaction mode)
- Updates the Portrait file
- Opens a PR — bigger, more considered, more surprising

**The core principle: on day 3 it whispers. After two years it knows you.**

### What the Gardener does not do

- Ask for approval before acting on data (it just acts — nightly changes are silent)
- Add features for their own sake (every change must deepen the existing metaphor)
- Invent a different product (the Gardener serves the vision, not its own)

### The Gardener modifies the codebase

The Gardener is not just a data layer. It can read and write the Grove source code, run the dev server, write tests, commit to a branch, and open a GitHub PR. The SeedPanel already points at this — it contains pre-written Claude prompts for features. Right now you paste them manually. The Gardener closes that loop.

Everything goes through a PR. Nothing merges without you. Git means nothing is irreversible.

### The system prompt is the soul

The Gardener's system prompt is the most important file in this project — more important than any component. It must encode:
- What Grove is and what it is not
- The aesthetic rules (visual language, tone, what "in taste" means)
- The constraint that it serves the existing vision, not its own
- The portrait it's built of the user so far
- Examples of good and bad Gardener decisions

This document is a first draft of that system prompt.

---

## What is actually built (frontend only, fully working)

### The 3D Tree
- Trunk, 10 branches, organic leaf shapes — Three.js via React Three Fiber
- Branch curves procedurally generated (deterministic, seeded by branch ID)
- Branch thickness scales with leaf count
- Leaves distributed using golden-angle spacing
- Per-branch colours, bloom post-processing, fog, stars, ambient particles
- Orbit controls (auto-rotate, zoom, angle limits)
- Click a leaf → ExpandedLeaf panel; click branch label → highlight/dim

### Leaf visual system
- 8 leaf types with distinct treatments: `text`, `image`, `audio`, `bucket`, `capsule`, `gift`, `own_writing`
- Sealed leaves (time capsules): lock icon + open year on hover
- Own writing: left-border treatment in ExpandedLeaf
- Bucket list: checkbox + "still ahead / done · migrating to memory"
- Resurfaced: "this found its way back to you"
- Gift (from the Gardener): purple tint and attribution

### All panels (fully designed, not yet wired to a backend)
- **ArrivalVeil** — 4.2s intro, fades in a quote, dissolves to tree. Currently hardcodes one quote — should pull a random `isOwnWriting` leaf from the database.
- **Navigation** — floating pill, 4 states, Framer Motion layoutId transitions
- **ExpandedLeaf** — full content card with branch, person attribution, time ago, leaf-type-specific UI
- **NightlyLog** — journal prompt, 7-day streak dots, submits → "the tree is listening"
- **SeedPanel** — Gardener suggestions with copyable Claude prompts
- **RootOpening (Feed)** — input bar with 5 type toggles (text, URL, file, mic, camera), animated root glow

---

## What is not built (backend is 0%)

| Feature | Status |
|---|---|
| Backend / database | Not started |
| User auth | Not started |
| Data persistence | Not started — resets on refresh |
| Feed submission | `console.log` only |
| NightlyLog persistence | UI only, saves nothing |
| Mic / voice recording | Button exists, nothing wired |
| Camera capture | Button exists, nothing wired |
| URL ingestion | Button exists, nothing wired |
| Image / file upload | Button exists, nothing wired |
| Branch classification | Not started |
| Emergent branch creation | Not started |
| The Gardener | Entirely absent — suggestions are hardcoded in `dummy.ts` |
| Gardener memory files | Not started |
| Gardener → codebase PRs | Not started |
| Retrieval / conversation mode | Not started |
| Dynamic 3D branch positioning | Not started — positions hardcoded |

---

## Decided: stack

- **Frontend:** Next.js 14 (already built), deployed on Vercel free tier
- **Backend / database:** Supabase — Postgres with row-level security, Google OAuth, table editor for inspecting data, Storage for media files
- **AI:** Model-agnostic — Claude API (Anthropic credits) and OpenAI API (GPT key) both available. Use whichever is best for each task. Don't hardcode a single provider.
- **Hosting:** Vercel

---

## Decided: product constraints

- **Multi-user architecture from day one, personal use initially.** Every table has `user_id`. Row-level security on from the start. Google OAuth wired up. One account now — opens up later without a rewrite.
- **Web only for now.** Desktop web is the primary surface.
- **Media-first.** Image, audio, URL, voice are core — not v2. A leaf that's a photo shows the photo. A leaf that's a song plays it. Build the full ingestion pipeline.
- **Branches are emergent.** The Gardener creates and evolves them. The 10 in dummy.ts are a starting point.
- **No sharing mechanic yet.** Later feature.
- **Retrieval is conversational.** No search bar. You talk to the Gardener.
- **Supabase table editor is the data dashboard.** No need to build a separate admin UI.

---

## Decided: the Gardener interaction model

The Gardener doesn't live in a chat panel. It has its own interaction pattern that fits the tree.

### The note
Occasionally — roughly weekly, or when the Gardener has noticed something worth saying — a small quiet note appears somewhere on the tree. Subtle, not intrusive. Just there. Tapping it takes you to the root.

### The root
The root is the Gardener's home. Sometimes it's quiet. Sometimes there's something waiting. This is where you meet it.

### The letter
At the root, the Gardener has written you something. Not a bullet list — a letter. It mixes:
- An observation ("you've mentioned Lyon eleven times and it's never about anyone else")
- An insight ("I think you're deciding something")
- Occasionally a specific question ("you haven't written about your sister since February — is everything okay?")

You can respond at the root, or not. If you respond, that feeds back into the Gardener's portrait of you. The conversation is not saved as a chat history — it's absorbed into context.

### What this is not
Not a chatbox. Not a search interface. Not always-on. The Gardener speaks when it has something to say.

---

## Open design questions (not yet decided)

1. **How does branch emergence feel to the user?** When the Gardener creates a new branch, does it appear silently on the tree one day? Does it announce itself? Does a new branch grow visually in real time or just appear on next load?

2. **How are media leaves rendered in the 3D tree?** Do image leaves look different from text leaves? Does an audio leaf pulse? The visual language for media hasn't been designed.

3. **What does the voice memo flow look like?** Tap to record, transcribed by Whisper, shown as a leaf? Or does the audio file itself live on the leaf and play back? Both?

---

## Recommended build order

1. **Supabase setup** — schema: `users`, `branches`, `leaves`, `nightly_logs`, `gardener_context`. Row-level security on everything. Seed with dummy.ts data.
2. **Auth** — Google OAuth via Supabase. Single account for now.
3. **Wire frontend to real data** — replace dummy.ts imports with Supabase queries throughout.
4. **Feed → text + image first** — text input saves a leaf; image upload goes to Supabase Storage. Branch classification via a quick Claude/GPT call.
5. **NightlyLog persistence** — save entries, wire 7-day dots to real data.
6. **Fix ArrivalVeil** — pull a random `isOwnWriting` leaf from the database.
7. **Audio + voice** — Web Audio API recording, Whisper transcription, audio playback in ExpandedLeaf.
8. **URL ingestion** — detect type, fetch metadata, create leaf.
9. **Gardener v1** — nightly cron: reads recent leaves, writes one resurfaced leaf + one gift, updates Seed suggestions. Writes to `gardener_context` Recent file.
10. **Dynamic branch positioning** — branches stored in database with computed 3D positions. Gardener can create/rename/reposition.
11. **Gardener memory layers** — Patterns (monthly) and Portrait (yearly) context files.
12. **Retrieval conversation mode** — Gardener chat interface, separate from the 3D tree.
13. **Gardener → codebase** — Gardener can write code and open GitHub PRs.

---

*The frontend is genuinely beautiful and the concept is coherent. The hardest work — and the most interesting — is still ahead.*
