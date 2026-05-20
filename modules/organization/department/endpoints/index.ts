export const DEPARTMENT_ENDPOINTS = {
    LIST: '/v1/organization/portal/management/departments',
    CREATE: '/v1/organization/portal/management/departments',
    DETAIL: (id: number | string) => `/v1/organization/portal/management/departments/${id}`,
    UPDATE: (id: number | string) => `/v1/organization/portal/management/departments/${id}`,
    DELETE: (id: number | string) => `/v1/organization/portal/management/departments/${id}`,
} as const;