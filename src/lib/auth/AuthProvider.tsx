
import { useState, useEffect, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { getSupabaseClient } from "../supabase";
import { toast } from "sonner";
import AuthContext from "./AuthContext";
import { signUpUser, signInUser, signOutUser, resetUserPassword, checkSupabaseConnection } from "./authUtils";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const supabase = getSupabaseClient();
  
  useEffect(() => {
    const setupAuth = async () => {
      try {
        // Check if Supabase is properly connected
        const isConnected = await checkSupabaseConnection();
        setIsSupabaseConnected(isConnected);
        
        if (!isConnected) {
          setLoading(false);
          return;
        }

        // Get session data
        const { data } = await supabase.auth.getSession();
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        // Log the session state for debugging
        console.log("Initial session state:", {
          session: data.session,
          user: data.session?.user ?? null,
          isActive: !!data.session,
        });
      } catch (error) {
        console.error("Error loading auth:", error);
        setIsSupabaseConnected(false);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state change listener first (BEFORE checking session)
    let subscription: { unsubscribe: () => void } | undefined;
    
    try {
      const { data } = supabase.auth.onAuthStateChange(
        (event, newSession) => {
          console.log("Auth state changed:", event, newSession?.user?.email);
          
          // Update the session and user state immediately (synchronously)
          setSession(newSession);
          setUser(newSession?.user ?? null);
          setLoading(false);
          
          // Handle auth state changes for redirects
          if (event === 'SIGNED_IN') {
            // Show welcome message
            toast.success("Welcome back!", {
              description: "You've successfully logged in."
            });
            
            // Use setTimeout to avoid React state update conflicts
            setTimeout(() => {
              // Use window.location to ensure a full redirect that works with OAuth
              window.location.href = '/dashboard';
            }, 500);
          } else if (event === 'SIGNED_OUT') {
            // Toast notification for logout
            toast.info("You've been logged out", {
              description: "Come back soon!"
            });
            
            // Redirect to landing page after logout
            setTimeout(() => {
              window.location.href = '/';
            }, 500);
          } else if (event === 'TOKEN_REFRESHED') {
            // Log successful token refresh
            console.log('Auth token refreshed successfully');
          } else if (event === 'USER_UPDATED') {
            // Log user update
            console.log('User profile updated');
          }
        }
      );
      subscription = data.subscription;
    } catch (error) {
      console.warn('Failed to set up auth state change listener:', error);
    }

    setupAuth();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    loading,
    signUp: signUpUser,
    signIn: signInUser,
    signOut: signOutUser,
    resetPassword: resetUserPassword,
    isSupabaseConnected,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
