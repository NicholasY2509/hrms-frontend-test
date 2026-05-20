export const ATTENDANCE_USER_ENDPOINTS = {
  LIST: "/v1/attendance/portal/management/attendance-users",
  DETAIL: (id: string | number) => `/v1/attendance/portal/management/attendance-users/${id}`,
} as const;
