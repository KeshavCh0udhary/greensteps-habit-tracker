
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/lib/auth";

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent animate-fade-in-up">
            Small steps today,{" "}
            <span className="block">big impact tomorrow</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Track your daily eco-friendly habits and see the collective difference
            we can make for our planet, one green step at a time.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="w-full sm:w-auto text-lg">
                  Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <AuthModal defaultTab="signup">
                <Button size="lg" className="w-full sm:w-auto text-lg">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </AuthModal>
            )}
            <Link to="/about">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="leaf-decoration top-20 left-10 animate-leaf-sway" style={{ animationDelay: "0.5s" }}>
          🌿
        </div>
        <div className="leaf-decoration top-40 right-16 animate-leaf-sway" style={{ animationDelay: "1s" }}>
          🌱
        </div>
        <div className="leaf-decoration bottom-32 left-20 animate-leaf-sway" style={{ animationDelay: "1.5s" }}>
          🍃
        </div>
        <div className="leaf-decoration bottom-40 right-24 animate-leaf-sway" style={{ animationDelay: "2s" }}>
          🌿
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
