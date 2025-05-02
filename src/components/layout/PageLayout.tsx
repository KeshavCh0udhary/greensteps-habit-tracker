
import { ReactNode, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  withPadding?: boolean;
}

const PageLayout = ({ 
  children, 
  className = "", 
  withPadding = true 
}: PageLayoutProps) => {
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const storedTheme = localStorage.getItem("theme");
    
    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Scroll to top on page navigation
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-grow ${withPadding ? 'pt-16 md:pt-20' : ''} ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
