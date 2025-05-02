
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EcoHabitTooltipProps {
  logId?: string;
  habitId: string;
  isLogged: boolean;
  notes?: string | null;
  onLogHabit: (habitId: string, notes: string) => Promise<void>;
  emoji: string;
  title: string;
}

const EcoHabitTooltip = ({
  logId,
  habitId,
  isLogged,
  notes,
  onLogHabit,
  emoji,
  title,
}: EcoHabitTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [noteText, setNoteText] = useState(notes || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddNote = async () => {
    if (!isLogged) {
      try {
        setIsLoading(true);
        await onLogHabit(habitId, noteText);
        setIsOpen(false);
        toast.success("Eco-habit logged successfully! 🌱");
      } catch (error) {
        console.error("Error logging habit:", error);
        toast.error("Failed to log habit");
      } finally {
        setIsLoading(false);
      }
    } else if (logId) {
      try {
        setIsLoading(true);
        const { error } = await supabase
          .from("daily_logs")
          .update({ notes: noteText })
          .eq("id", logId);

        if (error) throw error;
        
        setIsOpen(false);
        toast.success("Note updated successfully! 🌱");
      } catch (error) {
        console.error("Error updating note:", error);
        toast.error("Failed to update note");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 rounded-full bg-primary/10 hover:bg-primary/20 p-0 absolute right-2 top-2"
        >
          {notes ? "📝" : "➕"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="font-medium flex items-center gap-2">
            <span>{emoji}</span>
            <span>{title}</span>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {isLogged
                ? "Your note for this habit:"
                : "Add a note about this habit:"}
            </p>
            <Input
              placeholder="E.g., Used bicycle for grocery shopping"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={handleAddNote} 
              size="sm" 
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : isLogged ? "Update Note" : "Log with Note"}
            </Button>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
};

export default EcoHabitTooltip;
