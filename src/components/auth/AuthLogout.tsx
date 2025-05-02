
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

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

export default AuthLogout;
