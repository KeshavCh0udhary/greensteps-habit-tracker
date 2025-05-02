
import { LogDataRecord } from "@/types/interfaces";

export interface CalendarViewProps {
  viewType: "week" | "month" | "year";
  date: Date;
  onDateChange: (date: Date) => void;
  logData: LogDataRecord;
  isLoading: boolean;
}
