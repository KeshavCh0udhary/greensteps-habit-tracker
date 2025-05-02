
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserBadgesProps {
  userId: string | undefined;
}

interface Badge {
  id: string;
  badge_type: string;
  earned_at: string;
}

const AVAILABLE_BADGES = [
  {
    type: "7-Day Streak",
    icon: "🔥",
    description: "Maintained a 7-day eco habit streak",
    color: "from-amber-500 to-orange-500"
  },
  {
    type: "30-Day Streak",
    icon: "🌟",
    description: "Maintained a 30-day eco habit streak",
    color: "from-blue-500 to-indigo-500"
  },
  {
    type: "100 Points Club",
    icon: "🌱",
    description: "Earned 100 eco points through green actions",
    color: "from-green-500 to-emerald-500"
  },
  {
    type: "500 Points Club",
    icon: "🌍",
    description: "Earned 500 eco points through green actions",
    color: "from-violet-500 to-purple-500"
  },
  {
    type: "First Log",
    icon: "📝",
    description: "Logged your first eco habit",
    color: "from-teal-500 to-cyan-500"
  }
];

const UserBadges = ({ userId }: UserBadgesProps) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    
    const fetchBadges = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("badges")
          .select("*")
          .eq("user_id", userId);
          
        if (error) throw error;
        setBadges(data || []);
      } catch (error) {
        console.error("Error fetching badges:", error);
        toast.error("Failed to load badges");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBadges();
  }, [userId]);

  const badgesList = AVAILABLE_BADGES.map(badge => {
    const earned = badges.find(b => b.badge_type === badge.type);
    return {
      ...badge,
      earned,
      earnedDate: earned ? new Date(earned.earned_at).toLocaleDateString() : null
    };
  });

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl">Your Badges</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse rounded-full bg-muted h-16 w-16"></div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {badgesList.map((badge, index) => (
              <HoverCard key={badge.type}>
                <HoverCardTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.3,
                    }}
                    whileHover={{ scale: 1.05 }}
                    className={`relative h-16 w-16 rounded-full flex items-center justify-center cursor-pointer
                      ${badge.earned ? `bg-gradient-to-br ${badge.color} shadow-md` : 'bg-muted'}
                      transition-all duration-300`}
                  >
                    <span className={`text-2xl ${badge.earned ? '' : 'opacity-30'}`}>
                      {badge.icon}
                    </span>
                    
                    {badge.earned && (
                      <motion.div 
                        className="absolute -top-1 -right-1 h-5 w-5 bg-white rounded-full flex items-center justify-center shadow-sm"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        <span className="text-xs">✓</span>
                      </motion.div>
                    )}
                    
                    {badge.earned && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={{
                          boxShadow: [
                            `0 0 0 0px rgba(255, 255, 255, 0.3)`,
                            `0 0 0 8px rgba(255, 255, 255, 0)`,
                          ],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          delay: index * 0.2,
                        }}
                      />
                    )}
                  </motion.div>
                </HoverCardTrigger>
                <HoverCardContent className="w-64">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{badge.type}</h4>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                    </div>
                    <div className="text-xl">{badge.icon}</div>
                  </div>
                  
                  {badge.earned ? (
                    <p className="text-xs text-muted-foreground mt-2 flex items-center">
                      <span className="bg-primary/20 text-primary text-xs rounded-full p-0.5 mr-1">✓</span>
                      Earned on {badge.earnedDate}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      Not yet earned. Keep going!
                    </p>
                  )}
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        )}
        {badges.length === 0 && !isLoading && (
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              No badges earned yet. Start logging eco-habits to earn badges!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserBadges;
