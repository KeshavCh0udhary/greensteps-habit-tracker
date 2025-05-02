
import { motion } from "framer-motion";

// Updated partner logos with valid URLs
const partnerLogos = [
  {
    name: "EarthSave Foundation",
    logo: "https://i.imgur.com/7aGxt1f.png"
  },
  {
    name: "Green Planet Institute",
    logo: "https://i.imgur.com/n6Xvi6I.png"
  },
  {
    name: "Ocean Alliance",
    logo: "https://i.imgur.com/3vUQ9fg.png"
  },
  {
    name: "Forest Warriors",
    logo: "https://i.imgur.com/RAaSuLr.png"
  },
  {
    name: "Clean Energy Fund",
    logo: "https://i.imgur.com/FLcZJgQ.png"
  },
  {
    name: "Sustainable Future",
    logo: "https://i.imgur.com/p2fOrns.png"
  }
];

// Eco warrior testimonials data with valid avatar URLs
const ecoWarriors = [
  {
    name: "Aisha K.",
    role: "Climate Activist",
    avatar: "https://i.imgur.com/JFHjdNJ.jpg",
    testimonial: "GreenSteps helped me reduce my carbon footprint by 40% in just 3 months!"
  },
  {
    name: "Miguel R.",
    role: "Environmental Scientist",
    avatar: "https://i.imgur.com/w5N9VKe.jpg",
    testimonial: "I use GreenSteps to track my lab's sustainability efforts. Game changer!"
  },
  {
    name: "Sarah T.",
    role: "Urban Gardener",
    avatar: "https://i.imgur.com/xNLs63h.jpg",
    testimonial: "The streak calendar keeps me motivated to make eco-friendly choices daily."
  },
  {
    name: "Jamal W.",
    role: "Sustainable Business Owner",
    avatar: "https://i.imgur.com/QcRKBwC.jpg",
    testimonial: "My team competes for top eco-scores. We've cut office waste by 65%!"
  }
];

const PartnerLogosSection = () => {
  return (
    <section className="py-16 bg-background border-y border-border/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold">
            Trusted By Eco-Warriors & Green Organizations
          </h2>
          <p className="mt-2 text-muted-foreground">
            Partnering with environmental leaders to make a bigger impact
          </p>
        </motion.div>
        
        {/* Partner Logos Section */}
        <div className="mb-20">
          {/* Desktop grid */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-8"
          >
            {partnerLogos.map((partner, index) => (
              <motion.div 
                key={partner.name}
                className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="max-h-16 max-w-full"
                />
              </motion.div>
            ))}
          </motion.div>
          
          {/* Mobile carousel */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:hidden overflow-hidden"
          >
            <div className="flex animate-carousel">
              {[...partnerLogos, ...partnerLogos].map((partner, index) => (
                <div 
                  key={`${partner.name}-${index}`}
                  className="flex-shrink-0 w-1/3 px-4 grayscale hover:grayscale-0 transition-all duration-300"
                >
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="max-h-12 max-w-full mx-auto"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Eco Warriors Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold">
            Meet Our Eco Warriors
          </h2>
          <p className="mt-2 text-muted-foreground">
            See how GreenSteps is making a real-world impact
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ecoWarriors.map((warrior, index) => (
            <motion.div
              key={warrior.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" }}
              className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/40 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="mb-4 relative">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/30">
                  <img 
                    src={warrior.avatar} 
                    alt={warrior.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.div 
                  className="absolute -bottom-2 -right-2 bg-eco-light rounded-full p-1"
                  animate={{ rotate: [0, 10, 0, -10, 0] }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "mirror", 
                    duration: 2,
                    delay: index * 0.2
                  }}
                >
                  <div className="text-white text-lg">🌱</div>
                </motion.div>
              </div>
              <h3 className="font-bold text-lg">{warrior.name}</h3>
              <p className="text-sm text-primary mb-2">{warrior.role}</p>
              <p className="text-muted-foreground text-sm italic">&ldquo;{warrior.testimonial}&rdquo;</p>
              
              <div className="flex mt-3 text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>★</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerLogosSection;
