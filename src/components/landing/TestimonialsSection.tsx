
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Environmental Activist",
    image: "/testimonial-1.jpg",
    quote: "GreenSteps has completely transformed how I track my environmental impact. The visual data helps me stay motivated!",
  },
  {
    name: "Michael Chen",
    role: "Urban Planner",
    image: "/testimonial-2.jpg",
    quote: "The streak system keeps me accountable. I've maintained eco-friendly habits for over 3 months now!",
  },
  {
    name: "Aisha Patel",
    role: "Teacher",
    image: "/testimonial-3.jpg",
    quote: "I use GreenSteps with my students to teach them about sustainability in a fun, interactive way.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-accent/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">What our users say</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of people making a difference with GreenSteps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.name}
              className="bg-card rounded-xl p-6 shadow-md border border-border/50 hover-lift"
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
              <blockquote className="italic text-muted-foreground">
                "{testimonial.quote}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
