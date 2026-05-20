export const WORK_POSITIONS_ENDPOINTS = {
    LIST: '/v1/organization/portal/management/work-positions',
    CREATE: '/v1/organization/portal/management/work-positions',
    DETAIL: (id: number | string) => `/v1/organization/portal/management/work-positions/${id}`,
    UPDATE: (id: number | string) => `/v1/organization/portal/management/work-positions/${id}`,
    DELETE: (id: number | string) => `/v1/organization/portal/management/work-positions/${id}`,
} as const;