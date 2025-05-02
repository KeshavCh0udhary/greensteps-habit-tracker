
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import EcoHabitTooltip from './EcoHabitTooltip';

interface EcoHabitCardProps {
  id: string;
  title: string;
  emoji: string; 
  points: number;
  isCompleted: boolean;
  logId?: string;
  logNotes?: string | null;
  onComplete: (habitId: string, notes: string) => Promise<void>;
}

const EcoHabitCard: React.FC<EcoHabitCardProps> = ({ 
  id, 
  title, 
  emoji, 
  points, 
  isCompleted,
  logId,
  logNotes,
  onComplete 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    if (!isCompleted) {
      try {
        setIsLoading(true);
        await onComplete(id, "");
      } catch (error) {
        console.error("Failed to log habit:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className={`relative overflow-hidden transition-all ${
      isCompleted 
        ? 'bg-primary-foreground/50 border-green-200 dark:border-green-900 shadow-sm' 
        : 'bg-card hover:shadow-md border border-border'
    }`}>
      {/* Completed Indicator */}
      {isCompleted && (
        <div className="absolute top-0 right-0">
          <div className="w-16 h-16 -mt-8 -mr-8 bg-green-500 rotate-45"></div>
          <Check className="absolute top-1 right-1 text-white h-3 w-3" />
        </div>
      )}
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              className={`w-12 h-12 flex items-center justify-center rounded-full text-xl shadow-sm relative ${
                isCompleted 
                  ? 'bg-green-100 dark:bg-green-800/30' 
                  : 'bg-primary/10'
              }`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {emoji}
              <motion.div 
                className={`absolute inset-0 rounded-full ${
                  isCompleted ? 'bg-green-500/10' : 'bg-primary/5'
                }`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: [0.8, 1.2, 1], 
                  opacity: [0, 0.5, 0] 
                }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
            </motion.div>
            
            <div className="space-y-1">
              <h3 className="font-medium leading-none">{title}</h3>
              <p className="text-xs text-muted-foreground">
                +{points} points
                {logNotes && (
                  <span className="ml-2 text-xs text-primary">📝 Note added</span>
                )}
              </p>
            </div>
          </div>
          
          <Button 
            size="sm" 
            variant={isCompleted ? "outline" : "default"}
            className={isCompleted 
              ? "bg-green-100 hover:bg-green-200 text-green-800 border-green-200" 
              : ""
            }
            disabled={isLoading || isCompleted}
            onClick={handleComplete}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : isCompleted ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Plus className="h-4 w-4 mr-1" />
            )}
            {isCompleted ? "Completed" : "Log it"}
          </Button>
        </div>
      </CardContent>
      
      <EcoHabitTooltip 
        habitId={id}
        isLogged={isCompleted}
        notes={logNotes}
        logId={logId}
        onLogHabit={onComplete}
        emoji={emoji}
        title={title}
      />
    </Card>
  );
};

export default EcoHabitCard;
