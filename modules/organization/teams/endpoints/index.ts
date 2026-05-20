export const TEAMS_ENDPOINTS = {
    LIST: '/v1/organization/portal/management/teams',
    CREATE: '/v1/organization/portal/management/teams',
    DETAIL: (id: number | string) => `/v1/organization/portal/management/teams/${id}`,
    UPDATE: (id: number | string) => `/v1/organization/portal/management/teams/${id}`,
    DELETE: (id: number | string) => `/v1/organization/portal/management/teams/${id}`,
} as const;