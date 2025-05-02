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
          average_wpm: number
          best_wpm: number
          average_accuracy: number
          daily_streak: number
          level: number
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
          average_wpm?: number
          best_wpm?: number
          average_accuracy?: number
          daily_streak?: number
          level?: number
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
          average_wpm?: number
          best_wpm?: number
          average_accuracy?: number
          daily_streak?: number
          level?: number
          rank_points?: number
          last_active?: string
        }
      }
      typing_tests: {
        Row: {
          id: string
          user_id: string
          wpm: number
          accuracy: number
          duration: number
          character_count: number
          error_count: number
          test_type: 'practice' | 'race' | 'code'
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          wpm: number
          accuracy: number
          duration: number
          character_count: number
          error_count: number
          test_type: 'practice' | 'race' | 'code'
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          wpm?: number
          accuracy?: number
          duration?: number
          character_count?: number
          error_count?: number
          test_type?: 'practice' | 'race' | 'code'
          timestamp?: string
          created_at?: string
        }
      }
      typing_errors: {
        Row: {
          id: string
          user_id: string
          character: string
          count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          character: string
          count?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          character?: string
          count?: number
          created_at?: string
        }
      }
      user_stats: {
        Row: {
          user_id: string
          daily_streak: number
          last_test_date: string | null
          total_time_practiced: number
          level: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          daily_streak?: number
          last_test_date?: string | null
          total_time_practiced?: number
          level?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          daily_streak?: number
          last_test_date?: string | null
          total_time_practiced?: number
          level?: number
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          name: string
          description: string
          requirement_type: 'wpm' | 'accuracy' | 'tests_completed' | 'code_tests_completed' | 'accuracy_streak'
          requirement_value: number
          icon: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          requirement_type: 'wpm' | 'accuracy' | 'tests_completed' | 'code_tests_completed' | 'accuracy_streak'
          requirement_value: number
          icon?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          requirement_type?: 'wpm' | 'accuracy' | 'tests_completed' | 'code_tests_completed' | 'accuracy_streak'
          requirement_value?: number
          icon?: string | null
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          unlocked_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          unlocked_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          unlocked_at?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_rank: {
        Args: { target_user_id: string }
        Returns: { rank: number }[]
      }
      update_daily_streak: {
        Args: { user_id_param: string }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
} 