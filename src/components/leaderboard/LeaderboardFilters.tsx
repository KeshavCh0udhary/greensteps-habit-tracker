
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TimePeriod = "all" | "month" | "week";

interface LeaderboardFiltersProps {
  selectedPeriod: TimePeriod;
  onFilterChange: (period: TimePeriod) => void;
}

const LeaderboardFilters: React.FC<LeaderboardFiltersProps> = ({ 
  selectedPeriod, 
  onFilterChange 
}) => {
  return (
    <Tabs value={selectedPeriod} onValueChange={(value) => onFilterChange(value as TimePeriod)}>
      <TabsList>
        <TabsTrigger value="all">All Time</TabsTrigger>
        <TabsTrigger value="month">This Month</TabsTrigger>
        <TabsTrigger value="week">This Week</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default LeaderboardFilters;
