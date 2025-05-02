import React from "react";
import { motion } from "framer-motion";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Star, TrendingUp } from "lucide-react";

// Type for leader data
interface Leader {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  total_points: number;
  current_streak: number;
  badges: { badge_type: string }[];
}

interface LeaderboardTableProps {
  data: Leader[];
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ data }) => {
  // Function to get medal emoji based on rank
  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return rank;
    }
  };

  // Animation variants for list items
  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  // Determine if we should show the mobile card view or desktop table view
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Top 3 leaders for special highlighting
  const topLeaders = data.slice(0, 3);
  const otherLeaders = data.slice(3);

  return (
    <div>
      {/* Top 3 Leaders with Special Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {topLeaders.map((leader, index) => {
          const rank = index + 1;
          const bgGradient = rank === 1 
            ? "from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 border-amber-200 dark:border-amber-800/50" 
            : rank === 2 
              ? "from-slate-50 to-slate-100 dark:from-slate-800/30 dark:to-slate-700/20 border-slate-200 dark:border-slate-700/50" 
              : "from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20 border-orange-200 dark:border-orange-800/50";
          
          return (
            <motion.div
              key={leader.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className={`p-6 border-2 bg-gradient-to-b ${bgGradient} shadow-md`}>
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-lg">
                      {getMedalEmoji(rank)}
                    </div>
                    <Avatar className="h-16 w-16 mb-3 ring-4 ring-primary/10">
                      <AvatarImage src={leader.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/20 text-primary text-xl">
                        {leader.display_name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <h3 className="font-bold text-lg mt-2">
                    {leader.display_name || "Anonymous Eco-Hero"}
                  </h3>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4 w-full">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center text-green-600 dark:text-green-400">
                        <Award className="h-4 w-4 mr-1" />
                      </div>
                      <span className="text-xl font-bold">{leader.total_points}</span>
                      <span className="text-xs text-muted-foreground">points</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center text-amber-600 dark:text-amber-400">
                        <TrendingUp className="h-4 w-4 mr-1" />
                      </div>
                      <span className="text-xl font-bold">{leader.current_streak}</span>
                      <span className="text-xs text-muted-foreground">streak</span>
                    </div>
                  </div>

                  {leader.badges && leader.badges.length > 0 && (
                    <div className="mt-3 flex flex-wrap justify-center gap-1">
                      {leader.badges.slice(0, 3).map((badge, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs py-0">
                          {badge.badge_type}
                        </Badge>
                      ))}
                      {leader.badges.length > 3 && (
                        <Badge variant="outline" className="text-xs py-0">
                          +{leader.badges.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Rest of the Leaderboard */}
      {isMobile ? (
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {otherLeaders.map((leader, index) => {
            const rank = index + 4;
            
            return (
              <motion.div key={leader.id} variants={itemVariants}>
                <Card className="p-4 border">
                  <div className="flex items-center">
                    <div className="w-8 text-center font-medium text-muted-foreground">
                      {rank}
                    </div>
                    
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={leader.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {leader.display_name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <p className="font-medium truncate">
                        {leader.display_name || "Anonymous Eco-Hero"}
                      </p>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Award className="h-3 w-3 mr-1 inline" />
                        <span className="mr-2">{leader.total_points} pts</span>
                        <TrendingUp className="h-3 w-3 mr-1 inline" />
                        <span>{leader.current_streak} streak</span>
                      </div>
                    </div>
                    
                    {leader.badges && leader.badges.length > 0 && (
                      <div className="flex gap-1">
                        <Badge variant="outline" className="h-6 text-xs">
                          {leader.badges.length} 🏆
                        </Badge>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <Card className="border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Streak</TableHead>
                <TableHead>Badges</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {otherLeaders.map((leader, index) => {
                const rank = index + 4;
                
                return (
                  <motion.tr
                    key={leader.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b"
                  >
                    <TableCell className="font-medium text-center">
                      {rank}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={leader.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {leader.display_name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {leader.display_name || "Anonymous Eco-Hero"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-2 text-green-500" />
                        {leader.total_points}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-amber-500" />
                        {leader.current_streak}
                      </div>
                    </TableCell>
                    <TableCell>
                      {leader.badges && leader.badges.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {leader.badges.slice(0, 2).map((badge, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {badge.badge_type}
                            </Badge>
                          ))}
                          {leader.badges.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{leader.badges.length - 2}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">None yet</span>
                      )}
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default LeaderboardTable;
