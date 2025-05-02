
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

interface AuthLogoutProps {
  children?: (props: { logout: () => void }) => React.ReactNode;
}

export function AuthLogout({ children }: AuthLogoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, signOut } = useAuth();
  
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
  
  const logout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };

  return children ? children({ logout }) : null;
}

export default AuthLogout;
