
import PageLayout from "@/components/layout/PageLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const Community = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
            GreenSteps Community
          </h1>
          <p className="text-lg text-muted-foreground">
            Join thousands of eco-conscious individuals making a difference through daily actions
          </p>
        </motion.div>
        
        <Tabs defaultValue="discussions" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="discussions">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {discussionPosts.map((post) => (
                <motion.div key={post.id} variants={item}>
                  <Card className="hover-lift">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={post.authorAvatar} alt={post.author} />
                            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{post.author}</CardTitle>
                            <CardDescription className="text-xs">{post.date}</CardDescription>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-1 bg-accent rounded-full text-accent-foreground">
                          {post.category}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-semibold mb-2">{post.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{post.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            {post.comments}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            {post.likes}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm">Read More</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="challenges">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {challenges.map((challenge) => (
                <motion.div key={challenge.id} variants={item}>
                  <Card className="overflow-hidden hover-lift">
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={challenge.image} 
                        alt={challenge.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">
                          {challenge.duration} Days
                        </span>
                        <span className="text-xs text-muted-foreground">{challenge.participants} Participants</span>
                      </div>
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <CardDescription>{challenge.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">Join Challenge</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="events">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {events.map((event) => (
                <motion.div key={event.id} variants={item}>
                  <Card className="hover-lift">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{event.title}</CardTitle>
                          <CardDescription>{event.date}</CardDescription>
                        </div>
                        <div className="text-center px-3 py-2 rounded-lg bg-accent">
                          <div className="text-2xl font-bold">{event.day}</div>
                          <div className="text-xs text-muted-foreground">{event.month}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{event.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          <span className="text-sm text-muted-foreground">{event.location}</span>
                        </div>
                        <Button>RSVP Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

// Sample data
const discussionPosts = [
  {
    id: 1,
    author: "Jessica M.",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    date: "2 hours ago",
    title: "Has anyone tried making their own cleaning products?",
    excerpt: "I'm looking for simple recipes for eco-friendly cleaning products that actually work. What ingredients and ratios do you recommend?",
    category: "DIY",
    comments: 16,
    likes: 24
  },
  {
    id: 2,
    author: "Rajiv K.",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    date: "Yesterday",
    title: "Composting in a small apartment - my success story",
    excerpt: "After months of trial and error, I've finally found a system that works for composting in my tiny apartment without any smell issues...",
    category: "Zero Waste",
    comments: 32,
    likes: 87
  },
  {
    id: 3,
    author: "Sophia L.",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
    date: "2 days ago",
    title: "Best thrift stores in Portland?",
    excerpt: "I'm visiting Portland next month and would love to check out some good secondhand/thrift stores while I'm there. Any recommendations?",
    category: "Sustainable Shopping",
    comments: 21,
    likes: 19
  },
  {
    id: 4,
    author: "Marcus T.",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80",
    date: "3 days ago",
    title: "My vegetable garden progress - urban farming",
    excerpt: "I've been documenting my journey starting an urban vegetable garden on my balcony. Here's what I've learned so far...",
    category: "Urban Gardening",
    comments: 42,
    likes: 105
  }
];

const challenges = [
  {
    id: 1,
    title: "Plastic-Free July",
    description: "Eliminate single-use plastics from your daily routine for a month.",
    duration: 30,
    participants: 843,
    image: "https://images.unsplash.com/photo-1618477462516-8c4f381d2311?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Meatless Mondays",
    description: "Go plant-based every Monday for a month to reduce your carbon footprint.",
    duration: 28,
    participants: 1254,
    image: "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Zero-Waste Week",
    description: "Track and minimize your household waste for one full week.",
    duration: 7,
    participants: 562,
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "Car-Free Challenge",
    description: "Leave your car at home and explore alternative transportation.",
    duration: 14,
    participants: 385,
    image: "https://images.unsplash.com/photo-1519583272095-6433daf26b6e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "Energy Saver Sprint",
    description: "Reduce your household energy consumption by 20% in two weeks.",
    duration: 14,
    participants: 291,
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    title: "Local Food Month",
    description: "Source your food from within 100 miles of your home.",
    duration: 30,
    participants: 178,
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80"
  }
];

const events = [
  {
    id: 1,
    title: "Beach Cleanup Day",
    date: "Saturday, June 12, 2025 • 10:00 AM - 2:00 PM",
    day: "12",
    month: "JUN",
    description: "Join us for a community beach cleanup! We'll provide all necessary equipment. Just bring sunscreen and a reusable water bottle.",
    location: "Ocean Bay Park, San Francisco, CA"
  },
  {
    id: 2,
    title: "Sustainable Living Workshop",
    date: "Tuesday, June 22, 2025 • 6:30 PM - 8:30 PM",
    day: "22",
    month: "JUN",
    description: "Learn practical tips for reducing waste and living more sustainably with expert Anika Roberts. Limited spots available.",
    location: "Community Center, 123 Green St, Portland, OR"
  },
  {
    id: 3,
    title: "Urban Gardening Masterclass",
    date: "Sunday, July 3, 2025 • 11:00 AM - 1:00 PM",
    day: "3",
    month: "JUL",
    description: "Learn how to grow your own food in small spaces. From apartment balconies to community gardens, this workshop covers it all.",
    location: "Botanical Gardens, 500 Garden Way, Seattle, WA"
  },
  {
    id: 4,
    title: "Green Tech Showcase",
    date: "Friday, July 16, 2025 • 3:00 PM - 7:00 PM",
    day: "16",
    month: "JUL",
    description: "Explore the latest innovations in sustainable technology. Meet inventors, entrepreneurs, and environmentalists pushing the boundaries.",
    location: "Innovation Hub, 42 Future Ave, Austin, TX"
  }
];

export default Community;
