
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if not loading and user is not authenticated
    // This prevents premature redirects while authentication state is being determined
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Show a loading state while authentication status is being determined
  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-lg">Loading your dashboard...</div>
        </div>
      </PageLayout>
    );
  }

  // Don't render children until we know the user is authenticated
  if (!user) {
    return null;
  }

  return <PageLayout>{children}</PageLayout>;
};

export default DashboardLayout;
