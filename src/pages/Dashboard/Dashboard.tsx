
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import EcoHabitCard from "@/components/eco/EcoHabitCard";
import EcoHabitBadge from "@/components/eco/EcoHabitBadge";
import { format, subDays } from "date-fns";
import { Check, ChevronRight, Plus, Award, BarChart, Calendar, Leaf } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { showConfetti, showStreakConfetti } from "@/lib/confetti";
import CalendarView from "@/components/eco/CalendarView";
import { motion, AnimatePresence } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Types for our data
interface Habit {
  id: string;
  emoji: string;
  title: string;
  eco_points: number;
}

interface Log {
  id: string;
  habit_id: string;
  date: string;
  notes: string | null;
}

interface Profile {
  id: string;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  display_name?: string | null; 
  avatar_url?: string | null;   
}

interface Badge {
  id: string;
  badge_type: string;
  earned_at: string;
}

interface HabitWithLogStatus extends Habit {
  isLogged: boolean;
  logId?: string;
  logNotes?: string | null;
}

// Define log data type for calendar
type LogDataRecord = Record<string, { habits: string[], total_points: number }>;

// Available emoji choices for custom habits
const emojiChoices = [
  "🚲", "🌱", "🌿", "🌳", "🌞", "🚶‍♂️", "🔋", "♻️", "🥗", 
  "🚿", "🌊", "📱", "💡", "🥤", "👜", "🚰", "🍽️", "🥬"
];

const Dashboard = () => {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date());
  const formattedDate = format(date, 'yyyy-MM-dd');
  const [showAddHabitDialog, setShowAddHabitDialog] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("🌱");
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
  
  // Fetch user's logs for today
  const { data: logs, isLoading: logsLoading, refetch: refetchLogs } = useQuery({
    queryKey: ['daily-logs', user?.id, formattedDate],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', formattedDate);
        
      if (error) throw error;
      return data as Log[];
    },
    enabled: !!user
  });
  
  // Fetch user profile data
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user
  });
  
  // Fetch user badges
  const { data: badges, isLoading: badgesLoading, refetch: refetchBadges } = useQuery({
    queryKey: ['badges', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });
        
      if (error) throw error;
      return data as Badge[];
    },
    enabled: !!user
  });
  
  // Fetch global stats
  const { data: globalStats, isLoading: globalStatsLoading } = useQuery({
    queryKey: ['global-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('global_stats_view')
        .select('*')
        .order('log_date', { ascending: false })
        .limit(1);
        
      if (error) throw error;
      return data[0] || { total_logs: 0, total_points: 0 };
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
  
  // Monthly calendar data for the heatmap
  const { data: monthlyLogs, isLoading: monthlyLogsLoading } = useQuery({
    queryKey: ['monthly-logs', user?.id, format(date, 'yyyy-MM')],
    queryFn: async () => {
      if (!user) return {} as LogDataRecord;
      
      const startDate = format(new Date(date.getFullYear(), date.getMonth(), 1), 'yyyy-MM-dd');
      const endDate = format(new Date(date.getFullYear(), date.getMonth() + 1, 0), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('daily_logs')
        .select('date, habit_id, eco_points')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate);
        
      if (error) throw error;
      
      // Group by date
      const groupedByDate = data.reduce((acc, log) => {
        if (!acc[log.date]) {
          acc[log.date] = {
            habits: [],
            total_points: 0
          };
        }
        
        acc[log.date].habits.push(log.habit_id);
        acc[log.date].total_points += log.eco_points;
        
        return acc;
      }, {} as LogDataRecord);
      
      return groupedByDate;
    },
    enabled: !!user
  });

  // Habit frequency data for charts
  const { data: habitStats, isLoading: habitStatsLoading } = useQuery({
    queryKey: ['habit-stats', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('daily_logs')
        .select('habit_id, eco_points')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Group and count by habit
      const habitCounts = data.reduce((acc, log) => {
        if (!acc[log.habit_id]) {
          acc[log.habit_id] = {
            count: 0,
            points: 0
          };
        }
        
        acc[log.habit_id].count++;
        acc[log.habit_id].points += log.eco_points;
        
        return acc;
      }, {} as Record<string, { count: number, points: number }>);
      
      return habitCounts;
    },
    enabled: !!user
  });
  
  // Handle logging a habit
  const handleLogHabit = async (habitId: string, notes: string): Promise<void> => {
    if (!user) return Promise.reject("User not authenticated");
    
    try {
      const habit = habits?.find(h => h.id === habitId);
      if (!habit) return Promise.reject("Habit not found");
      
      // Check if already logged
      const existingLog = logs?.find(l => l.habit_id === habitId);
      if (existingLog) {
        return Promise.reject("You've already logged this habit today");
      }
      
      // Insert new log
      const { data, error } = await supabase
        .from('daily_logs')
        .insert([{
          user_id: user.id,
          habit_id: habitId,
          eco_points: habit.eco_points,
          date: formattedDate,
          notes: notes || null
        }])
        .select();
      
      if (error) throw error;
      
      // Refetch data
      await Promise.all([refetchLogs(), refetchProfile(), refetchBadges()]);
      
      // Show confetti on successful log
      showConfetti();
      
      // If new badge earned, show streak confetti
      const oldBadgesCount = badges?.length || 0;
      const newBadgesCount = (await refetchBadges()).data?.length || 0;
      
      if (newBadgesCount > oldBadgesCount) {
        // Extra celebration for new badge
        showStreakConfetti(profile?.current_streak || 1);
        
        toast.success("New Badge Earned! 🏆", {
          description: "Check your profile to see your new achievement!"
        });
      }

      return Promise.resolve();
    } catch (error) {
      console.error("Error logging habit:", error);
      return Promise.reject(error);
    }
  };
  
  // Handle creating a new custom habit
  const handleCreateHabit = async (data: { title: string, emoji: string, eco_points: number }) => {
    try {
      // Insert the new habit into the database
      const { error, data: newHabit } = await supabase
        .from('eco_habits')
        .insert([{
          title: data.title,
          emoji: data.emoji,
          eco_points: Number(data.eco_points)
        }])
        .select();
      
      if (error) throw error;
      
      // Display success animation with the new habit emoji
      toast.custom(
        (id) => (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/90 dark:to-emerald-900/80 
                       border border-green-200 dark:border-green-700 p-4 rounded-lg shadow-lg flex items-center"
          >
            <div className="mr-3 bg-green-100 dark:bg-green-800/30 h-10 w-10 rounded-full flex items-center justify-center text-xl">
              {data.emoji}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-green-800 dark:text-green-100">New habit created!</h3>
              <p className="text-sm text-green-700 dark:text-green-200">
                "{data.title}" is now ready to use
              </p>
            </div>
          </motion.div>
        ),
        { duration: 3000 }
      );
      
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

  // Welcome user - show popup welcome message when user logs in
  useEffect(() => {
    if (user && profile) {
      // Check if this is the first time loading with this user in this session
      const key = `welcomed-${user.id}`;
      const hasBeenWelcomed = sessionStorage.getItem(key);
      
      if (!hasBeenWelcomed) {
        // Show welcome toast with custom animation after a slight delay
        setTimeout(() => {
          const userName = profile?.display_name || user.email?.split('@')[0] || 'Green Warrior';
          
          toast.custom(
            (id) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/90 dark:to-emerald-900/80 
                           border border-green-200 dark:border-green-700 p-5 rounded-lg shadow-lg"
              >
                <div className="flex items-center mb-3">
                  <div className="bg-green-500 h-10 w-10 rounded-full flex items-center justify-center text-white text-xl mr-3">
                    🌿
                  </div>
                  <h3 className="text-lg font-bold text-green-800 dark:text-green-100">
                    Welcome back, {userName}!
                  </h3>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-green-700 dark:text-green-200">
                    Your eco-streak: <span className="font-bold">{profile.current_streak} days</span> 
                    <span className="ml-1">🔥</span>
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-sm border-green-300 dark:border-green-700 text-green-700 dark:text-green-200"
                    onClick={() => toast.dismiss(id)}
                  >
                    Let's go!
                  </Button>
                </div>
              </motion.div>
            ),
            { duration: 5000, position: "top-center" }
          );
          
          // Mark as welcomed for this session
          sessionStorage.setItem(key, 'true');
          
          // Add some confetti for a nice welcome effect
          setTimeout(() => {
            showConfetti();
          }, 500);
        }, 800);
      }
    }
  }, [user, profile]);
  
  const isLoading = habitsLoading || logsLoading || profileLoading;

  const handleEmojiSelect = (emoji: string) => {
    setValue("emoji", emoji);
    setSelectedEmoji(emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 bg-gradient-to-br from-green-50/50 to-blue-50/50 dark:from-green-950/30 dark:to-blue-950/30 min-h-screen">
      <motion.header 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-br from-green-700 to-green-500 bg-clip-text text-transparent">
              Your Eco-Dashboard
            </h1>
            <p className="text-muted-foreground">Track your eco-friendly habits and see your impact.</p>
          </motion.div>
          
          {!profileLoading && profile && (
            <motion.div 
              className="flex items-center mt-4 md:mt-0 gap-4 bg-card p-3 rounded-xl shadow-sm border"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="text-center px-4 border-r">
                <div className="text-sm text-muted-foreground">Total Score</div>
                <div className="text-2xl font-bold text-primary">{profile.total_points}</div>
              </div>
              <div className="text-center px-4">
                <div className="text-sm text-muted-foreground">Current Streak</div>
                <div className="text-2xl font-bold text-orange-500 flex items-center">
                  {profile.current_streak} <span className="ml-1">🔥</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.header>

      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="bg-background/70 backdrop-blur-sm border shadow-sm">
          <TabsTrigger value="today" className="flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            Today's Actions
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            My Stats
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Community
          </TabsTrigger>
        </TabsList>

        {/* Today's Actions Tab */}
        <TabsContent value="today" className="space-y-6">
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
                Today's Eco-Habits ({format(date, 'MMM d, yyyy')})
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
                      onComplete={handleLogHabit}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </TabsContent>

        {/* Calendar Tab - Fix duplication issue */}
        <TabsContent value="calendar">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border shadow-md bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Monthly Activity
                </CardTitle>
                <CardDescription>
                  Your eco-habit logging activity for {format(date, 'MMMM yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {monthlyLogsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-64 bg-muted rounded"></div>
                  </div>
                ) : (
                  <div className="p-2">
                    {/* GitHub-style streak heatmap */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-xs text-center text-muted-foreground">
                          {day[0]}
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 35 }, (_, i) => {
                        // Calculate the date for this cell
                        const cellDate = new Date(
                          date.getFullYear(),
                          date.getMonth(),
                          1 - (new Date(date.getFullYear(), date.getMonth(), 1).getDay()) + i
                        );
                        
                        const formattedCellDate = format(cellDate, 'yyyy-MM-dd');
                        const isCurrentMonth = cellDate.getMonth() === date.getMonth();
                        const dayData = monthlyLogs?.[formattedCellDate];
                        const habitCount = dayData?.habits.length || 0;
                        const points = dayData?.total_points || 0;
                        
                        // Determine the intensity of the color based on points
                        let colorClass = 'bg-gray-100 dark:bg-gray-800';
                        
                        if (points > 0) {
                          if (points < 2) colorClass = 'bg-green-100 dark:bg-green-900/30';
                          else if (points < 5) colorClass = 'bg-green-200 dark:bg-green-800/40';
                          else if (points < 10) colorClass = 'bg-green-300 dark:bg-green-700/50';
                          else colorClass = 'bg-green-400 dark:bg-green-600/60';
                        }
                        
                        return (
                          <Popover key={i}>
                            <PopoverTrigger asChild>
                              <button
                                className={`w-8 h-8 rounded transition-colors relative ${
                                  isCurrentMonth 
                                    ? colorClass 
                                    : 'bg-gray-50 dark:bg-gray-900/20 opacity-40'
                                } ${
                                  format(cellDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                                    ? 'ring-2 ring-primary/50'
                                    : ''
                                }`}
                                disabled={!isCurrentMonth}
                              >
                                <span className="text-[10px] absolute top-0.5 left-0.5 text-muted-foreground">
                                  {cellDate.getDate()}
                                </span>
                                {habitCount > 0 && (
                                  <span className="absolute bottom-0.5 right-0.5 text-[10px] font-medium bg-background/60 rounded-full w-4 h-4 flex items-center justify-center">
                                    {habitCount}
                                  </span>
                                )}
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-52 p-2">
                              <div className="space-y-2">
                                <div className="font-medium">
                                  {format(cellDate, 'MMMM d, yyyy')}
                                </div>
                                <div className="text-sm">
                                  {habitCount > 0 ? (
                                    <>
                                      <div className="flex items-center text-green-600 dark:text-green-400 gap-1 font-medium">
                                        <span>{habitCount}</span> 
                                        <span>habit{habitCount > 1 ? 's' : ''} logged</span>
                                      </div>
                                      <div className="text-xs text-muted-foreground mt-1">
                                        {points} eco-points earned
                                      </div>
                                    </>
                                  ) : (
                                    <div className="text-muted-foreground">
                                      No habits logged
                                    </div>
                                  )}
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        );
                      })}
                    </div>
                    
                    <div className="mt-4 flex justify-end items-center gap-2">
                      <div className="text-xs text-muted-foreground">Less</div>
                      <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded"></div>
                      <div className="w-3 h-3 bg-green-100 dark:bg-green-900/30 rounded"></div>
                      <div className="w-3 h-3 bg-green-200 dark:bg-green-800/40 rounded"></div>
                      <div className="w-3 h-3 bg-green-300 dark:bg-green-700/50 rounded"></div>
                      <div className="w-3 h-3 bg-green-400 dark:bg-green-600/60 rounded"></div>
                      <div className="text-xs text-muted-foreground">More</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="border shadow-md bg-card/80 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <Leaf className="h-3 w-3 text-primary" />
                      </div>
                      Total Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{profile?.total_points || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Your lifetime eco-impact score</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </TabsContent>

        {/* Community Tab */}
        <TabsContent value="community">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Community Impact</CardTitle>
                <CardDescription>See how our community is making a difference</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Community stats will be available soon!</p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
