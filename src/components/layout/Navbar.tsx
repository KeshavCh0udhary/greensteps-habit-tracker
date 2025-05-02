
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Logo from "@/components/layout/Logo";
import { Menu, X, User, Settings, LogOut, Award, Leaf, Calendar, Users } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import AuthLogout from "@/components/auth/AuthLogout";

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileData, setProfileData] = useState<{ display_name?: string | null, avatar_url?: string | null } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthenticated = !!user;
  const isLandingPage = location.pathname === "/";

  // Check if on dashboard or authenticated-only pages
  const isDashboardPage = location.pathname.includes("/dashboard") || 
                         location.pathname === "/habits" || 
                         location.pathname === "/progress" ||
                         location.pathname === "/community";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch profile data when user is authenticated
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('display_name, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [user]);

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (profileData?.display_name) {
      return profileData.display_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
    }
    
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    
    return 'U';
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <AnimatePresence>
      <motion.header
        key="navbar"
        initial="hidden"
        animate="visible"
        variants={navVariants}
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled || isDashboardPage
            ? "bg-background/80 backdrop-blur-lg shadow-sm"
            : isLandingPage
            ? "bg-transparent"
            : "bg-background/80 backdrop-blur-lg"
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <motion.span
              variants={itemVariants}
              className="font-bold text-lg md:text-xl hidden sm:block"
            >
              GreenSteps
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              isDashboardPage ? (
                // Dashboard navigation when authenticated and on dashboard pages
                <motion.nav variants={itemVariants} className="flex items-center gap-1 mr-4">
                  <Link to="/dashboard">
                    <Button 
                      variant={location.pathname === "/dashboard" ? "default" : "ghost"} 
                      className="flex items-center gap-1"
                    >
                      <Leaf className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Button>
                  </Link>
                  <Link to="/habits">
                    <Button 
                      variant={location.pathname === "/habits" ? "default" : "ghost"} 
                      className="flex items-center gap-1"
                    >
                      <Leaf className="h-4 w-4" />
                      <span>My Habits</span>
                    </Button>
                  </Link>
                  <Link to="/progress">
                    <Button 
                      variant={location.pathname === "/progress" ? "default" : "ghost"} 
                      className="flex items-center gap-1"
                    >
                      <Award className="h-4 w-4" />
                      <span>Progress</span>
                    </Button>
                  </Link>
                  <Link to="/community">
                    <Button 
                      variant={location.pathname === "/community" ? "default" : "ghost"} 
                      className="flex items-center gap-1"
                    >
                      <Users className="h-4 w-4" />
                      <span>Community</span>
                    </Button>
                  </Link>
                </motion.nav>
              ) : (
                // Main navigation when authenticated but not on dashboard
                <motion.nav variants={itemVariants} className="flex items-center gap-1 mr-4">
                  <Link to="/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                  <Link to="/about">
                    <Button variant="ghost">About</Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="ghost">Contact</Button>
                  </Link>
                </motion.nav>
              )
            ) : (
              // Main navigation when not authenticated
              <motion.nav variants={itemVariants} className="flex items-center gap-1 mr-4">
                <Link to="/about">
                  <Button variant="ghost">About</Button>
                </Link>
                <Link to="/faqs">
                  <Button variant="ghost">FAQs</Button>
                </Link>
                <Link to="/contact">
                  <Button variant="ghost">Contact</Button>
                </Link>
              </motion.nav>
            )}

            <ThemeToggle />

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full ml-2">
                    <Avatar className="h-9 w-9">
                      {profileData?.avatar_url ? (
                        <AvatarImage src={profileData.avatar_url} alt="Profile" />
                      ) : null}
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {profileData?.display_name || user?.email || 'My Account'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/dashboard/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/dashboard">
                    <DropdownMenuItem className="cursor-pointer">
                      <Leaf className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/progress">
                    <DropdownMenuItem className="cursor-pointer">
                      <Award className="mr-2 h-4 w-4" />
                      <span>My Progress</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/habits">
                    <DropdownMenuItem className="cursor-pointer">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>My Habits</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <AuthLogout>
                    {({ logout }) => (
                      <DropdownMenuItem 
                        className="text-red-500 cursor-pointer"
                        onClick={() => logout()}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log Out</span>
                      </DropdownMenuItem>
                    )}
                  </AuthLogout>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center md:hidden gap-2">
            <ThemeToggle />
            
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85%] sm:max-w-md">
                <SheetHeader className="mb-4">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigate through the GreenSteps eco-platform
                  </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-3 py-4">
                  {isAuthenticated ? (
                    <>
                      {/* User Profile Section */}
                      <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg mb-2">
                        <Avatar className="h-10 w-10">
                          {profileData?.avatar_url ? (
                            <AvatarImage src={profileData.avatar_url} alt="Profile" />
                          ) : null}
                          <AvatarFallback className="bg-primary/10">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{profileData?.display_name || 'User'}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                            {user?.email}
                          </p>
                        </div>
                      </div>

                      <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                        <SheetClose asChild>
                          <Button 
                            variant={location.pathname === "/dashboard" ? "default" : "outline"} 
                            className="w-full justify-start font-normal mb-1"
                          >
                            <Leaf className="mr-2 h-4 w-4" />
                            Dashboard
                          </Button>
                        </SheetClose>
                      </Link>

                      <Link to="/habits" onClick={() => setIsMobileMenuOpen(false)}>
                        <SheetClose asChild>
                          <Button 
                            variant={location.pathname === "/habits" ? "default" : "outline"} 
                            className="w-full justify-start font-normal mb-1"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            My Habits
                          </Button>
                        </SheetClose>
                      </Link>

                      <Link to="/progress" onClick={() => setIsMobileMenuOpen(false)}>
                        <SheetClose asChild>
                          <Button 
                            variant={location.pathname === "/progress" ? "default" : "outline"} 
                            className="w-full justify-start font-normal mb-1"
                          >
                            <Award className="mr-2 h-4 w-4" />
                            My Progress
                          </Button>
                        </SheetClose>
                      </Link>

                      <Link to="/community" onClick={() => setIsMobileMenuOpen(false)}>
                        <SheetClose asChild>
                          <Button 
                            variant={location.pathname === "/community" ? "default" : "outline"} 
                            className="w-full justify-start font-normal mb-1"
                          >
                            <Users className="mr-2 h-4 w-4" />
                            Community
                          </Button>
                        </SheetClose>
                      </Link>

                      <Link to="/dashboard/profile" onClick={() => setIsMobileMenuOpen(false)}>
                        <SheetClose asChild>
                          <Button 
                            variant={location.pathname === "/dashboard/profile" ? "default" : "outline"} 
                            className="w-full justify-start font-normal mt-2"
                          >
                            <User className="mr-2 h-4 w-4" />
                            Profile Settings
                          </Button>
                        </SheetClose>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                        <SheetClose asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start font-normal mb-1"
                          >
                            Home
                          </Button>
                        </SheetClose>
                      </Link>
                      
                      <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>
                        <SheetClose asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start font-normal mb-1"
                          >
                            About
                          </Button>
                        </SheetClose>
                      </Link>
                      
                      <Link to="/faqs" onClick={() => setIsMobileMenuOpen(false)}>
                        <SheetClose asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start font-normal mb-1"
                          >
                            FAQs
                          </Button>
                        </SheetClose>
                      </Link>
                      
                      <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                        <SheetClose asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start font-normal mb-1"
                          >
                            Contact
                          </Button>
                        </SheetClose>
                      </Link>
                      
                      <div className="flex gap-2 mt-3">
                        <Link to="/login" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                          <SheetClose asChild>
                            <Button variant="outline" className="w-full">
                              Login
                            </Button>
                          </SheetClose>
                        </Link>
                        <Link to="/signup" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                          <SheetClose asChild>
                            <Button className="w-full">Sign Up</Button>
                          </SheetClose>
                        </Link>
                      </div>
                    </>
                  )}

                  {isAuthenticated && (
                    <AuthLogout>
                      {({ logout }) => (
                        <SheetClose asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start font-normal mt-4 text-red-500 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-900/20"
                            onClick={() => {
                              logout();
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log Out
                          </Button>
                        </SheetClose>
                      )}
                    </AuthLogout>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.header>
    </AnimatePresence>
  );
};

export default Navbar;
