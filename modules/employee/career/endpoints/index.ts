export const CAREER_ENDPOINTS = {
  PORTAL: {
    MANAGEMENT: {
      LIST: "/v1/career/portal/management/careers",
      CREATE: "/v1/career/portal/management/careers",
      DETAIL: (id: string | number) => `/v1/career/portal/management/careers/${id}`,
      SETTLE: (id: string | number) => `/v1/career/portal/management/careers/${id}/settle`,
      EXPORT: (id: string | number) => `/v1/career/portal/management/careers/${id}/export`,
    },
  },
  CONFIG: {
    CAREER_TYPES: {
      LIST: "/v1/career/configuration/career-types",
    },
  },
} as const;
