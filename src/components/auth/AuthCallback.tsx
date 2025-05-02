
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback: processing authentication");
        
        // Get session from URL hash
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          throw error;
        }

        if (data?.session) {
          // Successfully authenticated
          console.log("Auth callback: session found, redirecting to dashboard");
          toast.success("Login successful!", { 
            description: "Welcome back!"
          });
          
          // Use replace: true to prevent going back to the callback page
          navigate("/dashboard", { replace: true });
        } else {
          console.error("No session found in auth callback");
          throw new Error("No session found");
        }
      } catch (e) {
        console.error("Error during auth callback:", e);
        setError("Authentication failed. Please try again.");
        
        // Redirect back to login after a delay
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <p>Redirecting you to login...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Loader2 className="h-8 w-8 animate-spin mb-4" />
      <p>Completing your sign in...</p>
    </div>
  );
};

export default AuthCallback;
