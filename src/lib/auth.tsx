
import { createContext, useContext, useEffect, useState } from "react";
import { getSupabaseClient } from "./supabase";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    success: boolean;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    success: boolean;
  }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{
    error: Error | null;
    success: boolean;
  }>;
  isSupabaseConnected: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const supabase = getSupabaseClient();
  
  useEffect(() => {
    const setupAuth = async () => {
      try {
        // Check if Supabase is properly connected by testing a basic API call
        const { data, error } = await supabase.auth.getSession();
        
        if (error && error.message.includes('Failed to fetch')) {
          console.warn('Supabase connection not available.');
          setIsSupabaseConnected(false);
          setLoading(false);
          return;
        }

        setIsSupabaseConnected(true);
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (error) {
        console.error("Error loading auth:", error);
        setIsSupabaseConnected(false);
      } finally {
        setLoading(false);
      }
    };

    setupAuth();

    // Only set up auth state change listener if Supabase is connected
    let subscription: { unsubscribe: () => void } | undefined;
    
    try {
      const { data } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );
      subscription = data.subscription;
    } catch (error) {
      console.warn('Failed to set up auth state change listener:', error);
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseConnected) {
      return { 
        error: new Error('Supabase is not connected. Please connect your project to Supabase first.'),
        success: false 
      };
    }
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      return { error: null, success: true };
    } catch (error) {
      console.error("Error signing up:", error);
      return { error: error as Error, success: false };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConnected) {
      return { 
        error: new Error('Supabase is not connected. Please connect your project to Supabase first.'),
        success: false 
      };
    }
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return { error: null, success: true };
    } catch (error) {
      console.error("Error signing in:", error);
      return { error: error as Error, success: false };
    }
  };

  const signOut = async () => {
    if (isSupabaseConnected) {
      await supabase.auth.signOut();
      // The navigation to landing page will be handled by the AuthLogout component
    }
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseConnected) {
      return { 
        error: new Error('Supabase is not connected. Please connect your project to Supabase first.'),
        success: false 
      };
    }
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        throw error;
      }

      return { error: null, success: true };
    } catch (error) {
      console.error("Error resetting password:", error);
      return { error: error as Error, success: false };
    }
  };

  const value = {
    session,
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    isSupabaseConnected,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Create a component for handling logout redirects
export function AuthLogout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) {
      // Redirect to landing page when logged out
      navigate("/");
    }
  }, [user, navigate]);
  
  return null;
}
