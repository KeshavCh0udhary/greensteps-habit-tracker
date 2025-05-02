
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { useEffect } from "react";
import AuthLogout from "./components/auth/AuthLogout";
import AuthCallback from "./components/auth/AuthCallback";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import NotFound from "./pages/NotFound";

// New Pages
import About from "./pages/About";
import Blogs from "./pages/Blogs";
import FAQs from "./pages/FAQs";
import Community from "./pages/Community";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import UserProfile from "./pages/UserProfile";
import { toast } from "sonner";

const queryClient = new QueryClient();

const App = () => {
  // Set theme based on user preference or system theme
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const storedTheme = localStorage.getItem("theme");
    
    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Welcome back toast - only shown when returning from another session
    const lastVisit = localStorage.getItem("lastVisit");
    const now = new Date().toDateString();
    
    if (lastVisit && lastVisit !== now) {
      // User is returning from a previous session
      setTimeout(() => {
        toast.custom(
          (id) => (
            <div className="animate-enter overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/90 dark:to-emerald-900/80 border border-green-200 dark:border-green-700 p-5 rounded-lg shadow-lg flex gap-4 items-center">
              <div className="bg-green-500 h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center text-white">
                🌿
              </div>
              <div>
                <h3 className="font-bold text-green-800 dark:text-green-100">Welcome back to GreenSteps!</h3>
                <p className="text-sm text-green-700 dark:text-green-200">Ready to continue your eco-journey today?</p>
              </div>
              <button 
                onClick={() => toast.dismiss(id)}
                className="ml-4 bg-green-100 dark:bg-green-800/50 h-6 w-6 flex items-center justify-center rounded-full"
              >
                ×
              </button>
            </div>
          ),
          { duration: 5000 }
        );
      }, 1500);
    }
    
    // Update last visit timestamp
    localStorage.setItem("lastVisit", now);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner 
            theme="light"
            position="top-center" 
            closeButton
            expand
            toastOptions={{
              classNames: {
                toast: "group toast bg-white dark:bg-zinc-800 border-green-200 dark:border-green-800",
                title: "text-green-700 dark:text-green-200 font-medium",
                description: "text-green-600 dark:text-green-300 text-sm"
              },
              duration: 4000
            }}
          />
          <BrowserRouter>
            <AuthLogout />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* Public Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/community" element={<Community />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/careers" element={<Careers />} />
              
              {/* User Profile */}
              <Route path="/profile" element={<UserProfile />} />

              {/* Dashboard Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                } 
              />
              
              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
