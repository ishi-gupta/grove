export type LeafType = 'text' | 'image' | 'audio' | 'bucket' | 'capsule' | 'gift' | 'own_writing'

export interface LeafData {
  id: string
  type: LeafType
  content: string
  date: string
  branch: string
  person?: string
  sealed?: boolean
  sealedUntil?: string
  isOwnWriting?: boolean
  isResurfaced?: boolean
  bucketDone?: boolean
  language?: string
}

export interface BranchData {
  id: string
  name: string
  color: string
  leaves: LeafData[]
  // 3D position: [startY on trunk, end x, end y offset from start, end z]
  attachment: number // y position on trunk where branch starts
  direction: [number, number, number] // x, y, z offset to tip
}

export interface SuggestionData {
  id: string
  title: string
  why: string
  complexity: 'small' | 'medium' | 'large'
  claudePrompt: string
  status: 'pending' | 'accepted' | 'built' | 'dismissed'
}

// ---------------------------------------------------------------------------
// Starter / demo data — generic placeholders so no personal content is shared.
// Each new user should eventually get their own tree seeded from their inputs.
// ---------------------------------------------------------------------------

export const branches: BranchData[] = [
  {
    id: 'gratitude',
    name: 'Gratitude',
    color: '#c17f6b',
    attachment: 1.5,
    direction: [-2.5, 2.0, 1.0],
    leaves: [
      {
        id: 'l1',
        type: 'own_writing',
        content: 'Feeling grateful for the small things today. A warm cup of tea, a clear sky.',
        date: '2025-06-12',
        branch: 'gratitude',
        isOwnWriting: true,
      },
      {
        id: 'l2',
        type: 'text',
        content: 'The only way to do great work is to love what you do. — Steve Jobs',
        date: '2025-11-03',
        branch: 'gratitude',
      },
      {
        id: 'l3',
        type: 'capsule',
        content: 'A letter to my future self.',
        date: '2025-02-14',
        branch: 'gratitude',
        isOwnWriting: true,
        sealed: true,
        sealedUntil: '2028-02-14',
      },
      {
        id: 'l4',
        type: 'audio',
        content: 'Clair de Lune — Debussy',
        date: '2025-12-01',
        branch: 'gratitude',
      },
    ],
  },
  {
    id: 'memory',
    name: 'Memory',
    color: '#c4935a',
    attachment: 1.8,
    direction: [1.5, 1.5, -2.0],
    leaves: [
      {
        id: 'm1',
        type: 'text',
        content: 'Walking through the old town at dusk. The cobblestones told stories underfoot.',
        date: '2024-07-20',
        branch: 'memory',
      },
      {
        id: 'm2',
        type: 'text',
        content: 'The smell of rain on warm pavement. That specific weight in the air before it breaks.',
        date: '2025-08-14',
        branch: 'memory',
      },
      {
        id: 'm3',
        type: 'image',
        content: 'Golden hour — the light at 5pm in autumn.',
        date: '2024-10-15',
        branch: 'memory',
      },
      {
        id: 'm4',
        type: 'own_writing',
        content: 'Called an old friend. Felt like myself again.',
        date: '2026-02-03',
        branch: 'memory',
        isOwnWriting: true,
      },
      {
        id: 'm5',
        type: 'text',
        content: 'Cooking in silence. Presence as an ingredient. The meal tasted different.',
        date: '2025-04-08',
        branch: 'memory',
      },
    ],
  },
  {
    id: 'becoming',
    name: 'Becoming',
    color: '#4ecdc4',
    attachment: 2.0,
    direction: [0.5, 3.5, 0.5],
    leaves: [
      {
        id: 'b1',
        type: 'bucket',
        content: 'Learn to surf.',
        date: '2025-01-01',
        branch: 'becoming',
      },
      {
        id: 'b2',
        type: 'bucket',
        content: 'Run a half marathon.',
        date: '2025-03-15',
        branch: 'becoming',
      },
      {
        id: 'b3',
        type: 'bucket',
        content: 'Watch a classic film in its original language.',
        date: '2025-09-20',
        branch: 'becoming',
      },
      {
        id: 'b4',
        type: 'text',
        content: 'Started learning a new language today. Small steps count.',
        date: '2026-02-10',
        branch: 'becoming',
      },
      {
        id: 'b5',
        type: 'own_writing',
        content: 'Made something with my hands today. It counts.',
        date: '2026-01-22',
        branch: 'becoming',
        isOwnWriting: true,
      },
    ],
  },
  {
    id: 'beauty',
    name: 'Beauty',
    color: '#a78bc4',
    attachment: 1.6,
    direction: [2.5, 1.5, 1.5],
    leaves: [
      {
        id: 'be1',
        type: 'image',
        content: 'A painting that stopped me in my tracks at the museum.',
        date: '2025-09-01',
        branch: 'beauty',
      },
      {
        id: 'be2',
        type: 'image',
        content: 'Two dancers moving in perfect trust. The way connection becomes art.',
        date: '2026-02-10',
        branch: 'beauty',
      },
      {
        id: 'be3',
        type: 'image',
        content: 'A perfect pastry from the corner bakery. Ordinary things made extraordinary.',
        date: '2024-11-30',
        branch: 'beauty',
      },
      {
        id: 'be4',
        type: 'text',
        content: 'Noticing beauty is a skill. The more you practice, the more you see.',
        date: '2025-11-30',
        branch: 'beauty',
      },
    ],
  },
  {
    id: 'inspiration',
    name: 'Inspiration',
    color: '#c9a84c',
    attachment: 2.2,
    direction: [-1.5, 2.0, -1.5],
    leaves: [
      {
        id: 'i1',
        type: 'text',
        content: 'Someone who faced doubt and kept creating anyway. That takes courage.',
        date: '2025-10-15',
        branch: 'inspiration',
      },
      {
        id: 'i2',
        type: 'text',
        content: 'Refusing to be defined by a single label. That is the whole lesson.',
        date: '2026-01-10',
        branch: 'inspiration',
      },
      {
        id: 'i3',
        type: 'text',
        content: 'The question is not whether you are capable. The question is whether you will let yourself find out.',
        date: '2025-06-20',
        branch: 'inspiration',
      },
      {
        id: 'i4',
        type: 'text',
        content: 'You are building the plane while flying it. That is the only way anyone has ever built anything.',
        date: '2025-08-05',
        branch: 'inspiration',
      },
      {
        id: 'i5',
        type: 'text',
        content: 'She refused the life handed to her. Wrote her way to a different one.',
        date: '2025-07-12',
        branch: 'inspiration',
      },
    ],
  },
  {
    id: 'body',
    name: 'Body',
    color: '#7a9e6e',
    attachment: 1.0,
    direction: [3.0, 0.5, 0.5],
    leaves: [
      {
        id: 'bo1',
        type: 'own_writing',
        content: 'Went for a long run with a friend. We didn\'t talk for the first half and it was perfect.',
        date: '2026-02-12',
        branch: 'body',
        isOwnWriting: true,
      },
      {
        id: 'bo2',
        type: 'text',
        content: 'Morning stretch at 7am. The instructor said: your body already knows. Let it.',
        date: '2026-02-18',
        branch: 'body',
      },
      {
        id: 'bo3',
        type: 'bucket',
        content: 'Touch my toes without bending my knees.',
        date: '2025-05-01',
        branch: 'body',
      },
    ],
  },
  {
    id: 'alive',
    name: 'Alive',
    color: '#e8a85f',
    attachment: 1.1,
    direction: [2.0, 1.0, -2.0],
    leaves: [
      {
        id: 'al1',
        type: 'own_writing',
        content: 'Jumped into cold water. The shock woke up every nerve. Came up gasping and grinning.',
        date: '2025-12-28',
        branch: 'alive',
        isOwnWriting: true,
      },
      {
        id: 'al2',
        type: 'own_writing',
        content: 'Tried something ridiculous today. Looked silly. Felt completely alive.',
        date: '2026-01-05',
        branch: 'alive',
        isOwnWriting: true,
      },
      {
        id: 'al3',
        type: 'text',
        content: 'Falling down and feeling the ground — the aliveness of impact, of trying.',
        date: '2025-11-22',
        branch: 'alive',
      },
    ],
  },
  {
    id: 'words',
    name: 'Words',
    color: '#e8d5b7',
    attachment: 1.2,
    direction: [-3.0, 0.5, -0.5],
    leaves: [
      {
        id: 'w1',
        type: 'own_writing',
        content: 'Late night. Writing this at 2am. I don\'t know what I\'m doing but I know I\'m not done.',
        date: '2025-10-03',
        branch: 'words',
        isOwnWriting: true,
      },
      {
        id: 'w2',
        type: 'own_writing',
        content: 'What would you do today if nothing counted? Answer: exactly this.',
        date: '2026-02-21',
        branch: 'words',
        isOwnWriting: true,
      },
      {
        id: 'w3',
        type: 'gift',
        content: 'A note from the gardener: you\'ve been writing consistently. The tree is listening.',
        date: '2026-02-24',
        branch: 'words',
      },
    ],
  },
  {
    id: 'horizon',
    name: 'Horizon',
    color: '#f0a500',
    attachment: 2.5,
    direction: [0.0, 4.5, 0.0],
    leaves: [
      {
        id: 'h1',
        type: 'bucket',
        content: 'Travel somewhere new. Stay long enough to feel it.',
        date: '2025-05-20',
        branch: 'horizon',
      },
      {
        id: 'h2',
        type: 'bucket',
        content: 'Learn to play an instrument.',
        date: '2025-08-01',
        branch: 'horizon',
      },
      {
        id: 'h3',
        type: 'bucket',
        content: 'Plant a tree.',
        date: '2025-09-10',
        branch: 'horizon',
      },
      {
        id: 'h4',
        type: 'text',
        content: 'The year I say yes to the thing I keep postponing. It is allowed.',
        date: '2026-01-15',
        branch: 'horizon',
      },
      {
        id: 'h5',
        type: 'capsule',
        content: 'Letter to myself — five years from now.',
        date: '2026-02-24',
        branch: 'horizon',
        isOwnWriting: true,
        sealed: true,
        sealedUntil: '2031-02-24',
      },
    ],
  },
  {
    id: 'people',
    name: 'People',
    color: '#b87c6a',
    attachment: 0.8,
    direction: [-1.0, 1.0, -3.0],
    leaves: [
      {
        id: 'p1',
        type: 'text',
        content: 'A friend who shows up without being asked. The kind of person who makes the world feel smaller in a good way.',
        date: '2026-01-30',
        branch: 'people',
      },
      {
        id: 'p2',
        type: 'text',
        content: 'The work is never finished. You just get better at knowing when to stop.',
        date: '2025-05-14',
        branch: 'people',
      },
      {
        id: 'p3',
        type: 'own_writing',
        content: 'Someone called when I didn\'t know I needed it. They always do.',
        date: '2026-02-03',
        branch: 'people',
        isOwnWriting: true,
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Seed suggestions — generic examples showing how the gardener might propose
// new features based on a user's patterns.
// ---------------------------------------------------------------------------

export const seedSuggestions: SuggestionData[] = [
  {
    id: 's1',
    title: 'Vine mechanic between related branches',
    why: 'Two of your branches have been co-occurring in your logs. There should be a visible connection between them.',
    complexity: 'medium',
    claudePrompt: 'Add a vine/connection mechanic to the Grove 3D tree. When two branches have strong co-occurrence in leaf content (detected via embeddings), render a thin glowing vine between them using TubeGeometry along a CatmullRomCurve3 that arcs between the two branch tips. The vine should pulse slowly and be barely visible — felt more than seen.',
    status: 'pending',
  },
  {
    id: 's2',
    title: 'Waveform visualization on branch view',
    why: 'You feed audio often but the branch view only shows leaf shapes. Branches with audio should pulse with the rhythm of the music saved there.',
    complexity: 'small',
    claudePrompt: 'Add ambient waveform bars to branches that contain audio leaves in the Grove 3D tree. When a branch has audio content, render 5-7 thin bar geometries near the branch tip that animate in a slow breathing waveform pattern using sine waves with staggered phase offsets.',
    status: 'pending',
  },
  {
    id: 's3',
    title: 'Sub-branch for recurring themes',
    why: 'A recurring theme keeps appearing across your leaves. It deserves its own space as a sub-branch.',
    complexity: 'small',
    claudePrompt: 'Add sub-branch support to the Grove 3D tree. A sub-branch grows off an existing branch tip rather than off the trunk. Implement a sub-branch growing from the tip of a parent branch, shorter and thinner, in the same color but slightly cooler. Populate with 2-3 placeholder leaves.',
    status: 'pending',
  },
]

// ---------------------------------------------------------------------------
// Starter nightly log entries — generic examples.
// ---------------------------------------------------------------------------

export const nightlyLogs = [
  { date: '2026-02-24', entry: 'The light through the window at 4pm. A friend texted.', positive: true },
  { date: '2026-02-23', entry: 'Finished a lesson I\'d been putting off. Managed the whole thing.', positive: true },
  { date: '2026-02-22', entry: 'Hard day. Wrote about it anyway.', positive: false },
  { date: '2026-02-21', entry: 'Moved my body. Watched the city at night from the roof.', positive: true },
  { date: '2026-02-20', entry: 'An old friend called.', positive: true },
  { date: '2026-02-19', entry: 'Didn\'t go outside. Felt the pull of the screen.', positive: false },
  { date: '2026-02-18', entry: 'Cooked something new. It worked.', positive: true },
]
