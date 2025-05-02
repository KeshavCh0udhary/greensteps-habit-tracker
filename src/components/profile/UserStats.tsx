
import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDashed, Flame, Award, LeafyGreen } from "lucide-react";

interface UserStatsProps {
  profile: any;
}

const UserStats = ({ profile }: UserStatsProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const stats = [
    {
      title: "Current Streak",
      value: profile?.current_streak || 0,
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      suffix: "days",
      description: "Keep it going!",
      animate: true
    },
    {
      title: "Total Points",
      value: profile?.total_points || 0,
      icon: LeafyGreen,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      suffix: "pts",
      description: "Your eco-score",
      animate: true
    },
    {
      title: "Longest Streak",
      value: profile?.longest_streak || 0,
      icon: Award,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      suffix: "days",
      description: "Personal best",
      animate: true
    },
    {
      title: "Carbon Saved",
      value: Math.round((profile?.total_points || 0) * 1.2),
      icon: CircleDashed,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      suffix: "kg CO₂",
      description: "Estimated",
      animate: true
    }
  ];

  return (
    <div ref={ref} className="mb-8">
      <h2 className="text-xl font-bold mb-4">Your Stats</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`${stat.bgColor} p-2 rounded-md`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="flex items-baseline">
                    <CountUp
                      value={stat.value}
                      isInView={isInView}
                      className="text-2xl font-bold"
                    />
                    <span className="ml-1 text-sm text-muted-foreground">
                      {stat.suffix}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

interface CountUpProps {
  value: number;
  isInView: boolean;
  className?: string;
}

const CountUp = ({ value, isInView, className }: CountUpProps) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    if (!isInView || !nodeRef.current) return;
    
    let start = 0;
    const end = value;
    const duration = 1500;
    const startTime = performance.now();
    
    const updateNumber = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);
      
      if (nodeRef.current) {
        nodeRef.current.textContent = currentCount.toString();
      }
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        if (nodeRef.current) {
          nodeRef.current.textContent = end.toString();
        }
      }
    };
    
    requestAnimationFrame(updateNumber);
  }, [value, isInView]);
  
  return <span ref={nodeRef} className={className}>0</span>;
};

export default UserStats;
