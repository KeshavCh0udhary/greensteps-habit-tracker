
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

const VerifyEmail = () => {
  const location = useLocation();
  const email = location.state?.email || "your email";
  const { isSupabaseConnected } = useAuth();
  
  const handleResendVerification = () => {
    if (!isSupabaseConnected) {
      toast.error("Supabase not connected", {
        description: "Please connect your project to Supabase to enable authentication.",
      });
      return;
    }
    
    toast.success("Verification email sent", {
      description: "Please check your inbox for the verification link.",
    });
  };

  return (
    <div className="w-full max-w-md space-y-6 p-6 bg-card rounded-lg shadow-md eco-card">
      <div className="space-y-4 text-center">
        <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 w-16 h-16 mx-auto flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold">Verify your email</h2>
        {isSupabaseConnected ? (
          <p className="text-muted-foreground">
            We sent a verification link to <strong>{email}</strong>. Please check
            your inbox and verify your email to continue.
          </p>
        ) : (
          <p className="text-muted-foreground">
            <strong>Supabase is not connected.</strong> To enable email verification,
            please connect your project to Supabase using the Supabase button in the top right corner.
          </p>
        )}
      </div>
      <div className="space-y-4">
        {isSupabaseConnected ? (
          <p className="text-sm text-muted-foreground text-center">
            Didn't receive the email? Check your spam folder or request a new
            verification link.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground text-center">
            Authentication features require Supabase integration. Please connect your
            project to Supabase to access all features.
          </p>
        )}
        <div className="flex flex-col space-y-2">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleResendVerification}
          >
            Resend verification email
          </Button>
          <Link to="/login">
            <Button variant="ghost" className="w-full">
              Back to login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
