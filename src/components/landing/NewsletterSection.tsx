
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { toast } from "sonner";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setEmail("");
      toast.success("Thanks for subscribing! 🌱", {
        description: "You'll receive our next newsletter soon.",
      });
    }, 1500);
  };

  return (
    <section className="py-16 bg-accent/70">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay Updated On Green Tips & Challenges!
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join our newsletter for exclusive eco-friendly tips, seasonal challenges, 
            and updates on new features.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button 
              type="submit"
              disabled={isLoading}
              className="relative overflow-hidden"
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
              {/* Ripple effect */}
              <span className="absolute inset-0 overflow-hidden ripple-effect" />
            </Button>
          </form>
          
          <p className="mt-4 text-xs text-muted-foreground">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
