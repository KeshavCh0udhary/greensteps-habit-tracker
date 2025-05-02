import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Award, BarChart, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import StatsCard from "@/components/stats/StatsCard";
import CalendarView from "@/components/eco/CalendarView";
import { LogDataRecord } from "@/types/interfaces";

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

const Progress = () => {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date());
  const [viewOption, setViewOption] = useState<'week' | 'month' | 'year'>('month');
  
  // Fetch user profile data
  const { data: profile, isLoading: profileLoading } = useQuery({
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
  const { data: badges, isLoading: badgesLoading } = useQuery({
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

  // Fetch active days count - FIXED to count distinct days
  const { data: activeDaysCount, isLoading: activeDaysLoading } = useQuery({
    queryKey: ['active-days', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      
      const { data, error } = await supabase
        .from('daily_logs')
        .select('date')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
        
      if (error) {
        console.error("Error fetching active days:", error);
        throw error;
      }
      
      // Count distinct days
      const distinctDays = new Set();
      data?.forEach(log => distinctDays.add(log.date));
      return distinctDays.size;
    },
    enabled: !!user
  });

  // Get calendar data range based on view option
  const getCalendarDateRange = () => {
    const today = new Date();
    let startDate, endDate;
    
    switch (viewOption) {
      case 'week':
        // Last 7 days
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 6);
        endDate = today;
        break;
      case 'month':
        // Current month
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'year':
        // Current year
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 11, 31);
        break;
    }
    
    return { 
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd')
    };
  };

  // Monthly calendar data for the heatmap
  const { data: logData, isLoading: logDataLoading } = useQuery({
    queryKey: ['calendar-logs', user?.id, viewOption],
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

  // Determine the title based on view option
  const getCalendarTitle = () => {
    switch (viewOption) {
      case 'week':
        return 'Last 7 Days';
      case 'month':
        return format(date, 'MMMM yyyy');
      case 'year':
        return format(date, 'yyyy');
    }
  };

  const isLoading = profileLoading || badgesLoading || activeDaysLoading || logDataLoading;

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
              My Progress
            </h1>
            <p className="text-muted-foreground">Track your eco-journey and achievements over time.</p>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard 
              title="Total Points" 
              value={profile?.total_points || 0} 
              icon={<BarChart className="h-4 w-4" />}
              description="Total eco points earned"
              isLoading={profileLoading}
            />
            <StatsCard 
              title="Longest Streak" 
              value={profile?.longest_streak || 0} 
              icon={<span className="text-xs">🔥</span>}
              suffix="days"
              description="Your best continuous streak"
              isLoading={profileLoading}
            />
            <StatsCard 
              title="Active Days" 
              value={activeDaysCount || 0} 
              icon={<Calendar className="h-4 w-4" />}
              suffix="days"
              description="Days with logged habits"
              isLoading={activeDaysLoading}
            />
            <StatsCard 
              title="Badges Earned" 
              value={badges?.length || 0} 
              icon={<Award className="h-4 w-4" />}
              description="Achievement badges collected"
              isLoading={badgesLoading}
            />
          </div>

          {/* Badges Section */}
          <Card className="border shadow-md bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                My Achievements
              </CardTitle>
              <CardDescription>
                Badges and rewards you've earned on your eco-journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              {badgesLoading ? (
                <div className="flex gap-4">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i} 
                      className="w-24 h-24 rounded-full bg-muted animate-pulse flex items-center justify-center"
                    ></div>
                  ))}
                </div>
              ) : badges && badges.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {badges.map((badge) => (
                    <motion.div
                      key={badge.id}
                      whileHover={{ scale: 1.05 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-24 h-24 rounded-full bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-700 flex items-center justify-center text-3xl shadow-md mb-2">
                        {badge.badge_type.includes('Streak') ? '🔥' : 
                         badge.badge_type.includes('Points') ? '🏆' : '🌱'}
                      </div>
                      <span className="text-sm font-medium text-center">{badge.badge_type}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(badge.earned_at).toLocaleDateString()}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No badges earned yet. Keep up your eco-habits to earn achievements!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Calendar View */}
          <Card className="border shadow-md bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Activity Calendar
                  </CardTitle>
                  <CardDescription>
                    {getCalendarTitle()} activity tracking
                  </CardDescription>
                </div>
                <div>
                  <Tabs 
                    defaultValue={viewOption} 
                    value={viewOption} 
                    onValueChange={(value) => setViewOption(value as 'week' | 'month' | 'year')}
                  >
                    <TabsList className="bg-muted/50">
                      <TabsTrigger value="week">Week</TabsTrigger>
                      <TabsTrigger value="month">Month</TabsTrigger>
                      <TabsTrigger value="year">Year</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
              <Separator />
            </CardHeader>
            <CardContent>
              <CalendarView
                viewType={viewOption}
                date={date}
                onDateChange={(newDate) => setDate(newDate)}
                logData={logData || {}}
                isLoading={logDataLoading}
              />
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </PageLayout>
  );
};

export default Progress;
