
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Leaf, Check, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import EcoHabitCard from "@/components/eco/EcoHabitCard";

// Types for our data
interface Habit {
  id: string;
  emoji: string;
  title: string;
  eco_points: number;
  created_at: string;
}

// Available emoji choices for custom habits
const emojiChoices = [
  "🌱", "🌿", "🌳", "🌞", "🚶‍♂️", "🔋", "♻️", "🥗", 
  "🚿", "🌊", "📱", "💡", "🥤", "👜", "🚰", "🍽️", "🥬",
  "🚲", "🛒", "🌻", "🧩", "🔄", "🧴", "🧹"
];

const Habits = () => {
  const { user } = useAuth();
  const [showAddHabitDialog, setShowAddHabitDialog] = useState(false);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      emoji: "🌱",
      eco_points: 1,
      description: ""
    }
  });

  const formEmoji = watch("emoji");

  // Fetch eco habits
  const { data: habits, isLoading, refetch } = useQuery({
    queryKey: ['eco-habits-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('eco_habits')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as Habit[];
    }
  });
  
  // Handle creating a new custom habit
  const handleCreateHabit = async (data: { title: string, emoji: string, eco_points: number, description: string }) => {
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
      
      // Display success notification
      toast.success("Habit created successfully!", {
        description: `${data.emoji} ${data.title} has been added to your habits.`
      });
      
      // Reset form and close dialog
      reset();
      setShowAddHabitDialog(false);
      
      // Refetch habits
      refetch();
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
      // Delete the habit from the database
      const { error } = await supabase
        .from('eco_habits')
        .delete()
        .eq('id', habitToDelete);
      
      if (error) throw error;
      
      // Display success notification
      toast.success("Habit deleted successfully!");
      
      // Close dialog and reset state
      setShowConfirmDeleteDialog(false);
      setHabitToDelete(null);
      
      // Refetch habits
      refetch();
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
            <p className="text-muted-foreground">View, add, and manage your eco-friendly habits</p>
          </div>
        </motion.div>
        
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Habits</TabsTrigger>
            <TabsTrigger value="custom">Custom Habits</TabsTrigger>
          </TabsList>

          <div className="flex justify-end">
            <Dialog open={showAddHabitDialog} onOpenChange={setShowAddHabitDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1 bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4" />
                  <span>Add New Habit</span>
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
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Input
                        id="description"
                        placeholder="Brief description of the habit"
                        {...register("description")}
                      />
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
          </div>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  All Available Eco-Habits
                </CardTitle>
                <CardDescription>
                  These are all the eco-habits you can log in your daily activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-24 bg-muted animate-pulse rounded-lg"></div>
                    ))}
                  </div>
                ) : habits && habits.length > 0 ? (
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {habits.map((habit) => (
                      <motion.div
                        key={habit.id}
                        variants={itemVariants}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="relative"
                      >
                        <Card className="border bg-card hover:bg-accent/5 transition-colors h-full">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-2xl">
                                  {habit.emoji}
                                </div>
                                <div>
                                  <h3 className="font-semibold">{habit.title}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {habit.eco_points} eco-points
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                                onClick={() => {
                                  setHabitToDelete(habit.id);
                                  setShowConfirmDeleteDialog(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="mt-2 pt-2 border-t">
                              <div className="text-xs text-muted-foreground">
                                Added on {new Date(habit.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-8">
                    <Leaf className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-2" />
                    <p className="text-muted-foreground">No eco-habits found.</p>
                    <p className="text-sm text-muted-foreground">Create a new habit to get started!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Your Custom Habits
                </CardTitle>
                <CardDescription>
                  Eco-habits you've created to track your personal eco-friendly actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-24 bg-muted animate-pulse rounded-lg"></div>
                    ))}
                  </div>
                ) : habits && habits.some(h => h.created_at !== null) ? (
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {habits
                      .filter(habit => habit.created_at !== null)
                      .map((habit) => (
                        <motion.div
                          key={habit.id}
                          variants={itemVariants}
                          whileHover={{ y: -4, transition: { duration: 0.2 } }}
                          className="relative"
                        >
                          <Card className="border bg-card hover:bg-accent/5 transition-colors h-full">
                            <Badge className="absolute top-2 right-2 bg-green-600 hover:bg-green-700">Custom</Badge>
                            <CardContent className="p-4">
                              <div className="flex items-start mb-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-2xl">
                                    {habit.emoji}
                                  </div>
                                  <div>
                                    <h3 className="font-semibold">{habit.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      {habit.eco_points} eco-points
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                                  onClick={() => {
                                    setHabitToDelete(habit.id);
                                    setShowConfirmDeleteDialog(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-8">
                    <Leaf className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-2" />
                    <p className="text-muted-foreground">No custom eco-habits found.</p>
                    <p className="text-sm text-muted-foreground">Create a new custom habit to get started!</p>
                    <Button 
                      className="mt-4 bg-green-600 hover:bg-green-700"
                      onClick={() => setShowAddHabitDialog(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Create Custom Habit
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showConfirmDeleteDialog} onOpenChange={setShowConfirmDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this habit? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setShowConfirmDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteHabit}>
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </PageLayout>
  );
};

export default Habits;
