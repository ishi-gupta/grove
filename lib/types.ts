// ─── Frontend types (used by components) ────────────────────────────

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
  mediaUrl?: string
}

export interface BranchData {
  id: string
  name: string
  color: string
  leaves: LeafData[]
  attachment: number
  direction: [number, number, number]
}

export interface NightlyLogData {
  date: string
  entry: string
  positive: boolean
}

// ─── Database row types (mirror Supabase schema) ────────────────────

export interface DbLeafRow {
  id: string
  user_id: string
  branch_id: string
  type: LeafType
  content: string
  date: string
  person: string | null
  sealed: boolean
  sealed_until: string | null
  is_own_writing: boolean
  is_resurfaced: boolean
  bucket_done: boolean
  language: string | null
  media_url: string | null
  created_at: string
}

export interface DbNightlyLogRow {
  id: string
  user_id: string
  date: string
  entry: string
  positive: boolean
  created_at: string
}

export interface DbBranchRow {
  id: string
  user_id: string
  name: string
  color: string
  attachment: number
  direction_x: number
  direction_y: number
  direction_z: number
  created_at: string
  created_by: 'user' | 'gardener'
}

// ─── Conversion helpers ─────────────────────────────────────────────

export function dbLeafToLeafData(row: DbLeafRow, branchName: string): LeafData {
  return {
    id: row.id,
    type: row.type,
    content: row.content,
    date: row.date,
    branch: branchName,
    person: row.person ?? undefined,
    sealed: row.sealed || undefined,
    sealedUntil: row.sealed_until ?? undefined,
    isOwnWriting: row.is_own_writing || undefined,
    isResurfaced: row.is_resurfaced || undefined,
    bucketDone: row.bucket_done || undefined,
    language: row.language ?? undefined,
    mediaUrl: row.media_url ?? undefined,
  }
}

export function dbLogToNightlyLogData(row: DbNightlyLogRow): NightlyLogData {
  return {
    date: row.date,
    entry: row.entry,
    positive: row.positive,
  }
}
