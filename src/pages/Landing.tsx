
import PageLayout from "@/components/layout/PageLayout";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CTASection from "@/components/landing/CTASection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";

const Landing = () => {
  return (
    <PageLayout>
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
    </PageLayout>
  );
};

export default Landing;
