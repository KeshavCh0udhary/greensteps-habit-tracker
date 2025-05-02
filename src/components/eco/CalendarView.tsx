
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative h-9 w-9 p-0 flex items-center justify-center">
              <div
                className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center text-sm transition-colors",
                  intensityLevel === 0 && "bg-muted hover:bg-muted/80",
                  intensityLevel === 1 && "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200",
                  intensityLevel === 2 && "bg-green-200 dark:bg-green-800/30 text-green-800 dark:text-green-200",
                  intensityLevel === 3 && "bg-green-300 dark:bg-green-700/40 text-green-800 dark:text-green-200",
                  intensityLevel === 4 && "bg-green-400 dark:bg-green-600/50 text-green-900 dark:text-green-100",
                  intensityLevel === 5 && "bg-green-500 dark:bg-green-500/60 text-white"
                )}
              >
                {format(day, "d")}
              </div>
              {habitsLogged > 0 && (
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-600 border border-background" />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <div className="font-medium">{format(day, "MMM d, yyyy")}</div>
              {habitsLogged > 0 ? (
                <>
                  <div>{habitsLogged} habit{habitsLogged !== 1 ? 's' : ''} logged</div>
                  <div>{pointsLogged} eco-points earned</div>
                </>
              ) : (
                <div>No habits logged</div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const prevMonth = new Date(date);
            prevMonth.setMonth(prevMonth.getMonth() - 1);
            onDateChange(prevMonth);
          }}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-medium">{format(date, 'MMMM yyyy')}</div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const nextMonth = new Date(date);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            onDateChange(nextMonth);
          }}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

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
      />
      
      <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
        <div className="flex items-center gap-1">
          <Info className="h-3 w-3" />
          <span>Color intensity shows eco-points earned</span>
        </div>
      </div>
      
      <div className="flex justify-center items-center gap-1 pt-2">
        <div className="flex items-center space-x-1 text-xs">
          <div className="h-3 w-3 bg-muted rounded-sm"></div>
          <div>0</div>
        </div>
        <div className="flex-1 h-0.5 bg-gradient-to-r from-muted via-green-300 to-green-500"></div>
        <div className="flex items-center space-x-1 text-xs">
          <div className="h-3 w-3 bg-green-500 rounded-sm"></div>
          <div>8+</div>
        </div>
      </div>

      {selectedDate && (
        <Card className="p-4 mt-4">
          <h3 className="font-medium mb-2">
            {format(selectedDate, "MMMM d, yyyy")}
          </h3>
          
          {(() => {
            const dateKey = format(selectedDate, 'yyyy-MM-dd');
            const dayData = logData[dateKey];
            
            if (!dayData || dayData.habits.length === 0) {
              return (
                <p className="text-muted-foreground text-sm">
                  No habits logged on this day.
                </p>
              );
            }
            
            return (
              <div>
                <div className="text-sm mb-1">
                  <span className="font-medium">{dayData.habits.length}</span> habit
                  {dayData.habits.length !== 1 ? "s" : ""} logged
                </div>
                <div className="text-sm mb-2">
                  <span className="font-medium">{dayData.total_points}</span> eco-points earned
                </div>
              </div>
            );
          })()}
        </Card>
      )}
    </div>
  );
};

export default CalendarView;
