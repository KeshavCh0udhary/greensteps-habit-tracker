import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search, Users, UsersRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import CommunityCard from "@/components/community/CommunityCard";
import { useQuery } from "@tanstack/react-query";
import { sampleCommunities } from "@/lib/sampleData";

interface UserCommunity {
  id: string;
  community_id: string;
  user_id: string;
  joined_at: string;
  community_name: string;
  community_description: string;
  community_icon: string;
  member_count: number;
}

const Community = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("discover");
  
  // Get all communities
  const { data: allCommunities, isLoading: communitiesLoading, refetch: refetchCommunities } = useQuery({
    queryKey: ['communities'],
    queryFn: async () => {
      // In a real app, you would fetch this from Supabase
      // Example:
      // const { data, error } = await supabase.from('communities').select('*');
      // if (error) throw error;
      // return data;
      
      // For now, return sample data
      return sampleCommunities;
    }
  });
  
  // Get user's joined communities
  const { data: userCommunities, isLoading: userCommunitiesLoading, refetch: refetchUserCommunities } = useQuery({
    queryKey: ['user-communities', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // In a real app, fetch user communities from Supabase
      // Example:
      // const { data, error } = await supabase
      //   .from('user_communities')
      //   .select(`*, communities(*)`)
      //   .eq('user_id', user.id);
      // if (error) throw error;
      // return data;
      
      // For now, return empty array or mock data
      // This would be populated when a user joins a community
      const joinedCommunitiesStr = localStorage.getItem(`joinedCommunities-${user.id}`);
      if (joinedCommunitiesStr) {
        const joinedCommunityIds = JSON.parse(joinedCommunitiesStr);
        return sampleCommunities.filter(c => joinedCommunityIds.includes(c.id));
      }
      return [];
    },
    enabled: !!user
  });
  
  // Handle joining a community
  const handleJoinCommunity = async (communityId: string) => {
    if (!user) {
      toast.error("Please sign in to join communities");
      return;
    }
    
    // In a real app, you would insert to Supabase
    // Example:
    // const { error } = await supabase.from('user_communities').insert({
    //   user_id: user.id,
    //   community_id: communityId
    // });
    // if (error) {
    //   toast.error("Failed to join community");
    //   return;
    // }
    
    // For now, store in localStorage
    try {
      const joinedCommunitiesStr = localStorage.getItem(`joinedCommunities-${user.id}`);
      let joinedCommunityIds: string[] = [];
      if (joinedCommunitiesStr) {
        joinedCommunityIds = JSON.parse(joinedCommunitiesStr);
      }
      
      if (!joinedCommunityIds.includes(communityId)) {
        joinedCommunityIds.push(communityId);
        localStorage.setItem(`joinedCommunities-${user.id}`, JSON.stringify(joinedCommunityIds));
      }
      
      toast.success("Successfully joined the community!");
      refetchUserCommunities();
      setActiveTab("joined"); // Switch to joined tab
    } catch (err) {
      toast.error("Failed to join community");
      console.error(err);
    }
  };
  
  // Filter communities based on search term
  const filteredCommunities = (allCommunities || []).filter(community => 
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    community.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Check if a user has joined a specific community
  const hasJoinedCommunity = (communityId: string) => {
    if (!userCommunities) return false;
    return userCommunities.some(c => c.id === communityId);
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
              Community
            </h1>
            <p className="text-muted-foreground">Join and collaborate with eco-minded people</p>
          </div>
        </motion.div>
        
        <div className="space-y-6">
          {/* Search and Tabs */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input 
                type="search" 
                placeholder="Search communities..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Tabs 
              defaultValue="discover" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full md:w-auto"
            >
              <TabsList className="grid w-full md:w-auto grid-cols-2">
                <TabsTrigger 
                  value="discover"
                  className="flex items-center gap-1"
                >
                  <UsersRound className="h-4 w-4" />
                  <span>Discover</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="joined"
                  className="flex items-center gap-1"
                >
                  <Users className="h-4 w-4" />
                  <span>Joined</span>
                  {userCommunities && userCommunities.length > 0 && (
                    <span className="ml-1 bg-primary/20 text-xs px-1.5 py-0.5 rounded-full">
                      {userCommunities.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            
              {/* Communities Grid */}
              <TabsContent value="discover" className="mt-0 space-y-4">
                <div>
                  <h2 className="text-lg font-medium">Discover Communities</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Find and join eco-communities that align with your interests
                  </p>
                </div>
                
                {communitiesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <Card key={i} className="border shadow-md">
                        <div className="p-4 animate-pulse">
                          <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-muted"></div>
                            <div className="flex-1">
                              <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                              <div className="h-4 bg-muted rounded w-full"></div>
                              <div className="h-4 bg-muted rounded w-1/2 mt-1"></div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <>
                    {filteredCommunities.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredCommunities.map(community => (
                          <motion.div
                            key={community.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <CommunityCard 
                              id={community.id}
                              name={community.name}
                              description={community.description}
                              icon={community.icon}
                              memberCount={community.memberCount}
                              onJoin={() => handleJoinCommunity(community.id)}
                              isJoined={hasJoinedCommunity(community.id)}
                            />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <UsersRound className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                        <h3 className="mt-4 text-lg font-medium">No communities found</h3>
                        <p className="text-muted-foreground">
                          Try adjusting your search or check back later
                        </p>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="joined" className="mt-0 space-y-4">
                <div>
                  <h2 className="text-lg font-medium">Your Communities</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Communities you've joined and participate in
                  </p>
                </div>
                
                {userCommunitiesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                      <Card key={i} className="border shadow-md">
                        <div className="p-4 animate-pulse">
                          <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-muted"></div>
                            <div className="flex-1">
                              <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                              <div className="h-4 bg-muted rounded w-full"></div>
                              <div className="h-4 bg-muted rounded w-1/2 mt-1"></div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <>
                    {userCommunities && userCommunities.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {userCommunities.map(community => (
                          <motion.div
                            key={community.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <CommunityCard 
                              id={community.id}
                              name={community.name}
                              description={community.description}
                              icon={community.icon}
                              memberCount={community.memberCount}
                              isJoined={true}
                            />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 px-4">
                        <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                        <h3 className="mt-4 text-lg font-medium">You haven't joined any communities yet</h3>
                        <p className="text-muted-foreground">
                          Discover and join communities to connect with other eco-minded people
                        </p>
                        <Button 
                          onClick={() => setActiveTab('discover')}
                          className="mt-6 bg-green-600 hover:bg-green-700"
                        >
                          Discover Communities
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </motion.div>
    </PageLayout>
  );
};

export default Community;
