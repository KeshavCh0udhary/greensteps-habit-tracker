
import React from 'react';
import { motion } from 'framer-motion';
import CalendarHeatmap from '@/components/calendar/CalendarHeatmap';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogDataRecord } from '@/types/interfaces';

interface CalendarViewProps {
  viewType: "week" | "month" | "year";
  date: Date;
  onDateChange: (date: Date) => void;
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
  // Handle view type changes
  const handleViewChange = (value: string) => {
    // Any additional logic can be added here if needed
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-64 bg-muted rounded"></div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CalendarHeatmap 
            logs={logData}
            viewType={viewType}
            currentDate={date}
          />
        </motion.div>
      )}
    </div>
  );
};

export default CalendarView;
