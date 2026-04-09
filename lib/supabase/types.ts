// Database types matching the Supabase schema

export interface DbBranch {
  id: string
  user_id: string
  name: string
  color: string
  attachment: number
  direction_x: number
  direction_y: number
  direction_z: number
  created_at: string
  updated_at: string
}

export interface DbLeaf {
  id: string
  user_id: string
  branch_id: string | null
  type: 'text' | 'image' | 'audio' | 'bucket' | 'capsule' | 'gift' | 'own_writing'
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
  media_type: string | null
  created_at: string
  updated_at: string
}

export interface DbNightlyLog {
  id: string
  user_id: string
  date: string
  entry: string
  positive: boolean
  created_at: string
}

export interface DbSeedSuggestion {
  id: string
  user_id: string
  title: string
  why: string
  complexity: 'small' | 'medium' | 'large'
  claude_prompt: string
  status: 'pending' | 'accepted' | 'built' | 'dismissed'
  created_at: string
  updated_at: string
}

export interface DbGardenerContext {
  id: string
  user_id: string
  layer: 'recent' | 'patterns' | 'portrait'
  content: string
  updated_at: string
}
