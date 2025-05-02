
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageLayout>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="space-y-4 max-w-md">
          <div className="text-6xl font-bold text-primary">404</div>
          <h1 className="text-2xl md:text-4xl font-bold">Page not found</h1>
          <p className="text-muted-foreground md:text-lg">
            Sorry, we couldn't find the page you're looking for. It might have been
            removed or relocated.
          </p>
          <div className="pt-4">
            <Button onClick={() => navigate("/")} size="lg">
              Return to homepage
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFound;
