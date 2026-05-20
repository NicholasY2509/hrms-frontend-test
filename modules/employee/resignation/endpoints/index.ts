export const RESIGNATION_ENDPOINTS = {
  PORTAL: {
    EMPLOYEE: {
      CREATE: "/v1/employee/portal/employee/resignations",
      LIST: "/v1/employee/portal/employee/resignations",
    },
    MANAGEMENT: {
      LIST: "/v1/employee/portal/management/resignations",
      DETAIL: (id: string | number) => `/v1/employee/portal/management/resignations/${id}`,
      SETTLE: (id: string | number) => `/v1/employee/portal/management/resignations/${id}/settle`,
      EXPORT: (id: string | number) => `/v1/employee/portal/management/resignations/${id}/export`,
    },
  },
} as const;
