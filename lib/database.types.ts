export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      list_items: {
        Row: {
          completed: boolean
          created_at: string | null
          id: string
          list_id: string
          text: string
          updated_at: string
        }
        Insert: {
          completed?: boolean
          created_at?: string | null
          id?: string
          list_id: string
          text: string
          updated_at?: string
        }
        Update: {
          completed?: boolean
          created_at?: string | null
          id?: string
          list_id?: string
          text?: string
          updated_at?: string
        }
      }
      lists: {
        Row: {
          author_id: string
          contributors: string[] | null
          created_at: string
          icon: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          author_id: string
          contributors?: string[] | null
          created_at?: string
          icon?: string | null
          id: string
          name: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          contributors?: string[] | null
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
