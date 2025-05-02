
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import AuthModal from "@/components/auth/AuthModal";
import { motion } from "framer-motion";
import { 
  Avatar,
  AvatarImage,
  AvatarFallback 
} from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
            <div className="hidden md:flex items-center space-x-3">
              <Link to="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative p-0 h-10 w-10 rounded-full overflow-hidden border"
                  >
                    <Avatar>
                      <AvatarImage 
                        src={user.user_metadata?.avatar_url} 
                        alt={user.user_metadata?.display_name || user.email} 
                      />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {user.user_metadata?.display_name?.charAt(0) || user.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 mt-2" align="end">
                  <div className="space-y-3">
                    <div className="border-b pb-2">
                      <p className="text-sm font-medium">
                        {user.user_metadata?.display_name || user.email?.split('@')[0]}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="space-y-1.5">
                      <Link 
                        to="/profile" 
                        className="block text-sm px-2 py-1.5 rounded-md hover:bg-accent transition-colors"
                      >
                        Your Profile
                      </Link>
                      <Link 
                        to="/dashboard" 
                        className="block text-sm px-2 py-1.5 rounded-md hover:bg-accent transition-colors"
                      >
                        Dashboard
                      </Link>
                      <button 
                        onClick={signOut} 
                        className="w-full text-left text-sm px-2 py-1.5 rounded-md text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
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
              <Link 
                to="/profile" 
                className="flex items-center px-4 py-2 rounded-lg hover:bg-accent/50"
                onClick={() => setIsMenuOpen(false)}
              >
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage 
                    src={user.user_metadata?.avatar_url} 
                    alt={user.user_metadata?.display_name || user.email} 
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {user.user_metadata?.display_name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                Your Profile
              </Link>
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
