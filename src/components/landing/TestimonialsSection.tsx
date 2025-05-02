
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { StarIcon } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Environmental Activist",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    quote: "GreenSteps has completely transformed how I track my environmental impact. The visual data helps me stay motivated!",
    stars: 5
  },
  {
    name: "Michael Chen",
    role: "Urban Planner",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    quote: "The streak system keeps me accountable. I've maintained eco-friendly habits for over 3 months now!",
    stars: 5
  },
  {
    name: "Aisha Patel",
    role: "Teacher",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
    quote: "I use GreenSteps with my students to teach them about sustainability in a fun, interactive way.",
    stars: 4
  },
  {
    name: "David Torres",
    role: "Software Engineer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    quote: "As someone who cares about data, I love how GreenSteps visualizes my impact. The community features are great too!",
    stars: 5
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-accent/30">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold">See How GreenSteps Is Making an Impact</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of people making a difference with GreenSteps
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {testimonials.map((testimonial) => (
            <motion.div 
              key={testimonial.name}
              className="bg-card rounded-xl p-6 shadow-md border border-border/50 hover-lift"
              variants={item}
            >
              <div className="flex items-center mb-4">
                <Avatar className="h-12 w-12 mr-4 border-2 border-primary/20">
                  <AvatarImage src={testimonial.image} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.stars ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill={i < testimonial.stars ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <blockquote className="italic text-muted-foreground">
                "{testimonial.quote}"
              </blockquote>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
