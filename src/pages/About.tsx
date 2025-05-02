
import PageLayout from "@/components/layout/PageLayout";
import { motion } from "framer-motion";

const About = () => {
  return (
    <PageLayout>
      <motion.div
        className="container mx-auto px-4 py-16 md:py-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
            About GreenSteps
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground mb-8">
              GreenSteps empowers individuals to make sustainable choices through daily habit tracking and community engagement.
            </p>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">Our Mission</h2>
            <p>
              At GreenSteps, we believe that small, consistent actions can lead to significant environmental impact. 
              Our mission is to make sustainable living accessible, measurable, and enjoyable for everyone.
            </p>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">Our Story</h2>
            <p>
              Founded in 2023, GreenSteps emerged from a simple idea: what if we could visualize the 
              positive impact of our daily eco-friendly choices? Our team of environmental enthusiasts 
              and technology experts came together to create a platform that not only tracks sustainable 
              habits but also builds a community of like-minded individuals.
            </p>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">Our Values</h2>
            <ul className="space-y-4">
              <li>
                <strong>Sustainability:</strong> We practice what we preach by minimizing our own carbon footprint.
              </li>
              <li>
                <strong>Transparency:</strong> We're open about how we calculate environmental impact.
              </li>
              <li>
                <strong>Community:</strong> We believe collective action drives meaningful change.
              </li>
              <li>
                <strong>Innovation:</strong> We constantly seek new ways to make sustainable living easier.
              </li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">Meet the Team</h2>
            <p>
              Our diverse team brings together expertise in environmental science, software development, 
              user experience design, and community building. United by our passion for sustainability, 
              we work remotely across different time zones to bring GreenSteps to users worldwide.
            </p>
          </div>
        </div>
      </motion.div>
    </PageLayout>
  );
};

export default About;
