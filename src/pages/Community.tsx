
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import CommunityCard from "@/components/community/CommunityCard";

// Types for our data
interface Community {
  id: string;
  name: string;
  description: string;
  icon: string;
  member_count: number;
}

interface UserCommunity {
  community_id: string;
  user_id: string;
  joined_at: string;
}

// Available communities for demonstration
const availableCommunities: Community[] = [
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
  },
  {
    id: "5",
    name: "Local Food Network",
    description: "Supporting local and sustainable food systems",
    icon: "🥕",
    member_count: 89
  }
];

const Community = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>([]);
  
  // Handle joining a community
  const handleJoinCommunity = (communityId: string) => {
    if (!user) {
      toast.error("You must be logged in to join communities");
      return;
    }
    
    // In a real application, this would be saved to the database
    setJoinedCommunities([...joinedCommunities, communityId]);
    
    const community = availableCommunities.find(c => c.id === communityId);
    if (community) {
      toast.success(`You joined ${community.name}!`, {
        description: `Welcome to the ${community.name} community.`,
        icon: community.icon
      });
    }
  };
  
  // Handle leaving a community
  const handleLeaveCommunity = (communityId: string) => {
    // In a real application, this would remove from the database
    setJoinedCommunities(joinedCommunities.filter(id => id !== communityId));
    
    const community = availableCommunities.find(c => c.id === communityId);
    if (community) {
      toast.info(`You left ${community.name}`, {
        description: `You are no longer a member of the ${community.name} community.`
      });
    }
  };
  
  // Filter communities by search term
  const filteredCommunities = availableCommunities.filter(community => 
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              Eco Communities
            </h1>
            <p className="text-muted-foreground">Join communities of like-minded eco-warriors</p>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* My Communities */}
          <Card className="border shadow-md bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                My Communities
              </CardTitle>
              <CardDescription>
                Communities you've joined to share your eco-journey
              </CardDescription>
              <Separator className="my-2" />
            </CardHeader>
            <CardContent>
              {joinedCommunities.length > 0 ? (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {availableCommunities
                    .filter(community => joinedCommunities.includes(community.id))
                    .map((community) => (
                      <motion.div 
                        key={community.id}
                        variants={itemVariants}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      >
                        <CommunityCard
                          id={community.id}
                          name={community.name}
                          description={community.description}
                          icon={community.icon}
                          memberCount={community.member_count}
                          isJoined={true}
                          onLeave={handleLeaveCommunity}
                        />
                      </motion.div>
                    ))}
                </motion.div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-2" />
                  <p className="text-muted-foreground">You haven't joined any communities yet.</p>
                  <p className="text-sm text-muted-foreground">Browse available communities below.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Communities */}
          <Card className="border shadow-md bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Available Communities
              </CardTitle>
              <CardDescription>
                Find and join eco-friendly communities
              </CardDescription>
              <div className="mt-4">
                <Input
                  placeholder="Search communities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>
              <Separator className="my-2" />
            </CardHeader>
            <CardContent>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {filteredCommunities.length > 0 ? (
                  filteredCommunities.map((community) => (
                    <motion.div 
                      key={community.id}
                      variants={itemVariants}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    >
                      <CommunityCard
                        id={community.id}
                        name={community.name}
                        description={community.description}
                        icon={community.icon}
                        memberCount={community.member_count}
                        isJoined={joinedCommunities.includes(community.id)}
                        onJoin={handleJoinCommunity}
                        onLeave={handleLeaveCommunity}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No communities found matching your search.</p>
                  </div>
                )}
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </PageLayout>
  );
};

export default Community;
