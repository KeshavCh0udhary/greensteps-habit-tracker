
import PageLayout from "@/components/layout/PageLayout";
import SignupForm from "@/components/auth/SignupForm";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

const Signup = () => {
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
        <div className="leaf-decoration top-40 left-40 animate-leaf-sway" style={{ animationDelay: "0.7s" }}>
          🌱
        </div>
        <div className="leaf-decoration bottom-40 right-40 animate-leaf-sway" style={{ animationDelay: "1.5s" }}>
          🌿
        </div>
        
        {/* Signup Form */}
        <SignupForm />
      </div>
    </PageLayout>
  );
};

export default Signup;
