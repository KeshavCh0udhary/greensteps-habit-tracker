
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const blogPosts = [
  {
    id: 1,
    title: "10 Simple Ways to Reduce Your Carbon Footprint",
    excerpt: "Small changes in your daily routine can make a big difference for the planet.",
    date: "May 1, 2025",
    author: "Emma Johnson",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "The Impact of Plant-Based Diets on Climate Change",
    excerpt: "How your food choices can help combat global warming and environmental degradation.",
    date: "April 22, 2025",
    author: "Michael Chen",
    category: "Nutrition",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Zero-Waste Living: A Beginner's Guide",
    excerpt: "Practical tips for reducing waste in your everyday life without feeling overwhelmed.",
    date: "April 15, 2025",
    author: "Sophia Martinez",
    category: "Sustainable Living",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "The Truth About Carbon Offsets",
    excerpt: "Understanding how carbon offset programs work and if they're truly effective.",
    date: "April 8, 2025",
    author: "David Wilson",
    category: "Climate Science",
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=800&q=80"
  },
];

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

const Blogs = () => {
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
            Eco Blog
          </h1>
          <p className="text-lg text-muted-foreground">
            Stay informed about sustainable living, environmental news, and green habits
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {blogPosts.map((post) => (
            <motion.div key={post.id} variants={item}>
              <Card className="h-full hover-lift overflow-hidden">
                <div className="w-full h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-all hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="text-sm text-muted-foreground mb-2">{post.category}</div>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{post.date}</span>
                  <span className="text-sm font-medium">By {post.author}</span>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default Blogs;
