
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
      } catch (error) {
        console.error("Error checking Supabase connection:", error);
        setIsSupabaseConnected(false);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state change listener first (BEFORE checking session)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
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
        } else if (event === 'SIGNED_OUT') {
          // Toast notification for logout
          toast.info("You've been logged out", {
            description: "Come back soon!"
          });
          
          // Redirect to landing page after logout
          window.location.href = '/';
        }
      }
    );

    // After setting up the listener, check for an existing session
    const getInitialSession = async () => {
      try {
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
        console.error("Error loading auth session:", error);
      } finally {
        setLoading(false);
      }
    };

    setupAuth();
    getInitialSession();

    return () => {
      subscription.unsubscribe();
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
