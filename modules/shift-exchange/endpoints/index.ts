export const SHIFT_EXCHANGE_ENDPOINTS = {
  PORTAL: {
    EMPLOYEE: {
      LIST: "/v1/shiftexchange/v1/portal/employee/shift-exchanges",
      DETAIL: (id: string | number) =>
        `/v1/shiftexchange/v1/portal/employee/shift-exchanges/${id}`,
      CREATE: "/v1/shiftexchange/v1/portal/employee/shift-exchanges",
      WORKING_HOUR:
        "/v1/shiftexchange/v1/portal/employee/shift-exchanges/working-hour",
    },
  },
} as const
