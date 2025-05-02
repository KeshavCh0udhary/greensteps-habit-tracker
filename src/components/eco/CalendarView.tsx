
import React from 'react';
import { motion } from 'framer-motion';
import CalendarHeatmap from '@/components/calendar/CalendarHeatmap';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LogDataRecord } from '@/types/interfaces';
import { format } from 'date-fns';

interface CalendarViewProps {
  viewType: "week" | "month" | "year";
  date: Date;
  onDateChange?: (date: Date) => void;
  logData: LogDataRecord;
  isLoading: boolean;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  viewType,
  date,
  onDateChange,
  logData,
  isLoading
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <Card className="border shadow-md bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Your Activity Calendar</CardTitle>
          <CardDescription>
            Your eco-habit logging activity for {format(date, viewType === "year" ? 'yyyy' : viewType === "week" ? "'Week of' MMM d, yyyy" : 'MMMM yyyy')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-64 bg-muted rounded"></div>
            </div>
          ) : (
            <CalendarHeatmap 
              logs={logData}
              viewType={viewType}
              currentDate={date}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CalendarView;
