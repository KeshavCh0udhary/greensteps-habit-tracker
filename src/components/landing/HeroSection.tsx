
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";

const HeroSection = () => {
  const { user } = useAuth();
  
  // Enhanced animation variants
  const textVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (custom: number) => ({
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.7, 
        delay: custom * 0.2,
        ease: "easeOut"
      }
    })
  };
  
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        delay: 0.6,
        ease: "easeOut"
      }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.98 }
  };
  
  const decorationVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (custom: number) => ({
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 1, 
        delay: 0.4 + (custom * 0.2),
        ease: "easeOut"
      }
    })
  };
  
  const floatAnimation = {
    y: [0, -15, 0],
    rotate: [-5, 5, -5],
    transition: {
      duration: 6,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  };
  
  return (
    <section className="relative overflow-hidden pt-20 md:pt-28 lg:pt-36 pb-16 md:pb-24">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            Small steps today,{" "}
            <span className="block">big impact tomorrow</span>
          </motion.h1>
          
          <motion.p 
            className="mt-6 text-xl text-muted-foreground"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            Track your daily eco-friendly habits and see the collective difference
            we can make for our planet, one green step at a time.
          </motion.p>
          
          <motion.div 
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
          >
            {user ? (
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Link to="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto text-lg shadow-lg">
                    Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <AuthModal defaultTab="signup">
                  <Button size="lg" className="w-full sm:w-auto text-lg shadow-lg">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </AuthModal>
              </motion.div>
            )}
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Link to="/about">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg border-2">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <motion.div 
          className="leaf-decoration top-20 left-10" 
          variants={decorationVariants}
          initial="hidden"
          animate="visible"
          custom={0}
          style={{ position: 'absolute' }}
        >
          <motion.span
            animate={floatAnimation}
            className="text-7xl inline-block"
          >
            🌿
          </motion.span>
        </motion.div>
        
        <motion.div 
          className="leaf-decoration top-40 right-16" 
          variants={decorationVariants}
          initial="hidden"
          animate="visible"
          custom={1}
          style={{ position: 'absolute' }}
        >
          <motion.span
            animate={{
              y: [0, -20, 0],
              rotate: [5, -5, 5],
              transition: { duration: 5, repeat: Infinity, repeatType: "reverse" }
            }}
            className="text-7xl inline-block"
          >
            🌱
          </motion.span>
        </motion.div>
        
        <motion.div 
          className="leaf-decoration bottom-32 left-20" 
          variants={decorationVariants}
          initial="hidden"
          animate="visible"
          custom={2}
          style={{ position: 'absolute' }}
        >
          <motion.span
            animate={{
              y: [0, -12, 0],
              rotate: [-8, 8, -8],
              transition: { duration: 7, repeat: Infinity, repeatType: "reverse" }
            }}
            className="text-7xl inline-block"
          >
            🍃
          </motion.span>
        </motion.div>
        
        <motion.div 
          className="leaf-decoration bottom-40 right-24" 
          variants={decorationVariants}
          initial="hidden"
          animate="visible"
          custom={3}
          style={{ position: 'absolute' }}
        >
          <motion.span
            animate={{
              y: [0, -15, 0],
              rotate: [10, -10, 10],
              transition: { duration: 6, repeat: Infinity, repeatType: "reverse" }
            }}
            className="text-7xl inline-block"
          >
            🌿
          </motion.span>
        </motion.div>
        
        {/* Additional floating elements */}
        <motion.div 
          className="leaf-decoration top-60 left-1/3" 
          variants={decorationVariants}
          initial="hidden"
          animate="visible"
          custom={4}
          style={{ position: 'absolute' }}
        >
          <motion.span
            animate={{
              y: [0, -10, 0],
              x: [0, 5, 0],
              rotate: [0, 10, 0],
              transition: { duration: 4, repeat: Infinity, repeatType: "reverse" }
            }}
            className="text-5xl inline-block"
          >
            🌎
          </motion.span>
        </motion.div>
      </div>
      
      {/* Gradient overlay at bottom for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default HeroSection;
