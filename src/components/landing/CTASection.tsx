
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/lib/auth";
import { Link } from "react-router-dom";

const CTASection = () => {
  const { user } = useAuth();

  return (
    <section className="py-16 bg-green-700 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path fill="currentColor" d="M47.7,-57.2C59,-47.3,63.6,-30.5,65.8,-14C68.1,2.6,68,18.9,60.8,31.3C53.5,43.7,39.2,52.1,24.2,57.8C9.3,63.4,-6.2,66.3,-22.5,63.4C-38.7,60.6,-55.8,52,-64.4,38.1C-73.1,24.2,-73.4,5,-68.3,-11.3C-63.3,-27.6,-52.8,-41,-40.1,-50.7C-27.3,-60.4,-12.2,-66.4,2.4,-69.2C17.1,-72,35.9,-71.5,47.7,-57.2Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-full h-full transform rotate-180">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path fill="currentColor" d="M47.7,-57.2C59,-47.3,63.6,-30.5,65.8,-14C68.1,2.6,68,18.9,60.8,31.3C53.5,43.7,39.2,52.1,24.2,57.8C9.3,63.4,-6.2,66.3,-22.5,63.4C-38.7,60.6,-55.8,52,-64.4,38.1C-73.1,24.2,-73.4,5,-68.3,-11.3C-63.3,-27.6,-52.8,-41,-40.1,-50.7C-27.3,-60.4,-12.2,-66.4,2.4,-69.2C17.1,-72,35.9,-71.5,47.7,-57.2Z" transform="translate(100 100)" />
          </svg>
        </div>
      </div>
      
      <motion.div 
        className="container mx-auto px-4 text-center relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Join thousands making a difference
        </h2>
        <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
          Start your eco-friendly journey today and be part of the global
          movement working towards a greener future.
        </p>
        
        {user ? (
          <Link to="/dashboard">
            <Button
              size="lg"
              className="bg-white text-green-700 hover:bg-green-100 animate-pulse-gentle"
            >
              Go to Dashboard
            </Button>
          </Link>
        ) : (
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <AuthModal defaultTab="signup">
              <Button
                size="lg"
                className="bg-white text-green-700 hover:bg-green-100 animate-pulse-gentle"
              >
                Create Your Free Account
              </Button>
            </AuthModal>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default CTASection;
