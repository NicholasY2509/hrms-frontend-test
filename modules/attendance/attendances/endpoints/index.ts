export const ATTENDANCE_RECORD_ENDPOINTS = {
  LIST: "/v1/attendance/portal/management/attendances",
  CALCULATE: "/v1/attendance/portal/management/attendances/calculate",
  EXPORT: "/v1/attendance/portal/management/attendances/export",
  PORTAL: {
    EMPLOYEE: {
      HISTORY: "/v1/attendance/portal/employee",
    },

    MANAGEMENT: {
      EMPLOYEE_STATUS: (employeeId: number) =>
        `/v1/attendance/portal/management/attendances/employee/${employeeId}/status`,
      UPDATE_STATUS: (id: number) =>
        `/v1/attendance/portal/management/attendances/${id}/status`,
      BATCH_UPDATE_STATUS: "/v1/attendance/portal/management/attendances/status/batch",
    },
  },
} as const
