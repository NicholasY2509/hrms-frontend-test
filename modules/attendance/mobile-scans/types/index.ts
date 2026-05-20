export interface MobileScanModel {
  id: number;
  attendance_id: number;
  employee_id: number;
  employee?: {
    id: number;
    nik: string;
    name: string;
  };
  scan_type: "in" | "out";
  scan_time: string;
  latitude: string;
  longitude: string;
  location: {
    id: number;
    name: string;
  };
  photo: string;
  device_id: string | null;
  created_at: string;
}
