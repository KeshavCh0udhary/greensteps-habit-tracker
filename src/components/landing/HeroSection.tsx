
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";

const HeroSection = () => {
  const { user } = useAuth();
  
  return (
    <section className="relative overflow-hidden pt-20 md:pt-28 lg:pt-36 pb-16 md:pb-24">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Small steps today,{" "}
            <span className="block">big impact tomorrow</span>
          </motion.h1>
          
          <motion.p 
            className="mt-6 text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Track your daily eco-friendly habits and see the collective difference
            we can make for our planet, one green step at a time.
          </motion.p>
          
          <motion.div 
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {user ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto text-lg">
                    Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <AuthModal defaultTab="signup">
                  <Button size="lg" className="w-full sm:w-auto text-lg">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </AuthModal>
              </motion.div>
            )}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/about">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <motion.div 
          className="leaf-decoration top-20 left-10" 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ animationDelay: "0.5s" }}
        >
          <motion.span
            animate={{ 
              y: [0, -20, 0],
              rotate: [-5, 5, -5]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse" 
            }}
            className="text-7xl"
          >
            🌿
          </motion.span>
        </motion.div>
        
        <motion.div 
          className="leaf-decoration top-40 right-16" 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <motion.span
            animate={{ 
              y: [0, -15, 0],
              rotate: [5, -5, 5]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse" 
            }}
            className="text-7xl"
          >
            🌱
          </motion.span>
        </motion.div>
        
        <motion.div 
          className="leaf-decoration bottom-32 left-20" 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          <motion.span
            animate={{ 
              y: [0, -10, 0],
              rotate: [-8, 8, -8]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse" 
            }}
            className="text-7xl"
          >
            🍃
          </motion.span>
        </motion.div>
        
        <motion.div 
          className="leaf-decoration bottom-40 right-24" 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          <motion.span
            animate={{ 
              y: [0, -15, 0],
              rotate: [10, -10, 10]
            }}
            transition={{ 
              duration: 7,
              repeat: Infinity,
              repeatType: "reverse" 
            }}
            className="text-7xl"
          >
            🌿
          </motion.span>
        </motion.div>
      </div>
      
      {/* Gradient overlay at bottom for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default HeroSection;
