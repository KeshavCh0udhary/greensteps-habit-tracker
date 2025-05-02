
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import LeaderboardFilters from "@/components/leaderboard/LeaderboardFilters";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Sample data to use when real data isn't available or API fails
const sampleLeaderboardData = [
  {
    id: "1",
    display_name: "EcoWarrior123",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    total_points: 1250,
    current_streak: 28,
    badges: [{ badge_type: "Forest Guardian" }, { badge_type: "Waste Reducer" }]
  },
  {
    id: "2",
    display_name: "GreenThumb",
    avatar_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80",
    total_points: 980,
    current_streak: 14,
    badges: [{ badge_type: "Energy Saver" }]
  },
  {
    id: "3",
    display_name: "OceanProtector",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    total_points: 875,
    current_streak: 21,
    badges: [{ badge_type: "Water Guardian" }, { badge_type: "Recycling Pro" }]
  },
  {
    id: "4",
    display_name: "SustainableSam",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    total_points: 720,
    current_streak: 12,
    badges: [{ badge_type: "Transport Hero" }]
  },
  {
    id: "5",
    display_name: "EarthGuardian",
    avatar_url: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=120&q=80",
    total_points: 650,
    current_streak: 9,
    badges: [{ badge_type: "Food Waste Fighter" }]
  }
];

// Define time periods for filtering
type TimePeriod = "all" | "month" | "week";

const Leaderboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("all");

  // Fetch leaderboard data based on selected time period
  const { data: leaderboardData, isLoading, error } = useQuery({
    queryKey: ["leaderboard", selectedPeriod],
    queryFn: async () => {
      try {
        // Check if Supabase is properly configured
        if (!supabase) {
          console.error("Supabase client is not initialized");
          return sampleLeaderboardData;
        }

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
          
          try {
            const { data, error } = await supabase
              .from("daily_logs")
              .select("user_id, eco_points")
              .gte("date", startDate.toISOString().split("T")[0]);
            
            if (error) {
              console.error("Error fetching daily logs:", error);
              throw error;
            }
            
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
            
            if (profilesError) {
              console.error("Error fetching profiles:", profilesError);
              throw profilesError;
            }
            
            // Combine profiles with their points for the period
            const result = profiles.map(profile => ({
              ...profile,
              total_points: pointsByUser[profile.id] || 0
            })).sort((a, b) => b.total_points - a.total_points);
            
            return result.length > 0 ? result : sampleLeaderboardData;
          } catch (err) {
            console.error("Error in time period filtering:", err);
            return sampleLeaderboardData;
          }
        }
        
        const { data, error } = await query;
        if (error) {
          console.error("Error fetching leaderboard data:", error);
          throw error;
        }
        
        return data && data.length > 0 ? data : sampleLeaderboardData;
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        toast.error("Failed to load leaderboard");
        return sampleLeaderboardData;
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
          ) : error ? (
            <div className="text-center py-10 border rounded-lg bg-muted/20">
              <p className="text-lg text-destructive">Error loading leaderboard data</p>
              <p className="text-sm mt-2">Please try again later.</p>
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
