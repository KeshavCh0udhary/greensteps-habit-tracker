
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

interface CalendarViewProps {
  date: Date;
  onDateChange: (date: Date) => void;
  logData: Record<string, { habits: string[], total_points: number }>;
}

const CalendarView = ({ date, onDateChange, logData }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date);

  // Calculate intensity level based on points (0-5)
  const getIntensityLevel = (points: number) => {
    if (points === 0) return 0;
    if (points < 2) return 1;
    if (points < 4) return 2;
    if (points < 6) return 3;
    if (points < 8) return 4;
    return 5;
  };

  // Custom day renderer for the calendar
  const renderDay = (day: Date) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const dayData = logData[dateKey];
    const pointsLogged = dayData?.total_points || 0;
    const habitsLogged = dayData?.habits?.length || 0;
    const intensityLevel = getIntensityLevel(pointsLogged);
    const isToday = isSameDay(day, new Date());
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div 
              className={cn(
                "relative h-9 w-9 p-0 flex items-center justify-center",
                isToday && "ring-2 ring-primary ring-offset-1 rounded-full"
              )}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm transition-all duration-300",
                  intensityLevel === 0 && "bg-muted dark:bg-muted/60 hover:bg-muted/80",
                  intensityLevel === 1 && "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200",
                  intensityLevel === 2 && "bg-green-200 dark:bg-green-800/30 text-green-800 dark:text-green-200",
                  intensityLevel === 3 && "bg-green-300 dark:bg-green-700/40 text-green-800 dark:text-green-200",
                  intensityLevel === 4 && "bg-green-400 dark:bg-green-600/50 text-green-900 dark:text-green-100",
                  intensityLevel === 5 && "bg-green-500 dark:bg-green-500/60 text-white",
                  habitsLogged > 0 && "shadow-sm"
                )}
              >
                {format(day, "d")}
              </div>
              {habitsLogged > 0 && (
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-600 border border-background animate-pulse" />
              )}
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-card/95 backdrop-blur-sm border shadow-lg">
            <div className="text-sm">
              <div className="font-medium">{format(day, "MMMM d, yyyy")}</div>
              {habitsLogged > 0 ? (
                <>
                  <div className="mt-1 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    {habitsLogged} habit{habitsLogged !== 1 ? 's' : ''} logged
                  </div>
                  <div className="mt-0.5 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    {pointsLogged} eco-points earned
                  </div>
                </>
              ) : (
                <div className="mt-1 flex items-center gap-1 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/50"></div>
                  No habits logged
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="space-y-4">
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const prevMonth = new Date(date);
            prevMonth.setMonth(prevMonth.getMonth() - 1);
            onDateChange(prevMonth);
          }}
          className="hover:bg-primary/10 transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <motion.div 
          className="font-medium bg-background/70 backdrop-blur-sm px-4 py-1 rounded-full border shadow-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          key={format(date, 'yyyy-MM')}
        >
          {format(date, 'MMMM yyyy')}
        </motion.div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const nextMonth = new Date(date);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            onDateChange(nextMonth);
          }}
          className="hover:bg-primary/10 transition-all"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </motion.div>

      <motion.div 
        className="bg-card/80 backdrop-blur-sm rounded-xl border p-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={day => {
            if (day) {
              setSelectedDate(day);
              onDateChange(day);
            }
          }}
          month={date}
          showOutsideDays
          components={{
            Day: ({ date: day, ...props }) => (
              <div {...props}>
                {renderDay(day)}
              </div>
            ),
          }}
          className="rounded-lg border-0"
        />
      </motion.div>
      
      <motion.div 
        className="flex items-center justify-between text-sm text-muted-foreground pt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center gap-1">
          <Info className="h-3 w-3" />
          <span>Color intensity shows eco-points earned</span>
        </div>
      </motion.div>
      
      <motion.div 
        className="flex justify-center items-center gap-1 pt-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center space-x-1 text-xs">
          <div className="h-3 w-3 bg-muted rounded-sm"></div>
          <div>0</div>
        </div>
        <div className="flex-1 h-1.5 bg-gradient-to-r from-muted via-green-300 to-green-500 rounded-full"></div>
        <div className="flex items-center space-x-1 text-xs">
          <div className="h-3 w-3 bg-green-500 rounded-sm"></div>
          <div>8+</div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {selectedDate && (
          <motion.div
            key={format(selectedDate, 'yyyy-MM-dd')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4 mt-4 border shadow-md bg-card/80 backdrop-blur-sm">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <Calendar className="h-3 w-3 text-primary" />
                </div>
                {format(selectedDate, "MMMM d, yyyy")}
              </h3>
              
              {(() => {
                const dateKey = format(selectedDate, 'yyyy-MM-dd');
                const dayData = logData[dateKey];
                
                if (!dayData || dayData.habits.length === 0) {
                  return (
                    <p className="text-muted-foreground text-sm flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-muted"></span>
                      No habits logged on this day.
                    </p>
                  );
                }
                
                return (
                  <div>
                    <div className="text-sm mb-1 flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-600"></div>
                      <span className="font-medium">{dayData.habits.length}</span> habit
                      {dayData.habits.length !== 1 ? "s" : ""} logged
                    </div>
                    <div className="text-sm mb-2 flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="font-medium">{dayData.total_points}</span> eco-points earned
                    </div>
                  </div>
                );
              })()}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarView;
