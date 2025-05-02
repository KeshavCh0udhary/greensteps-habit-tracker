
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from "@/integrations/supabase/types";

// Initialize Supabase client
let supabase: SupabaseClient<Database>;

const initSupabase = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://orefbswiccpmhnvbrloe.supabase.co";
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZWZic3dpY2NwbWhudmJybG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNjgzNTEsImV4cCI6MjA2MTc0NDM1MX0.m5Tg13svNzOaZhxZEOqgQ0lT97nppkQUvaXy11l1WrA";

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials are missing. Please connect your project to Supabase for full functionality.');
    return createClient<Database>('https://placeholder-url.supabase.co', 'placeholder-key');
  }

  try {
    supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    });
    
    console.log("Supabase client initialized with URL:", supabaseUrl);
    return supabase;
  } catch (error) {
    console.error("Error initializing Supabase client:", error);
    // Create a fallback client that will fail gracefully
    return createClient<Database>('https://placeholder-url.supabase.co', 'placeholder-key');
  }
};

// Export initialized client or init if not already done
export const getSupabaseClient = (): SupabaseClient<Database> => {
  if (!supabase) {
    return initSupabase();
  }
  return supabase;
};
