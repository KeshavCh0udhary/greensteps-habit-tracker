
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Loader2 } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if not loading and user is not authenticated
    if (!loading && !user) {
      console.log("No authenticated user found, redirecting to login");
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Show a loading state while authentication status is being determined
  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <div className="text-lg">Loading your dashboard...</div>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Don't render children until we know the user is authenticated
  if (!user || !session) {
    return null;
  }

  return <PageLayout>{children}</PageLayout>;
};

export default DashboardLayout;
