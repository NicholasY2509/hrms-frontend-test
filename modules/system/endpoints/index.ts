export const SYSTEM_ENDPOINTS = {
  PORTAL: {
    EMPLOYEE: {
      DASHBOARD: "/v1/system/portal/employee/dashboard",
      NOTIFICATIONS: {
        LIST: "/v1/notifications/portal/employee",
        UNREAD_COUNT: "/v1/notifications/portal/employee/unread-count",
        MARK_READ: (id: string) => `/v1/notifications/portal/employee/${id}/read`,
        MARK_ALL_READ: "/v1/notifications/portal/employee/mark-all-read",
      },
    },
    MANAGEMENT: {
      DASHBOARD: "/v1/system/portal/management/dashboard",
      REPORTS: "/v1/system/reports",
    },
  },
  CONFIG: {
    PASSPORT_CLIENTS: "/v1/system/configuration/passport-clients",
    PASSPORT_ROLES: "/v1/system/configuration/passport-roles",
    GLOBAL_PASSPORT_ROLES: "/v1/system/configuration/global-passport-roles",
  }
} as const;
