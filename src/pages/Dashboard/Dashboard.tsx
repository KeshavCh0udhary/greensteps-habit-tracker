import { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Award, BarChart, Calendar, CalendarDays, Leaf, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { showConfetti, showStreakConfetti } from "@/lib/confetti";
import { toast } from "sonner";
import { LogDataRecord } from "@/types/interfaces";

// Import components
import StatsCard from "@/components/stats/StatsCard";
import CalendarHeatmap from "@/components/calendar/CalendarHeatmap";
import HabitManagement from "@/components/eco/HabitManagement";
import CommunityCard from "@/components/community/CommunityCard";
import EcoHabitBadge from "@/components/eco/EcoHabitBadge";

// Types for our data
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

interface Community {
  id: string;
  name: string;
  description: string;
  icon: string;
  member_count: number;
  joined: boolean; // Track if user has joined
}

// Calendar view types
type CalendarViewType = "week" | "month" | "year";

// Sample communities for the current user (showing only communities they've joined)
// In a real app, this would come from the database with a "joined" flag
const userCommunities: Community[] = [
  {
    id: "1",
    name: "Zero Waste Group",
    description: "Dedicated to reducing waste and living sustainably",
    icon: "♻️",
    member_count: 128,
    joined: true
  },
  {
    id: "3",
    name: "Eco Commuters",
    description: "Using eco-friendly transportation methods",
    icon: "🚲",
    member_count: 56,
    joined: true
  }
];

const Dashboard = () => {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date());
  const formattedDate = format(date, 'yyyy-MM-dd');
  const [calendarView, setCalendarView] = useState<CalendarViewType>("month");
  
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

  // Fetch active days count
  const { data: activeDaysCount, isLoading: activeDaysLoading } = useQuery({
    queryKey: ['active-days', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      
      const { data, error, count } = await supabase
        .from('daily_logs')
        .select('date', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .order('date', { ascending: false });
        
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user
  });
  
  // Get calendar data range based on view option
  const getCalendarDateRange = () => {
    const today = new Date();
    let startDate, endDate;
    
    switch (calendarView) {
      case 'week': {
        // Last 7 days
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 6);
        endDate = today;
        break;
      }
      case 'month': {
        // Current month
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      }
      case 'year': {
        // Current year
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 11, 31);
        break;
      }
    }
    
    return { 
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd')
    };
  };

  // Monthly calendar data for the heatmap
  const { data: periodLogs, isLoading: periodLogsLoading } = useQuery({
    queryKey: ['calendar-logs', user?.id, calendarView, format(date, 'yyyy-MM-dd')],
    queryFn: async () => {
      if (!user) return {} as LogDataRecord;
      
      const { startDate, endDate } = getCalendarDateRange();
      
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
  
  // Handle logging a habit
  const handleLogHabit = async (habitId: string, notes: string): Promise<void> => {
    if (!user) return Promise.reject("User not authenticated");
    
    try {
      // Fetch the habit details
      const { data: habit, error: habitError } = await supabase
        .from('eco_habits')
        .select('*')
        .eq('id', habitId)
        .single();
      
      if (habitError || !habit) return Promise.reject("Habit not found");
      
      // Check if already logged
      const { data: existingLogs, error: logsError } = await supabase
        .from('daily_logs')
        .select('id')
        .eq('user_id', user.id)
        .eq('habit_id', habitId)
        .eq('date', formattedDate);
      
      if (logsError) throw logsError;
      
      if (existingLogs && existingLogs.length > 0) {
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
      await Promise.all([refetchProfile(), refetchBadges()]);
      
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

  // Filter only joined communities for the dashboard
  const joinedCommunities = userCommunities.filter(community => community.joined);

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
            My Communities
          </TabsTrigger>
        </TabsList>

        {/* Today's Actions Tab */}
        <TabsContent value="today" className="space-y-6">
          <HabitManagement 
            date={date} 
            formattedDate={formattedDate} 
            onLogHabit={handleLogHabit} 
          />
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
                    <Tabs defaultValue={calendarView} value={calendarView} onValueChange={(value) => setCalendarView(value as CalendarViewType)}>
                      <TabsList className="bg-muted/50">
                        <TabsTrigger value="week">Week</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                        <TabsTrigger value="year">Year</TabsTrigger>
                      </TabsList>
                    </Tabs>
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
                value={profile?.total_points || 0}
                icon={<Leaf className="h-4 w-4" />}
                description="Points earned from all eco-habits"
                isLoading={profileLoading}
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
                value={activeDaysCount || 0}
                icon={<CalendarDays className="h-4 w-4" />}
                description="Days with logged eco-habits"
                isLoading={activeDaysLoading}
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
        
        {/* Community Tab - Modified to show only joined communities */}
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
              <Link to="/community">
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>Explore Communities</span>
                </Button>
              </Link>
            </div>
            
            {joinedCommunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {joinedCommunities.map(community => (
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
                      isJoined={true}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="border shadow-md bg-card/80 backdrop-blur-sm py-12">
                <CardContent className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-muted-foreground">You haven't joined any communities yet.</p>
                  <Link to="/community" className="mt-4 inline-block">
                    <Button className="mt-2">
                      Explore Communities
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
