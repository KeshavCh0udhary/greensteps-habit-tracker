
import PageLayout from "@/components/layout/PageLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
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
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <ForgotPasswordForm />
      </div>
    </PageLayout>
  );
};

export default ForgotPassword;
