
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-mobile";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { X } from "lucide-react";

type AuthModalProps = {
  defaultTab?: "login" | "signup";
  children: React.ReactNode;
  redirectTo?: string;
};

const AuthModal = ({ 
  defaultTab = "login", 
  children, 
  redirectTo = "/dashboard" 
}: AuthModalProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);
  const isMobile = useMediaQuery("(max-width: 640px)");

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as "login" | "signup");
  };

  const renderAuthContent = () => (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Welcome</h2>
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setOpen(false)}
            className="rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Tabs 
        defaultValue={activeTab} 
        value={activeTab} 
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login" className="mt-0">
          <LoginForm />
        </TabsContent>
        <TabsContent value="signup" className="mt-0">
          <SignupForm />
        </TabsContent>
      </Tabs>
    </div>
  );

  return isMobile ? (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90%] pt-6">
        {renderAuthContent()}
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {renderAuthContent()}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
