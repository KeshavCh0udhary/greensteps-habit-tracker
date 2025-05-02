
// LogData types for calendar visualization
export type LogDataRecord = Record<string, { habits: string[], total_points: number }>;

// Habit types for dashboard
export interface HabitWithLogStatus {
  id: string;
  title: string;
  emoji: string;
  eco_points: number;
  isLogged: boolean;
  logId?: string;
  logNotes?: string | null;
}

// Community types
export interface Community {
  id: string;
  name: string;
  description: string;
  icon: string;
  member_count: number;
  isJoined?: boolean;
}
