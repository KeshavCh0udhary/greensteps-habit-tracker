
import { useState, useEffect, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
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
  
  useEffect(() => {
    const setupAuth = async () => {
      try {
        // Check if Supabase is properly connected
        const isConnected = await checkSupabaseConnection();
        setIsSupabaseConnected(isConnected);
        
        if (!isConnected) {
          console.error("Supabase connection not available");
          setLoading(false);
          return;
        }

        // Get initial session (and retry once if needed)
        const getInitialSession = async (retryCount = 0) => {
          try {
            const { data } = await supabase.auth.getSession();
            
            console.log("Initial session state:", {
              session: data.session,
              user: data.session?.user ?? null,
              isActive: !!data.session,
            });
            
            if (data.session) {
              setSession(data.session);
              setUser(data.session.user);
            }
            
            setLoading(false);
          } catch (error) {
            console.error("Error loading auth session:", error);
            
            // Try once more if first attempt failed
            if (retryCount === 0) {
              console.log("Retrying session fetch...");
              setTimeout(() => getInitialSession(1), 1000);
            } else {
              setLoading(false);
            }
          }
        };

        // Get initial session
        await getInitialSession();
        
        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, newSession) => {
            console.log("Auth state changed:", event, newSession?.user?.email);
            
            // Update the session and user state
            setSession(newSession);
            setUser(newSession?.user ?? null);
            
            if (event === 'SIGNED_IN') {
              // Show welcome message
              toast.success("Welcome back!", {
                description: "You've successfully logged in."
              });
              
              // Navigate to dashboard if on landing page
              if (window.location.pathname === '/') {
                window.location.href = '/dashboard';
              }
            } else if (event === 'SIGNED_OUT') {
              // Toast notification for logout
              toast.info("You've been logged out", {
                description: "Come back soon!"
              });
              
              // Redirect to landing page after logout
              window.location.href = '/';
            } else if (event === 'TOKEN_REFRESHED') {
              console.log("Auth token refreshed successfully");
            }
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error setting up auth:", error);
        setLoading(false);
      }
    };

    setupAuth();
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
