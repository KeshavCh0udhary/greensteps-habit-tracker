
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
import { motion } from "framer-motion";
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
  display_name?: string | null; // Added display_name property as optional
  avatar_url?: string | null;   // Added avatar_url property as optional
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
      const { error } = await supabase
        .from('eco_habits')
        .insert([{
          title: data.title,
          emoji: data.emoji,
          eco_points: Number(data.eco_points)
        }]);
      
      if (error) throw error;
      
      toast.success("New habit created!", {
        description: "You can now log this eco-habit"
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

  // Welcome user - only show when user logs in
  useEffect(() => {
    if (user && profile) {
      // Check if this is the first time loading with this user in this session
      const key = `welcomed-${user.id}`;
      const hasBeenWelcomed = sessionStorage.getItem(key);
      
      if (!hasBeenWelcomed) {
        // Show welcome toast with custom animation after a slight delay
        setTimeout(() => {
          toast.success(
            `Welcome back, ${profile?.display_name || user.email?.split('@')[0] || 'Green Warrior'}! 🌿`, 
            {
              description: `Your eco-streak: ${profile.current_streak} days 🔥`,
              duration: 5000,
              position: "top-center",
            }
          );
          // Mark as welcomed for this session
          sessionStorage.setItem(key, 'true');
        }, 1000);
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
              Welcome back{user?.user_metadata?.display_name ? `, ${user.user_metadata.display_name}` : ''}! 🌱
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
                                      className="h-10 w-10 p-0 text-xl"
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
                        <Button type="submit" className="relative overflow-hidden">
                          Create Habit
                          <span className="absolute inset-0 overflow-hidden ripple-effect" />
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
                  <CalendarView 
                    date={date} 
                    onDateChange={setDate} 
                    logData={monthlyLogs || {}} 
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* My Stats Tab */}
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
                    <CardDescription>Your eco-contribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">
                      {profileLoading ? "..." : (profile?.total_points || 0)}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="border shadow-md bg-card/80 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <span className="text-orange-500 text-xs">🔥</span>
                      </div>
                      Current Streak
                    </CardTitle>
                    <CardDescription>Consecutive days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-500">
                      {profileLoading ? "..." : (profile?.current_streak || 0)} days
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="border shadow-md bg-card/80 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <span className="text-blue-500 text-xs">⚡</span>
                      </div>
                      Longest Streak
                    </CardTitle>
                    <CardDescription>Best performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-500">
                      {profileLoading ? "..." : (profile?.longest_streak || 0)} days
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="border shadow-md bg-card/80 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Award className="h-3 w-3 text-purple-500" />
                      </div>
                      Badges
                    </CardTitle>
                    <CardDescription>Achievements earned</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-500">
                      {badgesLoading ? "..." : (badges?.length || 0)}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Badges Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Card className="border shadow-md bg-card/80 backdrop-blur-sm h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Your Badges
                    </CardTitle>
                    <CardDescription>Achievements you've earned</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {badgesLoading ? (
                        <div className="animate-pulse space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                              <div className="bg-muted w-10 h-10 rounded-full"></div>
                              <div className="flex-1 space-y-1">
                                <div className="h-4 bg-muted rounded w-24"></div>
                                <div className="h-3 bg-muted rounded w-32"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : badges?.length === 0 ? (
                        <div className="text-center py-6">
                          <p className="text-muted-foreground">Complete eco-habits to earn badges!</p>
                        </div>
                      ) : (
                        badges?.map((badge) => (
                          <motion.div 
                            key={badge.id} 
                            className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg border border-border/50 shadow-sm hover:shadow-md transition-all"
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="bg-green-100 dark:bg-green-800/30 w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm relative overflow-hidden">
                              {badge.badge_type === 'First Log' && '🏆'}
                              {badge.badge_type === '7-Day Streak' && '🔥'}
                              {badge.badge_type === '30-Day Streak' && '⚡'}
                              {badge.badge_type === '100 Points Club' && '💯'}
                              {badge.badge_type === '500 Points Club' && '🌟'}
                              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent animate-pulse-gentle"></div>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{badge.badge_type}</div>
                              <div className="text-sm text-muted-foreground">
                                Earned on {format(new Date(badge.earned_at), 'MMM d, yyyy')}
                              </div>
                            </div>
                            <Check className="w-5 h-5 text-green-600" />
                          </motion.div>
                        ))
                      )}
                      
                      {/* Badges to earn */}
                      {!badgesLoading && badges && (
                        <>
                          {!badges.some(b => b.badge_type === '30-Day Streak') && (
                            <motion.div 
                              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border/20"
                              initial={{ opacity: 0.8 }}
                              whileHover={{ opacity: 1 }}
                            >
                              <div className="bg-muted w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm opacity-50">
                                ⚡
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-muted-foreground">30-Day Streak</div>
                                <div className="text-sm text-muted-foreground">Log habits for 30 days in a row</div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {profile?.current_streak || 0}/30
                              </div>
                            </motion.div>
                          )}
                          
                          {!badges.some(b => b.badge_type === '100 Points Club') && (
                            <motion.div 
                              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border/20"
                              initial={{ opacity: 0.8 }}
                              whileHover={{ opacity: 1 }}
                            >
                              <div className="bg-muted w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm opacity-50">
                                💯
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-muted-foreground">100 Points Club</div>
                                <div className="text-sm text-muted-foreground">Earn 100 total points</div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {profile?.total_points || 0}/100
                              </div>
                            </motion.div>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Habits Summary */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Card className="border shadow-md bg-card/80 backdrop-blur-sm h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart className="h-5 w-5 text-primary" />
                      Habits Summary
                    </CardTitle>
                    <CardDescription>Your most logged eco-actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {habitStatsLoading || habitsLoading ? (
                      <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="h-4 bg-muted rounded w-24"></div>
                              <div className="h-4 bg-muted rounded w-12"></div>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2"></div>
                          </div>
                        ))}
                      </div>
                    ) : habits?.length && habitStats ? (
                      <div className="space-y-5">
                        {habits
                          .filter(habit => habitStats[habit.id]?.count > 0)
                          .sort((a, b) => 
                            (habitStats[b.id]?.count || 0) - (habitStats[a.id]?.count || 0)
                          )
                          .slice(0, 3)
                          .map(habit => {
                            const count = habitStats[habit.id]?.count || 0;
                            const maxCount = Math.max(...Object.values(habitStats).map(stat => stat.count));
                            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                            
                            return (
                              <motion.div 
                                key={habit.id} 
                                className="space-y-2"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{habit.emoji}</span>
                                    <span className="font-medium">{habit.title}</span>
                                  </div>
                                  <span className="text-sm font-medium bg-accent/50 rounded-full px-2 py-0.5">{count} logs</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2.5">
                                  <motion.div 
                                    className="bg-gradient-to-r from-green-500 to-green-700 h-2.5 rounded-full" 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 1, delay: 0.3 }}
                                  ></motion.div>
                                </div>
                              </motion.div>
                            );
                          })
                        }
                        
                        {Object.keys(habitStats).length === 0 && (
                          <div className="text-center py-6">
                            <p className="text-muted-foreground">Start logging habits to see your summary!</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">No habit data available yet.</p>
                      </div>
                    )}
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
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="border shadow-md bg-card/80 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-700/10 to-green-600/5 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary text-sm">🌍</span>
                    </div>
                    Global Community Impact
                  </CardTitle>
                  <CardDescription>
                    Our collective contribution to a greener planet
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <motion.div 
                      className="space-y-2 text-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <div className="text-4xl font-bold text-primary relative">
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1.5 }}
                        >
                          {globalStatsLoading ? "..." : (globalStats?.total_points?.toLocaleString() || "0")}
                        </motion.span>
                        <motion.div 
                          className="absolute -right-2 -top-2 text-lg"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
                        >
                          ✨
                        </motion.div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Points Logged
                      </div>
                    </motion.div>
                    <motion.div 
                      className="space-y-2 text-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <div className="text-4xl font-bold text-primary relative">
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1.5 }}
                        >
                          {globalStatsLoading ? "..." : (globalStats?.total_logs?.toLocaleString() || "0")}
                        </motion.span>
                        <motion.div 
                          className="absolute -right-2 -top-2 text-lg"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1, duration: 0.5, type: "spring" }}
                        >
                          🌱
                        </motion.div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Eco-Habits Tracked
                      </div>
                    </motion.div>
                    <motion.div 
                      className="space-y-2 text-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      <div className="text-4xl font-bold text-primary relative">
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1.5 }}
                        >
                          {globalStatsLoading ? "..." : ((globalStats?.total_points || 0) * 0.25).toFixed(1) + "kg"}
                        </motion.span>
                        <motion.div 
                          className="absolute -right-2 -top-2 text-lg"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
                        >
                          🌎
                        </motion.div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Estimated Carbon Saved
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Card className="border shadow-md bg-card/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-700/10 to-green-600/5 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary text-sm">🏆</span>
                    </div>
                    Today's Top Eco-Warriors
                  </CardTitle>
                  <CardDescription>
                    Users with most habits logged today
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <motion.div 
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-100/80 to-yellow-50/50 dark:from-yellow-900/20 dark:to-yellow-800/10 rounded-xl border border-yellow-200/70 dark:border-yellow-700/30 shadow-sm"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-yellow-200 to-yellow-100 dark:from-yellow-700 dark:to-yellow-800 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-md relative">
                          👑
                          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-white/20 to-transparent animate-pulse-gentle"></div>
                        </div>
                        <div>
                          <div className="font-medium text-lg">EcoChampion</div>
                          <div className="flex gap-1 mt-1">
                            {["🚗", "🔄", "🍽️", "🚴", "🛍️"].map((emoji, i) => (
                              <span
                                key={i}
                                className="bg-background/80 rounded-full w-7 h-7 flex items-center justify-center text-sm shadow-sm"
                              >
                                {emoji}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500 bg-yellow-100/80 dark:bg-yellow-900/30 py-1 px-3 rounded-lg shadow-inner">8.5</div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-100/80 to-gray-50/50 dark:from-gray-800/30 dark:to-gray-700/20 rounded-xl border border-gray-200/70 dark:border-gray-700/30 shadow-sm"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-md relative">
                          🥈
                          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-white/20 to-transparent animate-pulse-gentle"></div>
                        </div>
                        <div>
                          <div className="font-medium text-lg">EarthGuardian</div>
                          <div className="flex gap-1 mt-1">
                            {["🔄", "🍽️", "🚴", "🛍️"].map((emoji, i) => (
                              <span
                                key={i}
                                className="bg-background/80 rounded-full w-7 h-7 flex items-center justify-center text-sm shadow-sm"
                              >
                                {emoji}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-gray-600 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-800/30 py-1 px-3 rounded-lg shadow-inner">6.5</div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-100/80 to-orange-50/50 dark:from-orange-900/20 dark:to-orange-800/10 rounded-xl border border-orange-200/70 dark:border-orange-700/30 shadow-sm"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-orange-200 to-orange-100 dark:from-orange-800 dark:to-orange-900 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-md relative">
                          🥉
                          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-white/20 to-transparent animate-pulse-gentle"></div>
                        </div>
                        <div>
                          <div className="font-medium text-lg">PlanetProtector</div>
                          <div className="flex gap-1 mt-1">
                            {["🚗", "🔄", "🍽️"].map((emoji, i) => (
                              <span
                                key={i}
                                className="bg-background/80 rounded-full w-7 h-7 flex items-center justify-center text-sm shadow-sm"
                              >
                                {emoji}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-500 bg-orange-100/80 dark:bg-orange-900/30 py-1 px-3 rounded-lg shadow-inner">5.0</div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
