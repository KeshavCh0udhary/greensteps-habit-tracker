
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Leaf, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { HabitWithLogStatus } from "@/types/interfaces";
import EcoHabitCard from "@/components/eco/EcoHabitCard";
import CreateHabitForm from "@/components/eco/CreateHabitForm";

interface HabitManagementProps {
  date: Date;
  formattedDate: string;
  onLogHabit: (habitId: string, notes: string) => Promise<void>;
}

const HabitManagement = ({ date, formattedDate, onLogHabit }: HabitManagementProps) => {
  const [showAddHabitDialog, setShowAddHabitDialog] = useState(false);
  
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
      return data;
    }
  });

  // Fetch user's logs for today
  const { data: logs, isLoading: logsLoading, refetch: refetchLogs } = useQuery({
    queryKey: ['daily-logs', formattedDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('date', formattedDate);
        
      if (error) throw error;
      return data;
    }
  });

  // Combine habits with log status
  const habitsWithLogStatus: HabitWithLogStatus[] = habits?.map(habit => {
    const log = logs?.find(l => l.habit_id === habit.id);
    return {
      ...habit,
      isLogged: !!log,
      logId: log?.id,
      logNotes: log?.notes
    };
  }) || [];

  // Handle habit creation success - close dialog and refresh habits
  const handleHabitCreationSuccess = async () => {
    setShowAddHabitDialog(false);
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
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground bg-background/70 backdrop-blur-sm px-3 py-1 rounded-full border shadow-sm">
            Logged: {logs?.length || 0}/{habits?.length || 0}
          </div>
          <Dialog open={showAddHabitDialog} onOpenChange={setShowAddHabitDialog}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="flex items-center gap-1 bg-background/70 backdrop-blur-sm">
                <Plus className="h-4 w-4" />
                <span>New</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Custom Eco-Habit</DialogTitle>
                <DialogDescription>
                  Add a new eco-friendly habit to track. Custom habits are visible to all users.
                </DialogDescription>
              </DialogHeader>
              <CreateHabitForm 
                onSuccess={handleHabitCreationSuccess} 
                onCancel={() => setShowAddHabitDialog(false)} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-muted rounded"></div>
                    <div className="h-3 w-16 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {habitsWithLogStatus.map((habit, index) => (
            <motion.div 
              key={habit.id}
              variants={itemVariants}
              custom={index}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="hover-lift"
            >
              <EcoHabitCard
                id={habit.id}
                emoji={habit.emoji}
                title={habit.title}
                points={habit.eco_points}
                isCompleted={habit.isLogged}
                logId={habit.logId}
                logNotes={habit.logNotes}
                onComplete={onLogHabit}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default HabitManagement;
