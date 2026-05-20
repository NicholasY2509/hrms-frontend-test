export const WARNING_LETTER_ENDPOINTS = {
  PORTAL: {
    EMPLOYEE: {
      LIST: "/v1/disciplinary/portal/employee/my-warning-letters",
      DETAIL: (id: string | number) => `/v1/disciplinary/portal/employee/my-warning-letters/${id}`,
    },
    MANAGEMENT: {
      LIST: "/v1/disciplinary/portal/management/warning-letters",
      CREATE: "/v1/disciplinary/portal/management/warning-letters",
      DETAIL: (id: string | number) => `/v1/disciplinary/portal/management/warning-letters/${id}`,
      SETTLE: (id: string | number) => `/v1/disciplinary/portal/management/warning-letters/${id}/settle`,
      EXPORT: (id: string | number) => `/v1/disciplinary/portal/management/warning-letters/${id}/export`,
    },
  },
  CONFIG: {
    LIST: "/v1/disciplinary/configuration/warning-letter-types",
  }
} as const;
