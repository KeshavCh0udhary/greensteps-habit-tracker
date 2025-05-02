
import PageLayout from "@/components/layout/PageLayout";
import LoginForm from "@/components/auth/LoginForm";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse-gentle">Loading...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="leaf-decoration top-40 left-40 animate-leaf-sway" style={{ animationDelay: "0.3s" }}>
          🌿
        </div>
        <div className="leaf-decoration bottom-40 right-40 animate-leaf-sway" style={{ animationDelay: "1.2s" }}>
          🌱
        </div>
        
        {/* Login Form */}
        <LoginForm />
      </div>
    </PageLayout>
  );
};

export default Login;
