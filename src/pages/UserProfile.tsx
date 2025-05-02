
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import ProfileEditModal from "@/components/profile/ProfileEditModal";
import UserBadges from "@/components/profile/UserBadges";
import UserStats from "@/components/profile/UserStats";
import AccountSettings from "@/components/profile/AccountSettings";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, LogOut } from "lucide-react";

const UserProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };

  const onProfileUpdate = (updatedProfile: any) => {
    setProfile(updatedProfile);
    toast.success("Profile updated successfully!");
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-center">
            <div className="h-20 w-20 bg-muted rounded-full mx-auto mb-4"></div>
            <div className="h-6 w-48 bg-muted rounded mx-auto mb-2"></div>
            <div className="h-4 w-24 bg-muted rounded mx-auto"></div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4">
        <motion.div 
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <Card className="mb-8 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-green-600 to-green-400"></div>
            <div className="px-6 pb-6 relative">
              <div className="-mt-12 flex flex-col md:flex-row md:items-end gap-4">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="relative"
                >
                  <Avatar className="h-24 w-24 border-4 border-background">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                      {profile?.display_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-primary rounded-full flex items-center justify-center text-white text-sm shadow-md">
                    🍃
                  </div>
                </motion.div>
                
                <div className="flex-1 pt-4 md:pt-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold">{profile?.display_name || user?.email?.split('@')[0]}</h1>
                      <p className="text-muted-foreground">{user?.email}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Button 
                        onClick={() => setIsEditModalOpen(true)}
                        className="font-medium"
                        size="sm"
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit Profile
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-1" />
                        Log Out
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Stats Section */}
          <UserStats profile={profile} />

          {/* Badges Section */}
          <UserBadges userId={user?.id} />

          {/* Account Settings */}
          <AccountSettings user={user} />
          
          {/* Edit Profile Modal */}
          <ProfileEditModal
            open={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            profile={profile}
            onProfileUpdate={onProfileUpdate}
          />
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default UserProfile;
