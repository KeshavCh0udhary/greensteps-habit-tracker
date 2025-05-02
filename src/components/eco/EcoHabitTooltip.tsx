
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
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
          className={`h-7 w-7 rounded-full p-0 absolute right-2 top-2 ${
            notes 
              ? "bg-primary/20 hover:bg-primary/30 text-primary" 
              : "bg-primary/10 hover:bg-primary/20"
          }`}
          aria-label={notes ? "View note" : "Add note"}
        >
          <AnimatePresence>
            <motion.span
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="text-sm"
            >
              {notes ? "📝" : "➕"}
            </motion.span>
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 shadow-lg border-green-200 dark:border-green-900" align="end">
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="font-medium flex items-center gap-2 text-lg">
            <span className="text-xl">{emoji}</span>
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
              className="border-green-200 dark:border-green-900 focus:border-green-300 dark:focus:border-green-700"
            />
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={handleAddNote} 
              size="sm" 
              disabled={isLoading}
              className="relative overflow-hidden bg-green-600 hover:bg-green-700"
            >
              {isLoading ? "Saving..." : isLogged ? "Update Note" : "Log with Note"}
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                animate={isLoading ? { opacity: 0.2 } : { opacity: 0 }}
                transition={{ duration: 0.3, repeat: isLoading ? Infinity : 0, repeatType: "reverse" }}
              />
            </Button>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
};

export default EcoHabitTooltip;
