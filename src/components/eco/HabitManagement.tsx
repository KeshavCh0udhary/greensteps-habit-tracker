import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Leaf, Plus } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase"; 
import { HabitWithLogStatus } from "@/types/interfaces";
import EcoHabitCard from "@/components/eco/EcoHabitCard";
import CreateHabitForm from "@/components/eco/CreateHabitForm";
import { useAuth } from "@/lib/auth";

interface HabitManagementProps {
  date: Date;
  formattedDate: string;
  onLogHabit: (habitId: string, notes: string) => Promise<void>;
}

const HabitManagement = ({ date, formattedDate, onLogHabit }: HabitManagementProps) => {
  const [showAddHabitDialog, setShowAddHabitDialog] = useState(false);
  const [recentlyLoggedHabits, setRecentlyLoggedHabits] = useState<Set<string>>(new Set());
  const supabase = getSupabaseClient();
  const { user } = useAuth();
  
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
    },
    highlight: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
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
        
      if (error) {
        console.error("Error fetching habits:", error);
        throw error;
      }
      
      console.log("Fetched habits:", data);
      return data;
    }
  });

  // Fetch user's logs specifically for today
  const { data: logs, isLoading: logsLoading, refetch: refetchLogs } = useQuery({
    queryKey: ['daily-logs', formattedDate, user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('date', formattedDate)
        .eq('user_id', user.id);
        
      if (error) {
        console.error("Error fetching logs:", error);
        throw error;
      }
      
      console.log("Fetched logs for date:", formattedDate, data);
      return data;
    },
    enabled: !!user
  });

  // Combine habits with log status - ensuring habits are only marked as logged if they were logged for THIS specific date
  const habitsWithLogStatus: HabitWithLogStatus[] = habits?.map(habit => {
    const log = logs?.find(l => l.habit_id === habit.id);
    return {
      ...habit,
      isLogged: !!log,
      logId: log?.id,
      logNotes: log?.notes
    };
  }) || [];

  // Handle habit logging with animation
  const handleHabitLog = async (habitId: string, notes: string) => {
    try {
      // Add to recently logged set for animation
      setRecentlyLoggedHabits(prev => new Set(prev).add(habitId));
      
      // Log the habit
      await onLogHabit(habitId, notes);
      
      // Remove from recently logged set after animation
      setTimeout(() => {
        setRecentlyLoggedHabits(prev => {
          const newSet = new Set(prev);
          newSet.delete(habitId);
          return newSet;
        });
      }, 1000);
      
      // Refresh logs
      await refetchLogs();
    } catch (error) {
      console.error("Error logging habit:", error);
      // Remove from recently logged set if there was an error
      setRecentlyLoggedHabits(prev => {
        const newSet = new Set(prev);
        newSet.delete(habitId);
        return newSet;
      });
    }
  };

  // Handle habit creation success - close dialog and refresh habits
  const handleHabitCreationSuccess = async () => {
    setShowAddHabitDialog(false);
    console.log("Habit creation successful, refreshing habits...");
    await refetchHabits();
  };

  const isLoading = habitsLoading || logsLoading;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold flex items-center">
          <span className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center mr-2">
            <Leaf className="h-4 w-4 text-primary" />
          </span>
          Today's Eco-Habits ({new Date(date).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})})
        </h2>
        <Dialog open={showAddHabitDialog} onOpenChange={setShowAddHabitDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Eco-Habit</DialogTitle>
              <DialogDescription>
                Add a new sustainable habit to track and earn eco-points.
              </DialogDescription>
            </DialogHeader>
            <CreateHabitForm 
              onSuccess={handleHabitCreationSuccess} 
              onCancel={() => setShowAddHabitDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {habitsWithLogStatus.map((habit) => (
              <motion.div
                key={habit.id}
                variants={itemVariants}
                animate={recentlyLoggedHabits.has(habit.id) ? "highlight" : "visible"}
                transition={{ duration: 0.3 }}
              >
                <EcoHabitCard
                  id={habit.id}
                  emoji={habit.emoji}
                  title={habit.title}
                  points={habit.eco_points}
                  isCompleted={habit.isLogged}
                  logId={habit.logId}
                  logNotes={habit.logNotes}
                  onComplete={handleHabitLog}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};

export default HabitManagement;
