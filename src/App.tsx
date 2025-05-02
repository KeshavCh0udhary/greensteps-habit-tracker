
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

import Index from "@/pages/Index";
import Landing from "@/pages/Landing";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import FAQs from "@/pages/FAQs";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Dashboard from "@/pages/Dashboard/Dashboard";
import DashboardLayout from "@/pages/Dashboard/DashboardLayout";
import Habits from "@/pages/Habits";
import Progress from "@/pages/Progress";
import Community from "@/pages/Community";
import VerifyEmailPage from "@/pages/VerifyEmailPage";
import UserProfile from "@/pages/UserProfile";
import AuthCallback from "@/components/auth/AuthCallback";
import Careers from "@/pages/Careers";
import Blogs from "@/pages/Blogs";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} index />
              <Route path="/home" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              <Route path="/dashboard" element={<DashboardLayout><Outlet /></DashboardLayout>}>
                <Route index element={<Dashboard />} />
                <Route path="profile" element={<UserProfile />} />
              </Route>
              
              <Route path="/habits" element={<Habits />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/community" element={<Community />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster position="top-center" />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
