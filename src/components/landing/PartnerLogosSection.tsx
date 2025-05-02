
import { motion } from "framer-motion";

// Sample partner logos data
const partnerLogos = [
  {
    name: "EarthSave Foundation",
    logo: "https://i.imgur.com/7aGxt1f.png",
    grayscalelogo: "https://i.imgur.com/LYrKSRa.png"
  },
  {
    name: "Green Planet Institute",
    logo: "https://i.imgur.com/n6Xvi6I.png",
    grayscalelogo: "https://i.imgur.com/IQsVbD8.png"
  },
  {
    name: "Ocean Alliance",
    logo: "https://i.imgur.com/3vUQ9fg.png",
    grayscalelogo: "https://i.imgur.com/GI9Q4Cz.png"
  },
  {
    name: "Forest Warriors",
    logo: "https://i.imgur.com/RAaSuLr.png",
    grayscalelogo: "https://i.imgur.com/wabQZMT.png"
  },
  {
    name: "Clean Energy Fund",
    logo: "https://i.imgur.com/FLcZJgQ.png",
    grayscalelogo: "https://i.imgur.com/UTdeMmy.png"
  },
  {
    name: "Sustainable Future",
    logo: "https://i.imgur.com/p2fOrns.png",
    grayscalelogo: "https://i.imgur.com/8Cbpiif.png"
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
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold">
            Trusted By Eco-Warriors & Green Organizations
          </h2>
          <p className="mt-2 text-muted-foreground">
            Partnering with environmental leaders to make a bigger impact
          </p>
        </motion.div>
        
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
    </section>
  );
};

export default PartnerLogosSection;
