export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          user_id: string
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          user_id: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          user_id?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      blocks: {
        Row: {
          id: string
          project_id: string
          block_type: string
          position_x: number
          position_y: number
          config: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          block_type: string
          position_x: number
          position_y: number
          config?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          block_type?: string
          position_x?: number
          position_y?: number
          config?: Json
          created_at?: string
          updated_at?: string
        }
      }
      connections: {
        Row: {
          id: string
          project_id: string
          source_block_id: string
          target_block_id: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          source_block_id: string
          target_block_id: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          source_block_id?: string
          target_block_id?: string
          created_at?: string
        }
      }
    }
  }
}
