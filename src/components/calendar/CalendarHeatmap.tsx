
import React from 'react';
import { format, eachDayOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isSameMonth } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type LogDataRecord = Record<string, { habits: string[], total_points: number }>;
type ViewType = "week" | "month" | "year";

interface CalendarHeatmapProps {
  logs: LogDataRecord;
  viewType: ViewType;
  currentDate: Date;
}

const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({ logs, viewType, currentDate }) => {
  // Get the date range based on the view type
  const getDateRange = () => {
    switch (viewType) {
      case "week":
        return {
          start: startOfWeek(currentDate, { weekStartsOn: 0 }),
          end: endOfWeek(currentDate, { weekStartsOn: 0 })
        };
      case "year":
        return {
          start: startOfYear(currentDate),
          end: endOfYear(currentDate)
        };
      case "month":
      default:
        return {
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate)
        };
    }
  };

  const { start, end } = getDateRange();
  const days = eachDayOfInterval({ start, end });

  // Render week view (7 days)
  if (viewType === "week") {
    return (
      <div className="py-3">
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm text-muted-foreground">
              {day}
            </div>
          ))}
          
          {days.map(day => {
            const formattedDate = format(day, 'yyyy-MM-dd');
            const dayData = logs[formattedDate];
            const habitCount = dayData?.habits.length || 0;
            const points = dayData?.total_points || 0;
            
            // Determine color intensity based on points
            let colorClass = 'bg-gray-100 dark:bg-gray-800';
            if (points > 0) {
              if (points < 2) colorClass = 'bg-green-100 dark:bg-green-900/30';
              else if (points < 5) colorClass = 'bg-green-200 dark:bg-green-800/40';
              else if (points < 10) colorClass = 'bg-green-300 dark:bg-green-700/50';
              else colorClass = 'bg-green-400 dark:bg-green-600/60';
            }
            
            return (
              <Popover key={formattedDate}>
                <PopoverTrigger asChild>
                  <button
                    className={`aspect-square p-2 rounded-md transition-colors relative flex flex-col items-center justify-center ${colorClass} ${
                      format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'ring-2 ring-primary/50' : ''
                    }`}
                  >
                    <span className="font-medium">{format(day, 'd')}</span>
                    {habitCount > 0 && (
                      <span className="text-xs font-medium bg-background/60 rounded-full px-1.5 mt-1 flex items-center justify-center">
                        {habitCount}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-52 p-2">
                  <DayPopoverContent day={day} habitCount={habitCount} points={points} />
                </PopoverContent>
              </Popover>
            );
          })}
        </div>
      </div>
    );
  }

  // Render month view (grid calendar)
  if (viewType === "month") {
    // Get the days in the month and add padding days from previous/next months
    const firstDayOfMonth = startOfMonth(currentDate);
    const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 });
    const endDate = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
    const allDays = eachDayOfInterval({ start: startDate, end: endDate });
    
    return (
      <div className="p-2">
        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-xs text-center text-muted-foreground">
              {day[0]}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {allDays.map(day => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const formattedDate = format(day, 'yyyy-MM-dd');
            const dayData = logs[formattedDate];
            const habitCount = dayData?.habits.length || 0;
            const points = dayData?.total_points || 0;
            
            // Determine color intensity based on points
            let colorClass = 'bg-gray-100 dark:bg-gray-800';
            if (points > 0) {
              if (points < 2) colorClass = 'bg-green-100 dark:bg-green-900/30';
              else if (points < 5) colorClass = 'bg-green-200 dark:bg-green-800/40';
              else if (points < 10) colorClass = 'bg-green-300 dark:bg-green-700/50';
              else colorClass = 'bg-green-400 dark:bg-green-600/60';
            }
            
            return (
              <Popover key={formattedDate}>
                <PopoverTrigger asChild>
                  <button
                    className={`w-8 h-8 rounded transition-colors relative ${
                      isCurrentMonth 
                        ? colorClass 
                        : 'bg-gray-50 dark:bg-gray-900/20 opacity-40'
                    } ${
                      format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                        ? 'ring-2 ring-primary/50'
                        : ''
                    }`}
                    disabled={!isCurrentMonth}
                  >
                    <span className="text-[10px] absolute top-0.5 left-0.5 text-muted-foreground">
                      {day.getDate()}
                    </span>
                    {habitCount > 0 && (
                      <span className="absolute bottom-0.5 right-0.5 text-[10px] font-medium bg-background/60 rounded-full w-4 h-4 flex items-center justify-center">
                        {habitCount}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-52 p-2">
                  <DayPopoverContent day={day} habitCount={habitCount} points={points} />
                </PopoverContent>
              </Popover>
            );
          })}
        </div>
        
        <div className="mt-4 flex justify-end items-center gap-2">
          <div className="text-xs text-muted-foreground">Less</div>
          <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded"></div>
          <div className="w-3 h-3 bg-green-100 dark:bg-green-900/30 rounded"></div>
          <div className="w-3 h-3 bg-green-200 dark:bg-green-800/40 rounded"></div>
          <div className="w-3 h-3 bg-green-300 dark:bg-green-700/50 rounded"></div>
          <div className="w-3 h-3 bg-green-400 dark:bg-green-600/60 rounded"></div>
          <div className="text-xs text-muted-foreground">More</div>
        </div>
      </div>
    );
  }

  // Render year view (GitHub-style heatmap)
  return (
    <div className="p-2">
      <div className="flex flex-wrap gap-1">
        {days.map(day => {
          const formattedDate = format(day, 'yyyy-MM-dd');
          const dayData = logs[formattedDate];
          const habitCount = dayData?.habits.length || 0;
          const points = dayData?.total_points || 0;
          
          // Determine color intensity based on points
          let colorClass = 'bg-gray-100 dark:bg-gray-800';
          if (points > 0) {
            if (points < 2) colorClass = 'bg-green-100 dark:bg-green-900/30';
            else if (points < 5) colorClass = 'bg-green-200 dark:bg-green-800/40';
            else if (points < 10) colorClass = 'bg-green-300 dark:bg-green-700/50';
            else colorClass = 'bg-green-400 dark:bg-green-600/60';
          }
          
          return (
            <Popover key={formattedDate}>
              <PopoverTrigger asChild>
                <button
                  className={`w-3 h-3 ${colorClass} rounded-sm transition-transform hover:scale-125 ${
                    format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'ring-1 ring-primary' : ''
                  }`}
                  aria-label={format(day, 'MMMM d, yyyy')}
                />
              </PopoverTrigger>
              <PopoverContent className="w-52 p-2">
                <DayPopoverContent day={day} habitCount={habitCount} points={points} />
              </PopoverContent>
            </Popover>
          );
        })}
      </div>
      
      <div className="mt-4 flex justify-end items-center gap-2">
        <div className="text-xs text-muted-foreground">Less</div>
        <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
        <div className="w-3 h-3 bg-green-100 dark:bg-green-900/30 rounded-sm"></div>
        <div className="w-3 h-3 bg-green-200 dark:bg-green-800/40 rounded-sm"></div>
        <div className="w-3 h-3 bg-green-300 dark:bg-green-700/50 rounded-sm"></div>
        <div className="w-3 h-3 bg-green-400 dark:bg-green-600/60 rounded-sm"></div>
        <div className="text-xs text-muted-foreground">More</div>
      </div>
    </div>
  );
};

interface DayPopoverContentProps {
  day: Date;
  habitCount: number;
  points: number;
}

const DayPopoverContent: React.FC<DayPopoverContentProps> = ({ day, habitCount, points }) => (
  <div className="space-y-2">
    <div className="font-medium">
      {format(day, 'MMMM d, yyyy')}
    </div>
    <div className="text-sm">
      {habitCount > 0 ? (
        <>
          <div className="flex items-center text-green-600 dark:text-green-400 gap-1 font-medium">
            <span>{habitCount}</span> 
            <span>habit{habitCount > 1 ? 's' : ''} logged</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {points} eco-points earned
          </div>
        </>
      ) : (
        <div className="text-muted-foreground">
          No habits logged
        </div>
      )}
    </div>
  </div>
);

export default CalendarHeatmap;
