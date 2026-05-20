export interface AttendanceEmployee {
  id: number;
  name: string;
  nik: string;
}

export interface WorkingHour {
  id: number;
  name: string;
  clock_in: string;
  clock_out: string;
}

export interface ScanDetail {
  time: string;
  is_mobile: boolean;
  machine_id: number | null;
  location_id?: number | null;
  machine_name: string | null;
  location_name: string | null;
}

export interface MobileScanDetail {
  time: string;
  type: "in" | "out";
  photo: string | null;
  latitude: string | null;
  longitude: string | null;
  location_id: number | null;
}

export interface AttendanceModel {
  id: number;
  employee_id: number;
  employee: AttendanceEmployee;
  attendance_at: string;
  working_hour: WorkingHour;
  check_in: string | null;
  check_out: string | null;
  attendance_status_id: number;
  status: string;
  incoming_photo: string | null;
  outgoing_photo: string | null;
  incoming_location: { id: number; name: string } | null;
  outgoing_location: { id: number; name: string } | null;
  all_scans: ScanDetail[] | null;
  mobile_scans: MobileScanDetail[] | null;
  created_at: string;
  updated_at: string;
}

export interface EmployeeAttendanceRecord {
  id: number;
  attendance_at: string;
  check_in: string | null;
  check_out: string | null;
  shift_start: string | null;
  shift_end: string | null;
  status: string;
  is_clocked_in: boolean;
  is_locked: boolean;
  lock_title: string | null;
  lock_message: string | null;
  mobile_scans: MobileScanDetail[] | null;
  all_scans: ScanDetail[] | null;
  incoming_photo: string | null;
  outgoing_photo: string | null;
}

export interface EmployeeAttendanceSummaryItem {
  name: string;
  count: number;
  percentage: number;
}

export interface EmployeeAttendanceHistoryData {
  records: EmployeeAttendanceRecord[];
  summary: EmployeeAttendanceSummaryItem[];
}
