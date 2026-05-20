export const OVERTIME_ENDPOINTS = {
  PORTAL: {
    EMPLOYEE: {
      LIST: "/v1/overtime/portal/employee",
      CREATE: "/v1/overtime/portal/employee",
      DETAIL: (id: string | number) => `/v1/overtime/portal/employee/${id}`,
    },
    MANAGEMENT: {
      LIST: "/v1/overtime/portal/management",
      DETAIL: (id: string | number) => `/v1/overtime/portal/management/${id}`,
      TYPES: "/v1/overtime/portal/management/types",
      TYPE_DETAIL: (id: string | number) => `/v1/overtime/portal/management/types/${id}`,
      SETTLE: (id: string | number) => `/v1/overtime/portal/management/${id}/settle`,
      EXPORT: "/v1/overtime/portal/management/export",
    }
  },
  CONFIG: {
    TYPES: "/v1/overtime/config/types",
  }
} as const;
