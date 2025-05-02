
import PageLayout from "@/components/layout/PageLayout";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import NewsletterSection from "@/components/landing/NewsletterSection";
import PartnerLogosSection from "@/components/landing/PartnerLogosSection";
import CTASection from "@/components/landing/CTASection";
import { motion } from "framer-motion";

const Landing = () => {
  return (
    <PageLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden" // Added to contain animations
      >
        <HeroSection />
        <PartnerLogosSection />
        <FeaturesSection />
        <TestimonialsSection />
        <NewsletterSection />
        <CTASection />
      </motion.div>
    </PageLayout>
  );
};

export default Landing;
