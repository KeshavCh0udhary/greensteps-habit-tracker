
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Plus, ArrowLeft } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link } from "react-router-dom";

// Types for our data
interface Habit {
  id: string;
  emoji: string;
  title: string;
  eco_points: number;
}

// Available emoji choices for custom habits
const emojiChoices = [
  "🚲", "🌱", "🌿", "🌳", "🌞", "🚶‍♂️", "🔋", "♻️", "🥗", 
  "🚿", "🌊", "📱", "💡", "🥤", "👜", "🚰", "🍽️", "🥬", "🚫", "🧹"
];

const Habits = () => {
  const { user } = useAuth();
  const [showAddHabitDialog, setShowAddHabitDialog] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      emoji: "🌱",
      eco_points: 1
    }
  });

  const formEmoji = watch("emoji");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Fetch eco habits
  const { data: habits, isLoading: habitsLoading, refetch: refetchHabits } = useQuery({
    queryKey: ['eco-habits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('eco_habits')
        .select('*')
        .order('title', { ascending: true });
        
      if (error) throw error;
      return data as Habit[];
    }
  });

  // Handle creating a new custom habit
  const handleCreateHabit = async (data: { title: string, emoji: string, eco_points: number }) => {
    try {
      // Insert the new habit into the database
      const { error } = await supabase
        .from('eco_habits')
        .insert([{
          title: data.title,
          emoji: data.emoji,
          eco_points: Number(data.eco_points)
        }]);
      
      if (error) throw error;
      
      // Display success animation
      toast.success("New habit created!", {
        description: `"${data.title}" is now ready to use`
      });
      
      // Reset form and close dialog
      reset();
      setShowAddHabitDialog(false);
      
      // Refetch habits
      refetchHabits();
    } catch (error) {
      console.error("Error creating habit:", error);
      toast.error("Failed to create habit", {
        description: "Please try again later."
      });
    }
  };

  // Handle deleting a habit
  const handleDeleteHabit = async () => {
    if (!habitToDelete) return;
    
    try {
      const { error } = await supabase
        .from('eco_habits')
        .delete()
        .eq('id', habitToDelete.id);
      
      if (error) throw error;
      
      toast.success("Habit deleted", {
        description: `"${habitToDelete.title}" has been removed`
      });
      
      setHabitToDelete(null);
      refetchHabits();
    } catch (error) {
      console.error("Error deleting habit:", error);
      toast.error("Failed to delete habit", {
        description: "Please try again later."
      });
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setValue("emoji", emoji);
    setShowEmojiPicker(false);
  };

  return (
    <PageLayout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-4 md:p-6 min-h-screen pt-20"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center gap-3"
        >
          <Link to="/dashboard">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-br from-green-700 to-green-500 bg-clip-text text-transparent">
              My Eco-Habits
            </h1>
            <p className="text-muted-foreground">View, create, and manage your eco-friendly habits.</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>All Habits</CardTitle>
                  <CardDescription>Eco-friendly habits you can log daily</CardDescription>
                </div>
                <Dialog open={showAddHabitDialog} onOpenChange={setShowAddHabitDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="flex items-center gap-1">
                      <Plus className="h-4 w-4" />
                      <span>New Habit</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create Custom Eco-Habit</DialogTitle>
                      <DialogDescription>
                        Add a new eco-friendly habit to track. Custom habits are visible to all users.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(handleCreateHabit)}>
                      <div className="space-y-4 py-2">
                        <div className="grid grid-cols-4 gap-4">
                          <div className="col-span-1">
                            <Label htmlFor="emoji">Emoji</Label>
                            <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="text-center text-xl w-full h-10"
                                  type="button"
                                >
                                  {formEmoji}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-64 p-2">
                                <div className="grid grid-cols-6 gap-2">
                                  {emojiChoices.map((emoji) => (
                                    <Button
                                      key={emoji}
                                      variant="ghost"
                                      className="h-10 w-10 p-0 text-xl transition-transform hover:scale-125"
                                      onClick={() => handleEmojiSelect(emoji)}
                                    >
                                      {emoji}
                                    </Button>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                            <input type="hidden" {...register("emoji")} />
                          </div>
                          <div className="col-span-3">
                            <Label htmlFor="title">Habit Title</Label>
                            <Input
                              id="title"
                              placeholder="E.g., Used Reusable Bag"
                              {...register("title", { required: true })}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="eco_points">Eco Points (0.5-5)</Label>
                          <Input
                            id="eco_points"
                            type="number"
                            min="0.5"
                            max="5"
                            step="0.5"
                            {...register("eco_points", { 
                              required: true,
                              min: 0.5,
                              max: 5,
                              valueAsNumber: true
                            })}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Assign points based on environmental impact (0.5-5)
                          </p>
                        </div>
                      </div>
                      <DialogFooter className="mt-4">
                        <Button 
                          type="submit" 
                          className="relative overflow-hidden bg-green-600 hover:bg-green-700"
                        >
                          Create Habit
                          <motion.div 
                            className="absolute inset-0 bg-white" 
                            initial={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1.5, opacity: 0.1 }}
                            transition={{ duration: 0.5 }}
                          />
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {habitsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="animate-pulse flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded-full"></div>
                          <div className="space-y-2">
                            <div className="h-4 w-24 bg-muted rounded"></div>
                            <div className="h-3 w-16 bg-muted rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    className="space-y-2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {habits?.map((habit) => (
                      <motion.div 
                        key={habit.id} 
                        variants={itemVariants}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                            {habit.emoji}
                          </div>
                          <div>
                            <h3 className="font-medium">{habit.title}</h3>
                            <p className="text-xs text-muted-foreground">{habit.eco_points} eco points</p>
                          </div>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => setHabitToDelete(habit)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will delete the habit "{habitToDelete?.title}". This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-red-500 hover:bg-red-600"
                                onClick={handleDeleteHabit}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Tips & Benefits</CardTitle>
                <CardDescription>Get the most from your eco-habits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 border rounded-lg bg-green-50/50 dark:bg-green-900/10">
                  <h3 className="font-medium flex items-center gap-2 mb-1">
                    <span className="text-green-600 dark:text-green-400">🌱</span> 
                    Consistency is key
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Regular small actions create the biggest environmental impact over time.
                  </p>
                </div>
                
                <div className="p-3 border rounded-lg bg-green-50/50 dark:bg-green-900/10">
                  <h3 className="font-medium flex items-center gap-2 mb-1">
                    <span className="text-green-600 dark:text-green-400">💡</span> 
                    Create personal habits
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Make habits relevant to your lifestyle for better adherence.
                  </p>
                </div>
                
                <div className="p-3 border rounded-lg bg-green-50/50 dark:bg-green-900/10">
                  <h3 className="font-medium flex items-center gap-2 mb-1">
                    <span className="text-green-600 dark:text-green-400">🌍</span> 
                    Share with friends
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Invite friends to join GreenSteps and multiply your positive impact.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </PageLayout>
  );
};

export default Habits;
