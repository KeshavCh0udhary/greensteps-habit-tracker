
import { cn } from "@/lib/utils";

interface EcoHabitBadgeProps {
  emoji: string;
  text: string;
  className?: string;
  isCompleted?: boolean;
}

const EcoHabitBadge = ({ emoji, text, className, isCompleted = false }: EcoHabitBadgeProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-colors",
        isCompleted
          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
          : "bg-muted text-muted-foreground",
        className
      )}
    >
      <span>{emoji}</span>
      <span>{text}</span>
    </div>
  );
};

export default EcoHabitBadge;
