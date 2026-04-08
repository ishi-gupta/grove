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

export const branches: BranchData[] = [
  {
    id: 'love',
    name: 'Love',
    color: '#c17f6b',
    attachment: 1.5,
    direction: [-2.5, 2.0, 1.0],
    leaves: [
      {
        id: 'l1',
        type: 'own_writing',
        content: 'I will take shitty feeling every day rather than not feeling at all.',
        date: '2025-06-12',
        branch: 'love',
        isOwnWriting: true,
      },
      {
        id: 'l2',
        type: 'text',
        content: 'She understood desire not as something to be managed, but as proof of being alive. — Simone de Beauvoir',
        date: '2025-11-03',
        branch: 'love',
      },
      {
        id: 'l3',
        type: 'capsule',
        content: 'The piece about the boy I loved.',
        date: '2025-02-14',
        branch: 'love',
        isOwnWriting: true,
        sealed: true,
        sealedUntil: '2028-02-14',
      },
      {
        id: 'l4',
        type: 'audio',
        content: 'Tum Se Hi — Jab We Met',
        date: '2025-12-01',
        branch: 'love',
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
        content: 'Standing before the terracotta warriors in Xi\'an. The scale of human ambition, preserved in clay.',
        date: '2024-07-20',
        branch: 'memory',
      },
      {
        id: 'm2',
        type: 'text',
        content: 'The smell of monsoon. Petrichor on hot stone. That specific weight in the air before it breaks.',
        date: '2025-08-14',
        branch: 'memory',
      },
      {
        id: 'm3',
        type: 'image',
        content: 'India — the light at 5pm in October.',
        date: '2024-10-15',
        branch: 'memory',
      },
      {
        id: 'm4',
        type: 'own_writing',
        content: 'Sister called. Felt like myself.',
        date: '2026-02-03',
        branch: 'memory',
        isOwnWriting: true,
        person: 'Sister',
      },
      {
        id: 'm5',
        type: 'text',
        content: 'Cooking at Vipassana. The silence made the food taste different. Presence as an ingredient.',
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
        content: 'Surf a barrel.',
        date: '2025-01-01',
        branch: 'becoming',
      },
      {
        id: 'b2',
        type: 'bucket',
        content: 'Do a backflip.',
        date: '2025-03-15',
        branch: 'becoming',
      },
      {
        id: 'b3',
        type: 'bucket',
        content: 'Watch Life is Beautiful — in Italian.',
        date: '2025-09-20',
        branch: 'becoming',
        language: 'Italian',
      },
      {
        id: 'b4',
        type: 'text',
        content: 'Ciao, mi chiamo Ishita. Sto imparando l\'italiano.',
        date: '2026-02-10',
        branch: 'becoming',
        language: 'Italian',
      },
      {
        id: 'b5',
        type: 'own_writing',
        content: 'Made a 3-minute documentary on my phone today. It counts.',
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
        content: 'Claude Monet — Impression, Sunrise. 1872. He named an entire movement and didn\'t mean to.',
        date: '2025-09-01',
        branch: 'beauty',
      },
      {
        id: 'be2',
        type: 'image',
        content: 'Winter Olympics — the pairs skating. The way trust becomes movement.',
        date: '2026-02-10',
        branch: 'beauty',
      },
      {
        id: 'be3',
        type: 'image',
        content: 'A croissant from the place on Rue de Rivoli. Ordinary things made extraordinary.',
        date: '2024-11-30',
        branch: 'beauty',
      },
      {
        id: 'be4',
        type: 'text',
        content: 'Beauty is a legitimate life\'s work. Monet proved it. So did whoever baked this.',
        date: '2025-11-30',
        branch: 'beauty',
      },
    ],
  },
  {
    id: 'icons',
    name: 'Icons',
    color: '#c9a84c',
    attachment: 2.2,
    direction: [-1.5, 2.0, -1.5],
    leaves: [
      {
        id: 'i1',
        type: 'text',
        content: 'Taylor Swift. Faced backlash. Kept making things. Turned the noise into albums.',
        date: '2025-10-15',
        branch: 'icons',
      },
      {
        id: 'i2',
        type: 'text',
        content: 'Eileen Gu chose herself. Refused to be just one thing. That\'s the whole lesson.',
        date: '2026-01-10',
        branch: 'icons',
      },
      {
        id: 'i3',
        type: 'text',
        content: 'The question is not whether you are capable. The question is whether you will let yourself find out.',
        date: '2025-06-20',
        branch: 'icons',
        person: 'Professor Chris Peiche',
      },
      {
        id: 'i4',
        type: 'text',
        content: 'You are building the plane while flying it. That is the only way anyone has ever built anything.',
        date: '2025-08-05',
        branch: 'icons',
        person: 'Sierra Wang',
      },
      {
        id: 'i5',
        type: 'text',
        content: 'Simone de Beauvoir refused the life handed to her. Wrote her way to a different one.',
        date: '2025-07-12',
        branch: 'icons',
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
        content: 'Running with Imogen. 8km. We didn\'t talk for the first 4km and it was perfect.',
        date: '2026-02-12',
        branch: 'body',
        isOwnWriting: true,
        person: 'Imogen Gardiner',
      },
      {
        id: 'bo2',
        type: 'text',
        content: 'Pilates at 7am. The teacher said: your body already knows. Let it.',
        date: '2026-02-18',
        branch: 'body',
      },
      {
        id: 'bo3',
        type: 'bucket',
        content: 'Do a full split.',
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
        content: 'Got pulled under a wave today. Held down for what felt like forever. Came up. Paddled back out.',
        date: '2025-12-28',
        branch: 'alive',
        isOwnWriting: true,
      },
      {
        id: 'al2',
        type: 'own_writing',
        content: 'The cartwheel. Attempted at 23. Looked completely ridiculous. Felt completely alive.',
        date: '2026-01-05',
        branch: 'alive',
        isOwnWriting: true,
      },
      {
        id: 'al3',
        type: 'text',
        content: 'Falling off a skateboard and feeling the ground — the aliveness of impact, of trying.',
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
        content: 'Hard night. Writing this at 2am. I don\'t know what I\'m doing but I know I\'m not done.',
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
        content: 'A note from the gardener: you\'ve written 12 times this month. The tree is listening.',
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
        content: 'Go to France — Lyon. Stay long enough.',
        date: '2025-05-20',
        branch: 'horizon',
      },
      {
        id: 'h2',
        type: 'bucket',
        content: 'Learn to sing.',
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
        content: 'The year I take off to ski. It is allowed. Val Thorens. February.',
        date: '2026-01-15',
        branch: 'horizon',
      },
      {
        id: 'h5',
        type: 'capsule',
        content: 'Letter to myself — 2031.',
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
        content: 'Imogen — the friend you run with and talk to about everything and nothing. She makes the world feel smaller in a good way.',
        date: '2026-01-30',
        branch: 'people',
        person: 'Imogen Gardiner',
      },
      {
        id: 'p2',
        type: 'text',
        content: 'The work is never finished. You just get better at knowing when to stop.',
        date: '2025-05-14',
        branch: 'people',
        person: 'John Mitchell',
      },
      {
        id: 'p3',
        type: 'own_writing',
        content: 'My sister. She called when I didn\'t know I needed it. She always does.',
        date: '2026-02-03',
        branch: 'people',
        isOwnWriting: true,
        person: 'Sister',
      },
    ],
  },
]

export const seedSuggestions: SuggestionData[] = [
  {
    id: 's1',
    title: 'Vine mechanic between Love and Horizon',
    why: 'Love and Horizon have been co-occurring in your logs for months. France keeps appearing near the boy you loved. There should be a visible connection between these branches.',
    complexity: 'medium',
    claudePrompt: 'Add a vine/connection mechanic to the Grove 3D tree. When two branches have strong co-occurrence in leaf content (detected via embeddings), render a thin glowing vine between them using TubeGeometry along a CatmullRomCurve3 that arcs between the two branch tips. The vine should pulse slowly and be barely visible — felt more than seen.',
    status: 'pending',
  },
  {
    id: 's2',
    title: 'Waveform visualization on branch view',
    why: 'You feed audio constantly but the branch view only shows leaf shapes. The Body and Memory branches should pulse with the rhythm of the music saved there.',
    complexity: 'small',
    claudePrompt: 'Add ambient waveform bars to branches that contain audio leaves in the Grove 3D tree. When a branch has audio content, render 5-7 thin bar geometries near the branch tip that animate in a slow breathing waveform pattern using sine waves with staggered phase offsets.',
    status: 'pending',
  },
  {
    id: 's3',
    title: 'Lyon sub-branch under Horizon',
    why: 'France appears 11+ times across your logs and leaves. Lyon specifically. This deserves its own space inside the Horizon branch.',
    complexity: 'small',
    claudePrompt: 'Add sub-branch support to the Grove 3D tree. A sub-branch grows off an existing branch tip rather than off the trunk. Implement the first sub-branch: Lyon, growing from the tip of Horizon, shorter and thinner, in the same gold color but slightly cooler. Populate with 2-3 placeholder leaves about Lyon/France.',
    status: 'pending',
  },
]

export const nightlyLogs = [
  { date: '2026-02-24', entry: 'The light through the window at 4pm. Imogen texted.', positive: true },
  { date: '2026-02-23', entry: 'Finished the Italian lesson. Managed a whole sentence.', positive: true },
  { date: '2026-02-22', entry: 'Hard day. Wrote about it anyway.', positive: false },
  { date: '2026-02-21', entry: 'Pilates. The city at night from the roof.', positive: true },
  { date: '2026-02-20', entry: 'Sister called.', positive: true },
  { date: '2026-02-19', entry: 'Didn\'t go outside. Felt the pull of the screen.', positive: false },
  { date: '2026-02-18', entry: 'Cooked something new. It worked.', positive: true },
]
