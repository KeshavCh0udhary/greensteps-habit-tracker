
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

interface EcoHabitCardProps {
  id: string;
  emoji: string;
  title: string;
  points: number;
  isCompleted?: boolean;
  onComplete?: (id: string, notes: string) => Promise<void>;
}

const EcoHabitCard = ({
  id,
  emoji,
  title,
  points,
  isCompleted = false,
  onComplete,
}: EcoHabitCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { notes: "" },
  });

  const handleComplete = async (data: { notes: string }) => {
    if (!onComplete || isCompleted) return;
    
    setIsLoading(true);
    try {
      await onComplete(id, data.notes);
      toast.success("Habit logged successfully!", {
        description: `You earned ${points} eco-points!`,
      });
      reset();
      setIsExpanded(false);
    } catch (error) {
      console.error("Failed to log habit:", error);
      toast.error("Failed to log habit", {
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 border-2",
        isCompleted
          ? "border-green-500 dark:border-green-600 bg-green-50/50 dark:bg-green-900/10"
          : "border-border hover:border-muted-foreground/30"
      )}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-xl",
              isCompleted
                ? "bg-green-100 dark:bg-green-800/30"
                : "bg-muted"
            )}
          >
            {emoji}
          </div>
          <div>
            <h3 className="font-medium text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground">
              {points} eco-point{points !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        {isCompleted ? (
          <div className="bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-300 rounded-full p-1.5">
            <Check className="h-5 w-5" />
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            <ChevronDown
              className={cn(
                "h-5 w-5 transition-transform",
                isExpanded ? "transform rotate-180" : ""
              )}
            />
          </Button>
        )}
      </div>

      {!isCompleted && isExpanded && (
        <div className="px-4 pb-4 pt-2 space-y-3">
          <form onSubmit={handleSubmit(handleComplete)}>
            <Textarea
              placeholder="Add optional notes (max 200 characters)"
              className="resize-none"
              maxLength={200}
              disabled={isLoading}
              {...register("notes")}
            />
            <div className="flex justify-end mt-3">
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? "Logging..." : "Log this habit"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </Card>
  );
};

export default EcoHabitCard;
