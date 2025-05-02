
import PageLayout from "@/components/layout/PageLayout";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CTASection from "@/components/landing/CTASection";

const Landing = () => {
  return (
    <PageLayout>
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </PageLayout>
  );
};

export default Landing;
