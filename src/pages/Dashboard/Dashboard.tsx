import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import EcoHabitCard from "@/components/eco/EcoHabitCard";
import EcoHabitBadge from "@/components/eco/EcoHabitBadge";
import { format, subDays } from "date-fns";
import { Check, ChevronRight, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { showConfetti, showStreakConfetti } from "@/lib/confetti";
import CalendarView from "@/components/eco/CalendarView";

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

const Dashboard = () => {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date());
  const formattedDate = format(date, 'yyyy-MM-dd');
  const [showAddHabitDialog, setShowAddHabitDialog] = useState(false);
  
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      emoji: "🌱",
      eco_points: 1
    }
  });

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
  
  const isLoading = habitsLoading || logsLoading || profileLoading;

  return (
    <div className="container mx-auto p-4 md:p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back{user?.user_metadata?.display_name ? `, ${user.user_metadata.display_name}` : ''}!</h1>
        <p className="text-muted-foreground">Track your eco-friendly habits and see your impact.</p>
      </header>

      <Tabs defaultValue="today" className="space-y-6">
        <TabsList>
          <TabsTrigger value="today">Today's Actions</TabsTrigger>
          <TabsTrigger value="stats">My Stats</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        {/* Today's Actions Tab */}
        <TabsContent value="today" className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">
              Today's Eco-Habits ({format(date, 'MMM d, yyyy')})
            </h2>
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">
                Logged: {logs?.length || 0}/{habits?.length || 0}
              </div>
              <Dialog open={showAddHabitDialog} onOpenChange={setShowAddHabitDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    <span>New</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
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
                          <Input
                            id="emoji"
                            className="text-center text-xl"
                            {...register("emoji")}
                          />
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
                        <Label htmlFor="eco_points">Eco Points (1-5)</Label>
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
                      <Button type="submit">Create Habit</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {habitsWithLogStatus.map((habit) => (
                <EcoHabitCard
                  key={habit.id}
                  id={habit.id}
                  emoji={habit.emoji}
                  title={habit.title}
                  points={habit.eco_points}
                  isCompleted={habit.isLogged}
                  onComplete={handleLogHabit}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* My Stats Tab */}
        <TabsContent value="stats">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Total Points</CardTitle>
                  <CardDescription>Your eco-contribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {profileLoading ? "..." : (profile?.total_points || 0)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Current Streak</CardTitle>
                  <CardDescription>Consecutive days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {profileLoading ? "..." : (profile?.current_streak || 0)} days
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Longest Streak</CardTitle>
                  <CardDescription>Best performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {profileLoading ? "..." : (profile?.longest_streak || 0)} days
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Badges</CardTitle>
                  <CardDescription>Achievements earned</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {badgesLoading ? "..." : (badges?.length || 0)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Badges Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Badges</CardTitle>
                  <CardDescription>Achievements you've earned</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {badgesLoading ? (
                      <div className="animate-pulse space-y-2">
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
                        <div key={badge.id} className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                          <div className="bg-green-100 dark:bg-green-800/30 w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm">
                            {badge.badge_type === 'First Log' && '🏆'}
                            {badge.badge_type === '7-Day Streak' && '🔥'}
                            {badge.badge_type === '30-Day Streak' && '⚡'}
                            {badge.badge_type === '100 Points Club' && '💯'}
                            {badge.badge_type === '500 Points Club' && '🌟'}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{badge.badge_type}</div>
                            <div className="text-sm text-muted-foreground">
                              Earned on {format(new Date(badge.earned_at), 'MMM d, yyyy')}
                            </div>
                          </div>
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      ))
                    )}
                    
                    {/* Badges to earn */}
                    {!badgesLoading && badges && (
                      <>
                        {!badges.some(b => b.badge_type === '30-Day Streak') && (
                          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <div className="bg-muted w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm">
                              ⚡
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">30-Day Streak</div>
                              <div className="text-sm text-muted-foreground">Log habits for 30 days in a row</div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {profile?.current_streak || 0}/30
                            </div>
                          </div>
                        )}
                        
                        {!badges.some(b => b.badge_type === '100 Points Club') && (
                          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <div className="bg-muted w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm">
                              💯
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">100 Points Club</div>
                              <div className="text-sm text-muted-foreground">Earn 100 total points</div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {profile?.total_points || 0}/100
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Habits Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Habits Summary</CardTitle>
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
                    <div className="space-y-4">
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
                            <div key={habit.id} className="flex items-center justify-between">
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span>{habit.emoji}</span>
                                    <span className="font-medium">{habit.title}</span>
                                  </div>
                                  <span className="text-sm font-medium">{count} logs</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div 
                                    className="bg-green-600 h-2 rounded-full" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
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
            </div>
          </div>
        </TabsContent>
        
        {/* Calendar View Tab */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Activity</CardTitle>
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
        </TabsContent>

        {/* Community Tab */}
        <TabsContent value="community">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Global Community Impact</CardTitle>
                <CardDescription>
                  Our collective contribution to a greener planet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2 text-center">
                    <div className="text-4xl font-bold text-primary">
                      {globalStatsLoading ? "..." : (globalStats?.total_points?.toLocaleString() || "0")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Points Logged
                    </div>
                  </div>
                  <div className="space-y-2 text-center">
                    <div className="text-4xl font-bold text-primary">
                      {globalStatsLoading ? "..." : (globalStats?.total_logs?.toLocaleString() || "0")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Eco-Habits Tracked
                    </div>
                  </div>
                  <div className="space-y-2 text-center">
                    <div className="text-4xl font-bold text-primary">
                      {globalStatsLoading ? "..." : ((globalStats?.total_points || 0) * 0.25).toFixed(1) + "kg"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Estimated Carbon Saved
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Today's Top Eco-Warriors</CardTitle>
                <CardDescription>
                  Users with most habits logged today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 dark:bg-green-800/30 w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm">
                        👑
                      </div>
                      <div>
                        <div className="font-medium">EcoChampion</div>
                        <div className="flex gap-1 mt-1">
                          {["🚗", "🔄", "🍽️", "🚴", "🛍️"].map((emoji, i) => (
                            <span
                              key={i}
                              className="bg-background/50 rounded-full w-6 h-6 flex items-center justify-center text-xs"
                            >
                              {emoji}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-xl font-semibold text-primary">8.5</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 dark:bg-green-800/30 w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm">
                        🥈
                      </div>
                      <div>
                        <div className="font-medium">EarthGuardian</div>
                        <div className="flex gap-1 mt-1">
                          {["🔄", "🍽️", "🚴", "🛍️"].map((emoji, i) => (
                            <span
                              key={i}
                              className="bg-background/50 rounded-full w-6 h-6 flex items-center justify-center text-xs"
                            >
                              {emoji}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-xl font-semibold text-primary">6.5</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 dark:bg-green-800/30 w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm">
                        🥉
                      </div>
                      <div>
                        <div className="font-medium">PlanetProtector</div>
                        <div className="flex gap-1 mt-1">
                          {["🚗", "🔄", "🍽️"].map((emoji, i) => (
                            <span
                              key={i}
                              className="bg-background/50 rounded-full w-6 h-6 flex items-center justify-center text-xs"
                            >
                              {emoji}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-xl font-semibold text-primary">5.0</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
