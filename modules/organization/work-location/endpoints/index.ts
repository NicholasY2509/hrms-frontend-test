export const WORK_LOCATION_ENDPOINTS = {
    LIST: '/v1/organization/portal/management/work-locations',
    CREATE: '/v1/organization/portal/management/work-locations',
    DETAIL: (id: number | string) => `/v1/organization/portal/management/work-locations/${id}`,
    UPDATE: (id: number | string) => `/v1/organization/portal/management/work-locations/${id}`,
    DELETE: (id: number | string) => `/v1/organization/portal/management/work-locations/${id}`,
} as const;