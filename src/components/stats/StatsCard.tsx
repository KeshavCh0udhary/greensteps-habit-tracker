
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description?: string;
  suffix?: string;
  isLoading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  description, 
  suffix = '', 
  isLoading = false 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="border shadow-md bg-card/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  {icon}
                </div>
                <span className="text-sm text-muted-foreground font-medium">{title}</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              {isLoading ? (
                <div className="h-8 w-16 bg-muted rounded animate-pulse"></div>
              ) : (
                <h3 className="text-2xl font-bold">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                  {suffix && <span className="text-lg ml-1">{suffix}</span>}
                </h3>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;
