
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { getSupabaseClient } from "@/lib/supabase";
import { toast } from "sonner";
import EcoHabitCard from "@/components/eco/EcoHabitCard";
import EcoHabitBadge from "@/components/eco/EcoHabitBadge";
import { format } from "date-fns";
import { Check, ChevronRight } from "lucide-react";

// Mock data for initial preview
const habitsList = [
  { id: "1", emoji: "🚗", title: "Carpooling", points: 2 },
  { id: "2", emoji: "🔄", title: "Reused Container", points: 1 },
  { id: "3", emoji: "🍽️", title: "Skipped Meat", points: 2 },
  { id: "4", emoji: "🚴", title: "Used Public Transport", points: 1.5 },
  { id: "5", emoji: "🛍️", title: "No-Plastic Day", points: 2 },
  { id: "6", emoji: "📝", title: "Others (Custom)", points: 1 },
];

// Simple mock data for the dashboard
const mockStats = {
  totalPoints: 28.5,
  weeklyStreak: 5,
  monthlyStreak: 3,
  lifetimeContribution: 120.5,
};

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [todaysLogs, setTodaysLogs] = useState<string[]>([]);
  const [stats, setStats] = useState(mockStats);
  const [date] = useState(new Date());

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const supabase = getSupabaseClient();
        const today = format(date, 'yyyy-MM-dd');
        
        // Fetch today's logs for the user
        const { data: logs, error: logsError } = await supabase
          .from('daily_logs')
          .select('habit_id')
          .eq('user_id', user.id)
          .eq('date', today);
          
        if (logsError) throw logsError;
        
        if (logs) {
          setTodaysLogs(logs.map(log => log.habit_id));
        }
        
        // In a real implementation, we'd fetch actual user stats here
        // For now, use mock data with slight randomization
        setStats({
          ...mockStats,
          totalPoints: Math.round(mockStats.totalPoints * (0.9 + Math.random() * 0.2) * 10) / 10,
          weeklyStreak: Math.round(mockStats.weeklyStreak * (0.8 + Math.random() * 0.4)),
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load your data', {
          description: 'Please try refreshing the page',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, date]);

  const handleCompleteHabit = async (habitId: string, notes: string) => {
    if (!user) return;
    
    try {
      // In a real implementation, we'd submit to Supabase
      // For now, just update the UI state
      setTodaysLogs([...todaysLogs, habitId]);
      
      // Find the completed habit to get its points
      const habit = habitsList.find(h => h.id === habitId);
      if (habit) {
        setStats({
          ...stats,
          totalPoints: Math.round((stats.totalPoints + habit.points) * 10) / 10,
        });
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error completing habit:', error);
      return Promise.reject(error);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!</h1>
        <p className="text-muted-foreground">Track your eco-friendly habits and see your impact.</p>
      </header>

      <Tabs defaultValue="today" className="space-y-6">
        <TabsList>
          <TabsTrigger value="today">Today's Actions</TabsTrigger>
          <TabsTrigger value="stats">My Stats</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        {/* Today's Actions Tab */}
        <TabsContent value="today" className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">
              Today's Eco-Habits ({format(date, 'MMM d, yyyy')})
            </h2>
            <div className="text-sm text-muted-foreground">
              Logged: {todaysLogs.length}/{habitsList.length}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {habitsList.map((habit) => (
              <EcoHabitCard
                key={habit.id}
                id={habit.id}
                emoji={habit.emoji}
                title={habit.title}
                points={habit.points}
                isCompleted={todaysLogs.includes(habit.id)}
                onComplete={handleCompleteHabit}
              />
            ))}
          </div>
        </TabsContent>

        {/* My Stats Tab */}
        <TabsContent value="stats">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Total Points</CardTitle>
                  <CardDescription>Today's contribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {stats.totalPoints}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Weekly Streak</CardTitle>
                  <CardDescription>Consecutive days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {stats.weeklyStreak} days
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Monthly Goal</CardTitle>
                  <CardDescription>Progress this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2">
                    <div className="text-3xl font-bold text-primary">
                      {stats.monthlyStreak}/4
                    </div>
                    <div className="text-sm text-muted-foreground">weeks</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Lifetime</CardTitle>
                  <CardDescription>Total contribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {stats.lifetimeContribution}
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
                    <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                      <div className="bg-green-100 dark:bg-green-800/30 w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm">
                        🏆
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">First Log Badge</div>
                        <div className="text-sm text-muted-foreground">Started your eco journey</div>
                      </div>
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                      <div className="bg-green-100 dark:bg-green-800/30 w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm">
                        🔥
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">7-Day Streak</div>
                        <div className="text-sm text-muted-foreground">Active for a whole week</div>
                      </div>
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="bg-muted w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm">
                        💯
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">100 Points Club</div>
                        <div className="text-sm text-muted-foreground">Earn 100 total points</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stats.lifetimeContribution}/100
                      </div>
                    </div>
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
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span>🍽️</span>
                            <span className="font-medium">Skipped Meat</span>
                          </div>
                          <span className="text-sm font-medium">12 logs</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span>🚴</span>
                            <span className="font-medium">Used Public Transport</span>
                          </div>
                          <span className="text-sm font-medium">10 logs</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span>🔄</span>
                            <span className="font-medium">Reused Container</span>
                          </div>
                          <span className="text-sm font-medium">8 logs</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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
                    <div className="text-4xl font-bold text-primary">12,405</div>
                    <div className="text-sm text-muted-foreground">
                      Total Points Logged
                    </div>
                  </div>
                  <div className="space-y-2 text-center">
                    <div className="text-4xl font-bold text-primary">🍽️</div>
                    <div className="text-sm text-muted-foreground">
                      Most Common Habit Today
                    </div>
                  </div>
                  <div className="space-y-2 text-center">
                    <div className="text-4xl font-bold text-primary">3.2t</div>
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
                        <div className="font-medium">EcoStar2023</div>
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
                        <div className="font-medium">PlanetFriend</div>
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
                        <div className="font-medium">GreenHero</div>
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
