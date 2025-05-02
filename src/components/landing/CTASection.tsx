
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/lib/auth";
import { Link } from "react-router-dom";

const CTASection = () => {
  const { user } = useAuth();

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: 0.3 }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.98 }
  };

  const backgroundVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 0.1,
      scale: 1,
      transition: { duration: 1.5 }
    }
  };

  return (
    <section className="py-16 bg-green-700 text-white relative overflow-hidden">
      {/* Animated Background decoration */}
      <motion.div 
        className="absolute inset-0 z-0"
        variants={backgroundVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="absolute top-0 left-0 w-full h-full">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <motion.path 
              fill="currentColor" 
              d="M47.7,-57.2C59,-47.3,63.6,-30.5,65.8,-14C68.1,2.6,68,18.9,60.8,31.3C53.5,43.7,39.2,52.1,24.2,57.8C9.3,63.4,-6.2,66.3,-22.5,63.4C-38.7,60.6,-55.8,52,-64.4,38.1C-73.1,24.2,-73.4,5,-68.3,-11.3C-63.3,-27.6,-52.8,-41,-40.1,-50.7C-27.3,-60.4,-12.2,-66.4,2.4,-69.2C17.1,-72,35.9,-71.5,47.7,-57.2Z" 
              transform="translate(100 100)" 
              animate={{
                d: [
                  "M47.7,-57.2C59,-47.3,63.6,-30.5,65.8,-14C68.1,2.6,68,18.9,60.8,31.3C53.5,43.7,39.2,52.1,24.2,57.8C9.3,63.4,-6.2,66.3,-22.5,63.4C-38.7,60.6,-55.8,52,-64.4,38.1C-73.1,24.2,-73.4,5,-68.3,-11.3C-63.3,-27.6,-52.8,-41,-40.1,-50.7C-27.3,-60.4,-12.2,-66.4,2.4,-69.2C17.1,-72,35.9,-71.5,47.7,-57.2Z",
                  "M52.3,-63.3C66.3,-50.8,74.9,-31.8,76.8,-12.2C78.8,7.5,74.1,27.7,63,43.1C51.9,58.6,34.5,69.3,15.3,73.3C-3.9,77.4,-25,74.8,-43.5,65.2C-62,55.5,-78,38.8,-81.2,20.3C-84.4,1.8,-74.8,-18.6,-62.4,-34.3C-50,-50,-34.8,-61.1,-18.1,-66.8C-1.4,-72.4,14.6,-72.6,29.8,-70.2C45,-67.8,59.5,-62.7,61.9,-59.6C64.2,-56.5,38.3,-75.8,52.3,-63.3Z",
                  "M47.7,-57.2C59,-47.3,63.6,-30.5,65.8,-14C68.1,2.6,68,18.9,60.8,31.3C53.5,43.7,39.2,52.1,24.2,57.8C9.3,63.4,-6.2,66.3,-22.5,63.4C-38.7,60.6,-55.8,52,-64.4,38.1C-73.1,24.2,-73.4,5,-68.3,-11.3C-63.3,-27.6,-52.8,-41,-40.1,-50.7C-27.3,-60.4,-12.2,-66.4,2.4,-69.2C17.1,-72,35.9,-71.5,47.7,-57.2Z"
                ],
                transition: {
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 20,
                  ease: "easeInOut"
                }
              }}
            />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-full h-full transform rotate-180">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <motion.path 
              fill="currentColor" 
              d="M47.7,-57.2C59,-47.3,63.6,-30.5,65.8,-14C68.1,2.6,68,18.9,60.8,31.3C53.5,43.7,39.2,52.1,24.2,57.8C9.3,63.4,-6.2,66.3,-22.5,63.4C-38.7,60.6,-55.8,52,-64.4,38.1C-73.1,24.2,-73.4,5,-68.3,-11.3C-63.3,-27.6,-52.8,-41,-40.1,-50.7C-27.3,-60.4,-12.2,-66.4,2.4,-69.2C17.1,-72,35.9,-71.5,47.7,-57.2Z" 
              transform="translate(100 100)" 
              animate={{
                d: [
                  "M47.7,-57.2C59,-47.3,63.6,-30.5,65.8,-14C68.1,2.6,68,18.9,60.8,31.3C53.5,43.7,39.2,52.1,24.2,57.8C9.3,63.4,-6.2,66.3,-22.5,63.4C-38.7,60.6,-55.8,52,-64.4,38.1C-73.1,24.2,-73.4,5,-68.3,-11.3C-63.3,-27.6,-52.8,-41,-40.1,-50.7C-27.3,-60.4,-12.2,-66.4,2.4,-69.2C17.1,-72,35.9,-71.5,47.7,-57.2Z",
                  "M47.6,-53.8C62.2,-45.2,75,-30.9,79.1,-14.1C83.3,2.7,78.8,22.1,68.2,36.5C57.7,50.8,41.1,60.1,23.5,67.1C5.9,74.1,-12.9,78.7,-29.3,73.2C-45.7,67.6,-59.7,51.9,-69.3,33.3C-78.9,14.8,-83.9,-6.5,-77.4,-22.9C-70.8,-39.4,-52.5,-50.9,-35.7,-58.7C-18.9,-66.5,-3.7,-70.5,10.7,-69.4C25.2,-68.2,33,-62.4,47.6,-53.8Z",
                  "M47.7,-57.2C59,-47.3,63.6,-30.5,65.8,-14C68.1,2.6,68,18.9,60.8,31.3C53.5,43.7,39.2,52.1,24.2,57.8C9.3,63.4,-6.2,66.3,-22.5,63.4C-38.7,60.6,-55.8,52,-64.4,38.1C-73.1,24.2,-73.4,5,-68.3,-11.3C-63.3,-27.6,-52.8,-41,-40.1,-50.7C-27.3,-60.4,-12.2,-66.4,2.4,-69.2C17.1,-72,35.9,-71.5,47.7,-57.2Z"
                ],
                transition: {
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 15,
                  ease: "easeInOut"
                }
              }}
            />
          </svg>
        </div>
      </motion.div>
      
      <motion.div 
        className="container mx-auto px-4 text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-6"
          variants={itemVariants}
        >
          Join thousands making a difference
        </motion.h2>
        
        <motion.p 
          className="text-xl text-green-100 mb-8 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Start your eco-friendly journey today and be part of the global
          movement working towards a greener future.
        </motion.p>
        
        {user ? (
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Link to="/dashboard">
              <Button
                size="lg"
                className="bg-white text-green-700 hover:bg-green-100"
              >
                Go to Dashboard
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <AuthModal defaultTab="signup">
              <Button
                size="lg"
                className="bg-white text-green-700 hover:bg-green-100"
              >
                Create Your Free Account
              </Button>
            </AuthModal>
          </motion.div>
        )}

        {/* Animated leaf icon */}
        <motion.div 
          className="absolute bottom-10 left-10 text-6xl opacity-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 0.2, 
            y: [0, -10, 0],
            rotate: [-5, 5, -5],
            transition: {
              y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
              rotate: { repeat: Infinity, duration: 6, ease: "easeInOut" },
              opacity: { duration: 1 }
            }
          }}
        >
          🌿
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CTASection;
