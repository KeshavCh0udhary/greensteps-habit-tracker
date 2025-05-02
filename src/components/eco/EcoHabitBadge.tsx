
import { cn } from "@/lib/utils";

interface EcoHabitBadgeProps {
  emoji?: string;
  text?: string;
  className?: string;
  isCompleted?: boolean;
  type?: string;
  earnedAt?: Date;
}

const EcoHabitBadge = ({ emoji, text, className, isCompleted = false, type, earnedAt }: EcoHabitBadgeProps) => {
  // If we have a badge type, use that for display
  if (type) {
    // Determine emoji based on badge type
    let badgeEmoji = '🌱';
    if (type.includes('Streak')) {
      badgeEmoji = '🔥';
    } else if (type.includes('Points')) {
      badgeEmoji = '🏆';
    }

    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-colors",
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
          className
        )}
      >
        <span>{badgeEmoji}</span>
        <span>{type}</span>
        {earnedAt && <span className="text-xs opacity-75">({earnedAt.toLocaleDateString()})</span>}
      </div>
    );
  }

  // Original implementation for habit badges
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
      {emoji && <span>{emoji}</span>}
      {text && <span>{text}</span>}
    </div>
  );
};

export default EcoHabitBadge;
