
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Types for our database
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          display_name: string | null;
          avatar_url: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
          display_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          display_name?: string | null;
          avatar_url?: string | null;
        };
      };
      eco_habits: {
        Row: {
          id: string;
          title: string;
          emoji: string;
          eco_points: number;
        };
        Insert: {
          id?: string;
          title: string;
          emoji: string;
          eco_points: number;
        };
        Update: {
          id?: string;
          title?: string;
          emoji?: string;
          eco_points?: number;
        };
      };
      daily_logs: {
        Row: {
          id: string;
          user_id: string;
          habit_id: string;
          date: string;
          notes: string | null;
          eco_points: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          habit_id: string;
          date?: string;
          notes?: string | null;
          eco_points: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          habit_id?: string;
          date?: string;
          notes?: string | null;
          eco_points?: number;
        };
      };
      badges: {
        Row: {
          id: string;
          user_id: string;
          badge_type: string;
          earned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_type: string;
          earned_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          badge_type?: string;
          earned_at?: string;
        };
      };
    };
    Views: {
      global_stats_view: {
        Row: {
          date: string;
          total_points: number;
          most_logged_habit: string;
          total_logs: number;
        };
      };
    };
  };
};

// Initialize Supabase client
let supabase: SupabaseClient<Database>;

const initSupabase = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials are missing. Please connect your project to Supabase for full functionality.');
    // Create a mock client with empty URL and key that will fail gracefully
    // This prevents the app from crashing while still allowing rendering
    return createClient<Database>('https://placeholder-url.supabase.co', 'placeholder-key');
  }

  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
  return supabase;
};

// Export initialized client or init if not already done
export const getSupabaseClient = (): SupabaseClient<Database> => {
  if (!supabase) {
    return initSupabase();
  }
  return supabase;
};
