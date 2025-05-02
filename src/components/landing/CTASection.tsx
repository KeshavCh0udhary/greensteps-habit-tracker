
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-16 bg-green-700 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Join thousands making a difference
        </h2>
        <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
          Start your eco-friendly journey today and be part of the global
          movement working towards a greener future.
        </p>
        <Link to="/signup">
          <Button
            size="lg"
            className="bg-white text-green-700 hover:bg-green-100"
          >
            Create Your Free Account
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
