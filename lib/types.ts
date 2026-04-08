// Database types — mirrors the Supabase schema
// When Supabase is wired up, generate these from the database with `supabase gen types`

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
          tree_born_at: string // when the tree was first created
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      branches: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['branches']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['branches']['Insert']>
      }
      leaves: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['leaves']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['leaves']['Insert']>
      }
      nightly_logs: {
        Row: {
          id: string
          user_id: string
          date: string
          entry: string
          positive: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['nightly_logs']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['nightly_logs']['Insert']>
      }
      gardener_context: {
        Row: {
          id: string
          user_id: string
          layer: 'recent' | 'patterns' | 'portrait'
          content: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['gardener_context']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['gardener_context']['Insert']>
      }
    }
  }
}

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

export interface SuggestionData {
  id: string
  title: string
  why: string
  complexity: 'small' | 'medium' | 'large'
  claudePrompt: string
  status: 'pending' | 'accepted' | 'built' | 'dismissed'
}

export interface NightlyLogData {
  date: string
  entry: string
  positive: boolean
}
