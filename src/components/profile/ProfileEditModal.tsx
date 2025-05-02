
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";
import { Upload, X, Check } from "lucide-react";
import { showConfetti } from "@/lib/confetti";

interface ProfileEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: any;
  onProfileUpdate: (profile: any) => void;
}

const ProfileEditModal = ({ open, onOpenChange, profile, onProfileUpdate }: ProfileEditModalProps) => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image too large", {
        description: "Please select an image under 2MB"
      });
      return;
    }
    
    setAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };
  
  const handleSave = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      let avatarUrl = profile?.avatar_url;
      
      // Upload new avatar if one is selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `avatars/${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('avatars')
          .upload(filePath, avatarFile);
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL
        const { data } = supabase
          .storage
          .from('avatars')
          .getPublicUrl(filePath);
          
        avatarUrl = data.publicUrl;
      }
      
      // Update profile
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          display_name: displayName,
          avatar_url: avatarUrl
        })
        .eq('id', user.id)
        .select()
        .single();
        
      if (error) throw error;

      // Show success animation
      setIsSaveSuccess(true);
      setTimeout(() => {
        setIsSaveSuccess(false);
        onProfileUpdate(data);
        onOpenChange(false);
        showConfetti();
      }, 1500);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Your Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-primary/20">
                <AvatarImage src={avatarPreview || undefined} />
                <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                  {displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              
              {avatarPreview && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                  onClick={handleRemoveAvatar}
                >
                  <X className="h-4 w-4" />
                </motion.button>
              )}
            </div>
            
            <div>
              <Label 
                htmlFor="avatar-upload" 
                className="cursor-pointer inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <Upload className="h-4 w-4" />
                {avatarPreview ? "Change Avatar" : "Upload Avatar"}
              </Label>
              <Input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarChange}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Max file size: 2MB
              </p>
            </div>
          </div>
          
          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input 
              id="name" 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
              className="focus-visible:ring-primary/50"
            />
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row sm:justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isLoading || isSaveSuccess}
            className="relative overflow-hidden"
          >
            {!isSaveSuccess && !isLoading && (
              <span>Save Changes</span>
            )}
            
            {isLoading && (
              <span className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 border-2 border-t-transparent border-white rounded-full"
                />
                Saving...
              </span>
            )}
            
            {isSaveSuccess && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-green-500"
              >
                <Check className="h-5 w-5 text-white" />
              </motion.div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditModal;
