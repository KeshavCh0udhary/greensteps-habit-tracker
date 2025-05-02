
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export function AuthLogout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    // Only redirect on protected routes when not authenticated and not still loading
    // This prevents premature redirects while authentication state is being determined
    if (!loading && !user && location.pathname.startsWith("/dashboard")) {
      toast.info("Session ended", {
        description: "Please log in to continue."
      });
      navigate("/login");
    }
  }, [user, navigate, location.pathname, loading]);
  
  return null;
}

export default AuthLogout;
