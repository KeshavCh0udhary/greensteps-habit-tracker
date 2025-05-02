
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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

const openPositions = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    location: "San Francisco, CA (Remote OK)",
    department: "Engineering",
    type: "Full-time",
    description: "Join our team in creating a seamless and engaging experience for our eco-conscious users. You'll be responsible for developing responsive interfaces and implementing cutting-edge animations that bring our sustainability vision to life."
  },
  {
    id: 2,
    title: "Environmental Data Scientist",
    location: "Remote",
    department: "Research",
    type: "Full-time",
    description: "Help us quantify environmental impact by developing models that translate user eco-actions into meaningful metrics. You'll work closely with our product team to create visually compelling representations of sustainability data."
  },
  {
    id: 3,
    title: "Community Manager",
    location: "New York, NY (Remote OK)",
    department: "Marketing",
    type: "Full-time",
    description: "Build and nurture our growing community of eco-enthusiasts. You'll develop engagement strategies, moderate discussions, and collaborate with partners to create meaningful sustainability challenges for our users."
  },
  {
    id: 4,
    title: "UX/UI Designer",
    location: "Remote",
    department: "Design",
    type: "Full-time",
    description: "Design beautiful, intuitive experiences that help users track and visualize their sustainability journey. You'll create wireframes, prototypes, and high-fidelity designs that embody our nature-inspired aesthetic."
  },
  {
    id: 5,
    title: "Content Writer/Sustainability Specialist",
    location: "Remote",
    department: "Content",
    type: "Part-time",
    description: "Create engaging, educational content about sustainable living practices. You'll draft blog posts, in-app tips, and social media content that inspires our community to adopt and maintain eco-friendly habits."
  }
];

const Careers = () => {
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
            Join Our Mission
          </h1>
          <p className="text-lg text-muted-foreground">
            Help us create a more sustainable world through technology and community
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Why Work With Us?</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="mr-3 mt-1 bg-primary/10 p-1 rounded-full">
                    <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <span className="font-medium">Purpose-driven work</span>
                    <p className="text-sm text-muted-foreground">Make a real impact on environmental sustainability.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 bg-primary/10 p-1 rounded-full">
                    <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <span className="font-medium">Remote-first culture</span>
                    <p className="text-sm text-muted-foreground">Work from anywhere with flexible hours.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 bg-primary/10 p-1 rounded-full">
                    <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <span className="font-medium">Competitive benefits</span>
                    <p className="text-sm text-muted-foreground">Health insurance, paid time off, and wellness stipends.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 bg-primary/10 p-1 rounded-full">
                    <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <span className="font-medium">Growth opportunities</span>
                    <p className="text-sm text-muted-foreground">Professional development budget and mentorship.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 bg-primary/10 p-1 rounded-full">
                    <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <span className="font-medium">Eco-focused perks</span>
                    <p className="text-sm text-muted-foreground">Sustainable product discounts and volunteer time.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80" 
                alt="Team working together" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </motion.div>
        
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-2xl font-semibold mb-6"
          >
            Open Positions
          </motion.h2>
          
          <motion.div
            className="space-y-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {openPositions.map((position) => (
              <motion.div key={position.id} variants={item}>
                <Card className="hover-lift">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{position.title}</CardTitle>
                        <CardDescription>{position.location}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                          {position.department}
                        </span>
                        <span className="px-2 py-1 bg-accent text-accent-foreground rounded-full text-xs">
                          {position.type}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{position.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-12 text-center"
          >
            <h3 className="text-xl font-medium mb-2">Don't see the right position?</h3>
            <p className="text-muted-foreground mb-4">
              We're always looking for talented people. Send us your resume!
            </p>
            <Button>
              Send Open Application
            </Button>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Careers;
