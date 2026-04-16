export interface LogEvent {
  type: string;
  duration: number;
  distance: number;
  desc: string;
}

export interface DailyLog {
  day: number;
  events: LogEvent[];
  total_miles: number;
  total_driving: number;
  total_on_duty: number;
}

export interface TripData {
  summary: {
    total_distance_miles: number;
    total_driving_hours: number;
    estimated_days: number;
  };
  route: {
    to_pickup: any;
    to_dropoff: any;
  };
  daily_logs: DailyLog[];
}

export interface TripFormData {
  current_location: string;
  pickup_location: string;
  dropoff_location: string;
  cycle_used: string;
}
