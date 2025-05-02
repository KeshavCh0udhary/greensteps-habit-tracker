
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DialogFooter } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Available emoji choices for custom habits
const emojiChoices = [
  "🚲", "🌱", "🌿", "🌳", "🌞", "🚶‍♂️", "🔋", "♻️", "🥗", 
  "🚿", "🌊", "📱", "💡", "🥤", "👜", "🚰", "🍽️", "🥬", "🚫", "🧹"
];

// Form validation schema
const habitSchema = z.object({
  title: z.string().min(1, "Habit title is required"),
  emoji: z.string().min(1, "Please select an emoji"),
  eco_points: z.number()
    .min(0.5, "Minimum value is 0.5")
    .max(5, "Maximum value is 5")
});

type HabitFormData = z.infer<typeof habitSchema>;

interface CreateHabitFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateHabitForm = ({ onSuccess, onCancel }: CreateHabitFormProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      title: "",
      emoji: "🌱",
      eco_points: 1
    }
  });

  const handleEmojiSelect = (emoji: string) => {
    form.setValue("emoji", emoji);
    setShowEmojiPicker(false);
  };

  // Handle creating a new custom habit
  const handleCreateHabit = async (data: HabitFormData) => {
    try {
      setIsSubmitting(true);
      
      // Insert the new habit into the database
      const { error, data: newHabit } = await supabase
        .from('eco_habits')
        .insert([{
          title: data.title,
          emoji: data.emoji,
          eco_points: Number(data.eco_points)
        }])
        .select();
      
      if (error) throw error;
      
      setIsSubmitting(false);
      
      // Display success animation with the new habit emoji
      toast.custom(
        (id) => (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/90 dark:to-emerald-900/80 
                       border border-green-200 dark:border-green-700 p-4 rounded-lg shadow-lg flex items-center"
          >
            <div className="mr-3 bg-green-100 dark:bg-green-800/30 h-10 w-10 rounded-full flex items-center justify-center text-xl">
              {data.emoji}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-green-800 dark:text-green-100">New habit created!</h3>
              <p className="text-sm text-green-700 dark:text-green-200">
                "{data.title}" is now ready to use
              </p>
            </div>
          </motion.div>
        ),
        { duration: 3000 }
      );
      
      // Notify parent component of success
      onSuccess();
    } catch (error) {
      console.error("Error creating habit:", error);
      setIsSubmitting(false);
      toast.error("Failed to create habit", {
        description: "Please try again later."
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateHabit)} className="space-y-4 py-2">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1">
            <Label htmlFor="emoji">Emoji</Label>
            <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="text-center text-xl w-full h-10"
                  type="button"
                >
                  {form.watch("emoji")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2">
                <div className="grid grid-cols-5 gap-2">
                  {emojiChoices.map((emoji) => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      className="h-10 w-10 p-0 text-xl transition-transform hover:scale-125"
                      onClick={() => handleEmojiSelect(emoji)}
                      type="button"
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <FormField
              control={form.control}
              name="emoji"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input {...field} type="hidden" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="title">Habit Title</Label>
                  <FormControl>
                    <Input
                      id="title"
                      placeholder="E.g., Used Reusable Bag"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="eco_points"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="eco_points">Eco Points (0.5-5)</Label>
              <FormControl>
                <Input
                  id="eco_points"
                  type="number"
                  min="0.5"
                  max="5"
                  step="0.5"
                  {...field}
                  onChange={event => field.onChange(parseFloat(event.target.value))}
                />
              </FormControl>
              <p className="text-xs text-muted-foreground mt-1">
                Assign points based on environmental impact (0.5-5)
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="mt-4">
          <Button 
            type="button"
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="relative overflow-hidden bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
          >
            <span className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              {isSubmitting ? 'Creating...' : 'Create Habit'}
            </span>
            <motion.div 
              className="absolute inset-0 bg-white" 
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.5, opacity: 0.1 }}
              transition={{ duration: 0.5 }}
            />
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CreateHabitForm;
