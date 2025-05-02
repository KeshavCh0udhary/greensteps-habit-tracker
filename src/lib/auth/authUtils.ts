
import { getSupabaseClient } from "../supabase";
import { toast } from "sonner";

export const signUpUser = async (email: string, password: string) => {
  const supabase = getSupabaseClient();
  
  try {
    console.log("Attempting to sign up with email:", email);
    const { error } = await supabase.auth.signUp({
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

    toast.success("Account created!", {
      description: "Please check your email to verify your account."
    });
    
    return { error: null, success: true };
  } catch (error) {
    console.error("Error signing up:", error);
    return { error: error as Error, success: false };
  }
};

export const signInUser = async (email: string, password: string) => {
  const supabase = getSupabaseClient();
  
  try {
    console.log("Attempting to sign in with email:", email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    console.log("Sign in successful");
    return { error: null, success: true };
  } catch (error) {
    console.error("Error signing in:", error);
    return { error: error as Error, success: false };
  }
};

export const signOutUser = async () => {
  const supabase = getSupabaseClient();
  
  console.log("Attempting to sign out");
  try {
    await supabase.auth.signOut();
    console.log("Sign out successful");
  } catch (error) {
    console.error("Error signing out:", error);
    toast.error("Failed to sign out", {
      description: "Please try again later."
    });
  }
};

export const resetUserPassword = async (email: string) => {
  const supabase = getSupabaseClient();
  
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
    const supabaseClient = getSupabaseClient();
    const { data, error } = await supabaseClient.auth.getSession();
    
    if (error && error.message.includes('Failed to fetch')) {
      console.warn('Supabase connection not available.');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error checking Supabase connection:", error);
    return false;
  }
};
