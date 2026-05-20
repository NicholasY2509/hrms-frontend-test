export interface AttendanceSetting {
  id: number;
  key: string;
  value: string;
  type: 'integer' | 'string';
  group: 'attendance' | 'calculation';
  description: string;
  created_at: string | null;
  updated_at: string | null;
}

export type AttendanceSettingsResponse = AttendanceSetting[];
