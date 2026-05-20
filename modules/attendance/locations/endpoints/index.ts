export const ATTENDANCE_LOCATION_ENDPOINTS = {
  LIST: "/v1/attendance/portal/management/attendance-locations",
  DETAIL: (id: string | number) => `/v1/attendance/portal/management/attendance-locations/${id}`,
  WORK_LOCATIONS: "/v1/organization/portal/management/work-locations",
} as const;
