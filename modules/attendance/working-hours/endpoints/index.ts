export const ATTENDANCE_WORKING_HOUR_ENDPOINTS = {
  LIST: "/v1/attendance/portal/management/attendance-working-hours",
  DETAIL: (id: string | number) => `/v1/attendance/portal/management/attendance-working-hours/${id}`,
  MASTER: "/v1/attendance/portal/management/working-hours",
  MASTER_DETAIL: (id: string | number) => `/v1/attendance/portal/management/working-hours/${id}`,
  IMPORT: "/v1/attendance/portal/management/attendance-working-hours/import",
} as const;
