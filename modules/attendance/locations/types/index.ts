export interface WorkLocationModel {
  id: number;
  name: string;
}

export interface AttendanceLocationModel {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
  distance: number;
  work_location_id: number;
  work_location?: WorkLocationModel;
  created_at: string;
  updated_at: string;
}
