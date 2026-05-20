export const USER_ENDPOINTS = {
  PORTAL: {
    MANAGEMENT: {
      LIST: "/v1/user/portal/management/users",
      CREATE: "/v1/user/portal/management/users",
      UPDATE: (id: number | string) => `/v1/user/portal/management/users/${id}`,
      DELETE: (id: number | string) => `/v1/user/portal/management/users/${id}`,
    },
  },
} as const;
