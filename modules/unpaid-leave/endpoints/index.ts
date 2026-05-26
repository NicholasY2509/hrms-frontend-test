export const UNPAID_LEAVE_ENDPOINTS = {
  PORTAL: {
    EMPLOYEE: {
      LIST: "/v1/unpaidleave/portal/employee/leaves",
      CREATE: "/v1/unpaidleave/portal/employee/leaves",
      DETAIL: (id: string | number) => `/v1/unpaidleave/portal/employee/leaves/${id}`,
    },
    MANAGEMENT: {
      LIST: "/v1/unpaidleave/portal/management/leaves",
      CREATE: "/v1/unpaidleave/portal/management/leaves",
      CALENDAR: "/v1/unpaidleave/portal/management/leaves/calendar",
      DETAIL: (id: string | number) => `/v1/unpaidleave/portal/management/leaves/${id}`,
      TYPES: "/v1/unpaidleave/portal/management/types",
      TYPE_DETAIL: (id: string | number) => `/v1/unpaidleave/portal/management/types/${id}`,
      HOLIDAYS: {
        LIST: "/v1/unpaidleave/portal/management/holidays",
        CREATE: "/v1/unpaidleave/portal/management/holidays",
        DETAIL: (id: string | number) => `/v1/unpaidleave/portal/management/holidays/${id}`,
        UPDATE: (id: string | number) => `/v1/unpaidleave/portal/management/holidays/${id}`,
        DELETE: (id: string | number) => `/v1/unpaidleave/portal/management/holidays/${id}`,
        AUTO_INSERT_SUNDAYS: "/v1/unpaidleave/portal/management/holidays/auto-insert-sundays",
      }
    }
  },
  CONFIG: {
    TYPES: "/v1/unpaidleave/config/types",
  }
} as const;
