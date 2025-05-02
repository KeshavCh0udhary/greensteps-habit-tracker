
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const signUpUser = async (email: string, password: string) => {
  try {
    console.log("Attempting to sign up with email:", email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          display_name: email.split('@')[0]
        }
      },
    });

    if (error) {
      throw error;
    }

    // Check if session exists (auto sign-in)
    if (data?.session) {
      console.log("Sign up successful with immediate session");
    } else {
      console.log("Sign up successful, email confirmation required");
      toast.success("Account created!", {
        description: "Please check your email to verify your account."
      });
    }
    
    return { error: null, success: true };
  } catch (error) {
    console.error("Error signing up:", error);
    return { error: error as Error, success: false };
  }
};

export const signInUser = async (email: string, password: string) => {
  try {
    console.log("Attempting to sign in with email:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (!data.session) {
      throw new Error("No session returned from sign in");
    }

    console.log("Sign in successful", data.session);
    return { error: null, success: true };
  } catch (error) {
    console.error("Error signing in:", error);
    return { error: error as Error, success: false };
  }
};

export const signOutUser = async () => {
  console.log("Attempting to sign out");
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    console.log("Sign out successful");
    return { error: null, success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    toast.error("Failed to sign out", {
      description: "Please try again later."
    });
    return { error: error as Error, success: false };
  }
};

export const resetUserPassword = async (email: string) => {
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

export const checkSupabaseConnection = async () => {
  try {
    // Simple check to see if we can connect to Supabase
    const { data, error } = await supabase.auth.getSession();
    
    if (error && error.message && error.message.includes('Failed to fetch')) {
      console.warn('Supabase connection not available.');
      return false;
    }
    
    // Successfully connected to Supabase, whether or not a session exists
    return true;
  } catch (error) {
    console.error("Error checking Supabase connection:", error);
    return false;
  }
};
