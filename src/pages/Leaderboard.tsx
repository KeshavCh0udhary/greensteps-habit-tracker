
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import LeaderboardFilters from "@/components/leaderboard/LeaderboardFilters";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Define time periods for filtering
type TimePeriod = "all" | "month" | "week";

const Leaderboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("all");

  // Fetch leaderboard data based on selected time period
  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ["leaderboard", selectedPeriod],
    queryFn: async () => {
      try {
        let query = supabase
          .from("profiles")
          .select(`
            id,
            display_name,
            avatar_url,
            total_points,
            current_streak,
            badges:badges(badge_type)
          `)
          .order("total_points", { ascending: false });

        // Apply time period filters for weekly or monthly data
        if (selectedPeriod === "week" || selectedPeriod === "month") {
          const daysToSubtract = selectedPeriod === "week" ? 7 : 30;
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - daysToSubtract);
          
          const { data, error } = await supabase
            .from("daily_logs")
            .select("user_id, eco_points")
            .gte("date", startDate.toISOString().split("T")[0]);
          
          if (error) throw error;
          
          // Process data to get points per user within time period
          const pointsByUser = data.reduce((acc: Record<string, number>, log) => {
            const userId = log.user_id;
            acc[userId] = (acc[userId] || 0) + log.eco_points;
            return acc;
          }, {});
          
          // Get user profiles and combine with points data
          const { data: profiles, error: profilesError } = await supabase
            .from("profiles")
            .select(`
              id,
              display_name,
              avatar_url,
              current_streak,
              badges:badges(badge_type)
            `);
          
          if (profilesError) throw profilesError;
          
          // Combine profiles with their points for the period
          const result = profiles.map(profile => ({
            ...profile,
            total_points: pointsByUser[profile.id] || 0
          })).sort((a, b) => b.total_points - a.total_points);
          
          return result;
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        toast.error("Failed to load leaderboard");
        return [];
      }
    }
  });

  // Handle filter change
  const handleFilterChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4">
        <motion.div 
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8 flex-col sm:flex-row gap-4">
            <div>
              <h1 className="text-3xl font-bold">Eco Leaders</h1>
              <p className="text-muted-foreground mt-1">See who's making the biggest impact!</p>
            </div>
            <LeaderboardFilters 
              selectedPeriod={selectedPeriod} 
              onFilterChange={handleFilterChange} 
            />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-60">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-lg">Loading leaderboard data...</p>
            </div>
          ) : leaderboardData && leaderboardData.length > 0 ? (
            <LeaderboardTable data={leaderboardData} />
          ) : (
            <div className="text-center py-10 border rounded-lg bg-muted/20">
              <p className="text-lg text-muted-foreground">No data available for this time period.</p>
              <p className="text-sm mt-2">Be the first to log eco-friendly habits!</p>
            </div>
          )}
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default Leaderboard;
