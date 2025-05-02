import { createClient } from '@supabase/supabase-js';
import type { Database as SupabaseDatabase } from '@/types/supabase';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient<SupabaseDatabase>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      storageKey: 'typingspot-auth',
      debug: process.env.NODE_ENV === 'development',
    },
    global: {
      headers: {
        'x-application-name': 'typingspot',
      },
    },
  }
);

// Database types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          username: string
          avatar_url: string | null
          total_tests: number
          rank_points: number
          last_active: string
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          username: string
          avatar_url?: string | null
          total_tests?: number
          rank_points?: number
          last_active?: string
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          username?: string
          avatar_url?: string | null
          total_tests?: number
          rank_points?: number
          last_active?: string
        }
      }
      typing_results: {
        Row: {
          id: string
          created_at: string
          user_id: string
          wpm: number
          accuracy: number
          duration: number
          text_type: string
          language?: string
          code_snippet_id?: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          wpm: number
          accuracy: number
          duration: number
          text_type: string
          language?: string
          code_snippet_id?: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          wpm?: number
          accuracy?: number
          duration?: number
          text_type?: string
          language?: string
          code_snippet_id?: string
        }
      }
      achievements: {
        Row: {
          id: string
          name: string
          description: string
          icon_url: string
          required_score: number
          achievement_type: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          icon_url: string
          required_score: number
          achievement_type: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          icon_url?: string
          required_score?: number
          achievement_type?: string
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          unlocked_at: string
          progress: number
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          unlocked_at?: string
          progress?: number
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          unlocked_at?: string
          progress?: number
        }
      }
      code_snippets: {
        Row: {
          id: string
          content: string
          language: string
          difficulty: string
          title: string
          description: string
          created_at: string
          source_url?: string
        }
        Insert: {
          id?: string
          content: string
          language: string
          difficulty: string
          title: string
          description: string
          created_at?: string
          source_url?: string
        }
        Update: {
          id?: string
          content?: string
          language?: string
          difficulty?: string
          title?: string
          description?: string
          created_at?: string
          source_url?: string
        }
      }
      race_rooms: {
        Row: {
          id: string
          name: string
          created_by: string
          status: 'waiting' | 'in_progress' | 'completed'
          max_players: number
          current_players: number
          text_id: string
          created_at: string
          finished_at?: string
          is_private: boolean
          access_code?: string
        }
        Insert: {
          id?: string
          name: string
          created_by: string
          status?: 'waiting' | 'in_progress' | 'completed'
          max_players?: number
          current_players?: number
          text_id: string
          created_at?: string
          finished_at?: string
          is_private?: boolean
          access_code?: string
        }
        Update: {
          id?: string
          name?: string
          created_by?: string
          status?: 'waiting' | 'in_progress' | 'completed'
          max_players?: number
          current_players?: number
          text_id?: string
          created_at?: string
          finished_at?: string
          is_private?: boolean
          access_code?: string
        }
      }
      race_participants: {
        Row: {
          id: string
          race_id: string
          user_id: string
          status: 'waiting' | 'ready' | 'racing' | 'finished'
          progress: number
          wpm: number
          accuracy: number
          finished_at?: string
          created_at: string
        }
        Insert: {
          id?: string
          race_id: string
          user_id: string
          status?: 'waiting' | 'ready' | 'racing' | 'finished'
          progress?: number
          wpm?: number
          accuracy?: number
          finished_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          race_id?: string
          user_id?: string
          status?: 'waiting' | 'ready' | 'racing' | 'finished'
          progress?: number
          wpm?: number
          accuracy?: number
          finished_at?: string
          created_at?: string
        }
      }
      leaderboard_cache: {
        Row: {
          id: string
          user_id: string
          period: 'daily' | 'weekly' | 'monthly' | 'all_time'
          category: string
          score: number
          rank: number
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          period: 'daily' | 'weekly' | 'monthly' | 'all_time'
          category: string
          score: number
          rank: number
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          period?: 'daily' | 'weekly' | 'monthly' | 'all_time'
          category?: string
          score?: number
          rank?: number
          updated_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          settings: {
            soundEnabled: boolean
            theme: 'light' | 'dark' | 'system'
            keyboardLayout: 'standard' | 'dvorak' | 'colemak'
            showLiveWPM: boolean
            showProgressBar: boolean
          }
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          settings: {
            soundEnabled: boolean
            theme: 'light' | 'dark' | 'system'
            keyboardLayout: 'standard' | 'dvorak' | 'colemak'
            showLiveWPM: boolean
            showProgressBar: boolean
          }
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          settings?: {
            soundEnabled?: boolean
            theme?: 'light' | 'dark' | 'system'
            keyboardLayout?: 'standard' | 'dvorak' | 'colemak'
            showLiveWPM?: boolean
            showProgressBar?: boolean
          }
          created_at?: string
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
  }
} 