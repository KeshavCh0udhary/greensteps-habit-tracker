
// Define custom interfaces for the application
export interface Community {
  id: string;
  name: string;
  description: string;
  icon: string;
  member_count: number;
}

export interface HabitWithLogStatus {
  id: string;
  title: string;
  emoji: string;
  eco_points: number;
  isLogged: boolean;
  logId?: string;
  logNotes?: string | null;
}

export interface LogDataRecord {
  [date: string]: { 
    habits: string[]; 
    total_points: number;
  }
}
