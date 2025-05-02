
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import AuthModal from "@/components/auth/AuthModal";
import { motion } from "framer-motion";

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const publicNavItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Blogs", path: "/blogs" },
    { name: "FAQs", path: "/faqs" },
    { name: "Community", path: "/community" },
  ];

  const authenticatedNavItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "My Habits", path: "/habits" },
    { name: "Community", path: "/community" },
    { name: "Progress", path: "/progress" },
  ];

  const navItems = user ? authenticatedNavItems : publicNavItems;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-2 bg-background/90 backdrop-blur-lg shadow-sm"
          : "py-4 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo withText />
        </Link>

        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`relative px-4 py-2 rounded-lg text-foreground transition-colors group ${
                location.pathname === item.path
                  ? "font-medium text-primary"
                  : "hover:text-primary"
              }`}
            >
              {item.name}
              <motion.span 
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded transform origin-left ${
                  location.pathname === item.path ? "scale-x-100" : "scale-x-0"
                }`}
                initial={false}
                animate={{ scaleX: location.pathname === item.path ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded transform origin-left scale-x-0 transition-transform group-hover:scale-x-100" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Button onClick={signOut} variant="ghost">Log out</Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <AuthModal defaultTab="login">
                <Button variant="outline" className="rounded-full px-6">Log in</Button>
              </AuthModal>
              <AuthModal defaultTab="signup">
                <Button className="rounded-full px-6">Sign up</Button>
              </AuthModal>
            </div>
          )}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent/50"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <ChevronDown
              className={`h-5 w-5 transition-transform ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen
            ? "max-h-96 border-b border-border/50 bg-background/95 backdrop-blur-lg"
            : "max-h-0"
        }`}
      >
        <div className="container mx-auto px-4 py-2 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`block px-4 py-2 rounded-lg hover:bg-accent/50 transition-all ${
                location.pathname === item.path
                  ? "font-medium text-primary bg-accent/50"
                  : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          {user ? (
            <div className="flex flex-col pt-2 space-y-2 border-t border-border/50">
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Dashboard
                </Button>
              </Link>
              <Button 
                onClick={() => {
                  signOut();
                  setIsMenuOpen(false);
                }}
                className="w-full"
              >
                Log out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col pt-2 space-y-2 border-t border-border/50">
              <AuthModal defaultTab="login">
                <Button variant="outline" className="w-full" onClick={() => setIsMenuOpen(false)}>
                  Log in
                </Button>
              </AuthModal>
              <AuthModal defaultTab="signup">
                <Button className="w-full" onClick={() => setIsMenuOpen(false)}>
                  Sign up
                </Button>
              </AuthModal>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
