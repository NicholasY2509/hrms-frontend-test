export const EMPLOYEE_ENDPOINTS = {
  SEARCH: '/v1/employee/portal/management/search',
  PORTAL: {
    MANAGEMENT: {
      LIST: '/v1/employee/portal/management/employees',
      CREATE: '/v1/employee/portal/management/employees',
      GENERATE_NIK: '/v1/employee/portal/management/employees/generate-nik',
      DETAIL: (id: string | number) => `/v1/employee/portal/management/employees/${id}`,
      DETAILS: (id: string | number, type: string) => `/v1/employee/portal/management/employees/${id}/details/${type}`,
    },
  },
  CONFIG: {
    EMPLOYEE_STATUSES: {
      LIST: '/v1/employee/portal/configuration/employee-statuses',
    },
    DRIVER_LICENSE_TYPES: {
      LIST: '/v1/employee/portal/configuration/driver-license-types',
    },
  },
} as const;
