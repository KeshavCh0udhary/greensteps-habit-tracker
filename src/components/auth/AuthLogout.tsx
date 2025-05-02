
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export function AuthLogout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  useEffect(() => {
    // Only redirect on protected routes when not authenticated
    if (!user && location.pathname.startsWith("/dashboard")) {
      toast.info("Session ended", {
        description: "Please log in to continue."
      });
      navigate("/");
    }
  }, [user, navigate, location.pathname]);
  
  return null;
}

export default AuthLogout;
