
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO, isToday, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import EcoHabitCard from "@/components/eco/EcoHabitCard";
import EcoHabitBadge from "@/components/eco/EcoHabitBadge";
import { showConfetti, showStreakConfetti } from "@/lib/confetti";
import { toast } from "sonner";
import CommunityCard from "@/components/community/CommunityCard";
import { HabitWithLogStatus, Community, LogDataRecord } from "@/types/interfaces";
import StatsCard from "@/components/stats/StatsCard";
import CalendarHeatmap from "@/components/calendar/CalendarHeatmap";

// Import the UI components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Import the lucide-react components
import {
  Calendar,
  CircleCheck,
  CirclePlus,
  Award,
  Users,
  BarChart,
  CalendarRange,
  Plus,
  CalendarDays,
  Leaf
} from "lucide-react";

// Types for our data
interface Habit {
  id: string;
  title: string;
  emoji: string;
  eco_points: number;
}

interface Log {
  id: string;
  habit_id: string;
  date: string;
  notes: string | null;
  eco_points: number; // Add this field to the Log interface
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

// Calendar view types
type CalendarViewType = "week" | "month" | "year";

// Available emoji choices for custom habits
const emojiChoices = [
  "🚲", "🌱", "🌿", "🌳", "🌞", "🚶‍♂️", "🔋", "♻️", "🥗", 
  "🚿", "🌊", "📱", "💡", "🥤", "👜", "🚰", "🍽️", "🥬"
];

// Sample communities for demonstration
const sampleCommunities: Community[] = [
  {
    id: "1",
    name: "Zero Waste Group",
    description: "Dedicated to reducing waste and living sustainably",
    icon: "♻️",
    member_count: 128
  },
  {
    id: "2",
    name: "Plant Lovers",
    description: "For people who love growing plants and gardening",
    icon: "🌱",
    member_count: 94
  },
  {
    id: "3",
    name: "Eco Commuters",
    description: "Using eco-friendly transportation methods",
    icon: "🚲",
    member_count: 56
  },
  {
    id: "4",
    name: "Clean Energy Advocates",
    description: "Promoting renewable energy solutions",
    icon: "☀️",
    member_count: 72
  }
];

const Dashboard = () => {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date());
  const formattedDate = format(date, 'yyyy-MM-dd');
  const [showAddHabitDialog, setShowAddHabitDialog] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("🌱");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [calendarView, setCalendarView] = useState<CalendarViewType>("month");
  
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

  // Fetch all user's logs for stats calculations
  const { data: allUserLogs, isLoading: allUserLogsLoading } = useQuery({
    queryKey: ['all-user-logs', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      return data as Log[];
    },
    enabled: !!user
  });
  
  // Calculate total active days (distinct days with at least one logged habit)
  const totalActiveDays = allUserLogs ? new Set(allUserLogs.map(log => log.date)).size : 0;

  // Calculate total points earned from all logs
  const totalPointsEarned = allUserLogs ? allUserLogs.reduce((sum, log) => sum + (log.eco_points || 0), 0) : 0;
  
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
  
  // Get date range based on current view
  const getDateRange = () => {
    switch (calendarView) {
      case "week":
        return {
          start: startOfWeek(date, { weekStartsOn: 0 }),
          end: endOfWeek(date, { weekStartsOn: 0 })
        };
      case "year":
        return {
          start: startOfYear(date),
          end: endOfYear(date)
        };
      case "month":
      default:
        return {
          start: startOfMonth(date),
          end: endOfMonth(date)
        };
    }
  };
  
  // Monthly calendar data for the heatmap
  const { data: periodLogs, isLoading: periodLogsLoading } = useQuery({
    queryKey: ['period-logs', user?.id, calendarView, format(date, 'yyyy-MM-dd')],
    queryFn: async () => {
      if (!user) return {} as LogDataRecord;
      
      const { start, end } = getDateRange();
      const startDateStr = format(start, 'yyyy-MM-dd');
      const endDateStr = format(end, 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('daily_logs')
        .select('date, habit_id, eco_points')
        .eq('user_id', user.id)
        .gte('date', startDateStr)
        .lte('date', endDateStr);
        
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
            <Users className="h-4 w-4" />
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

        {/* Calendar Tab with view options */}
        <TabsContent value="calendar">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border shadow-md bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Calendar Activity
                    </CardTitle>
                    <CardDescription>
                      Your eco-habit logging activity for {format(date, calendarView === "year" ? 'yyyy' : calendarView === "week" ? "'Week of' MMM d, yyyy" : 'MMMM yyyy')}
                    </CardDescription>
                  </div>
                  <div className="flex items-center">
                    <ToggleGroup type="single" value={calendarView} onValueChange={(value) => value && setCalendarView(value as CalendarViewType)}>
                      <ToggleGroupItem value="week" aria-label="View Week" className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Week</span>
                      </ToggleGroupItem>
                      <ToggleGroupItem value="month" aria-label="View Month" className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Month</span>
                      </ToggleGroupItem>
                      <ToggleGroupItem value="year" aria-label="View Year" className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Year</span>
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {periodLogsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-64 bg-muted rounded"></div>
                  </div>
                ) : (
                  <CalendarHeatmap 
                    logs={periodLogs}
                    viewType={calendarView}
                    currentDate={date}
                  />
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
              {/* Stats cards */}
              <StatsCard 
                title="Total Points" 
                value={totalPointsEarned}
                icon={<Leaf className="h-4 w-4" />}
                description="Points earned from all eco-habits"
                isLoading={allUserLogsLoading}
              />
              
              <StatsCard 
                title="Longest Streak" 
                value={profile?.longest_streak || 0}
                icon={<Award className="h-4 w-4" />}
                suffix="days"
                description="Your best eco-logging streak"
                isLoading={profileLoading}
              />
              
              <StatsCard 
                title="Active Days" 
                value={totalActiveDays}
                icon={<CalendarDays className="h-4 w-4" />}
                description="Days with logged eco-habits"
                isLoading={allUserLogsLoading}
              />
              
              <StatsCard 
                title="Badges Earned" 
                value={badges?.length || 0}
                icon={<Award className="h-4 w-4" />}
                description="Recognition for your efforts"
                isLoading={badgesLoading}
              />
            </div>

            {/* Badges section */}
            <Card className="border shadow-md bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Your Achievement Badges
                </CardTitle>
                <CardDescription>
                  Badges you've earned through consistent eco-friendly actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {badgesLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="animate-pulse flex flex-col items-center">
                        <div className="w-16 h-16 bg-muted rounded-full mb-2"></div>
                        <div className="h-4 w-24 bg-muted rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : badges && badges.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {badges.map(badge => (
                      <EcoHabitBadge
                        key={badge.id}
                        type={badge.badge_type}
                        earnedAt={new Date(badge.earned_at)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>You haven't earned any badges yet.</p>
                    <p className="text-sm mt-1">Keep logging eco-habits to earn your first badge!</p>
                  </div>
                )}
              </CardContent>
            </Card>
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
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold flex items-center">
                <span className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                  <Users className="h-4 w-4 text-primary" />
                </span>
                Your Communities
              </h2>
              <Button size="sm" variant="outline" className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Join New</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleCommunities.map(community => (
                <motion.div
                  key={community.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <CommunityCard
                    id={community.id}
                    name={community.name}
                    description={community.description}
                    icon={community.icon}
                    memberCount={community.member_count}
                  />
                </motion.div>
              ))}
            </div>
            
            <Card className="border shadow-md bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Community Leaderboard
                </CardTitle>
                <CardDescription>
                  See how your communities are performing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleCommunities.map((community, index) => (
                    <div key={community.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                          {community.icon}
                        </div>
                        <div>
                          <p className="font-medium">{community.name}</p>
                          <p className="text-xs text-muted-foreground">{community.member_count} members</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{(5000 - (index * 1000)).toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">points</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
