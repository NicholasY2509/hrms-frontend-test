export const SUPERVISOR_ENDPOINTS = {
    PORTAL: {
        MANAGEMENT: {
            LIST: '/v1/employee/portal/management/supervisors',
            CREATE: '/v1/employee/portal/management/supervisors',
            UPDATE: (id: string | number) => `/v1/employee/portal/management/supervisors/${id}`,
            DELETE: (id: string | number) => `/v1/employee/portal/management/supervisors/${id}`,
        }
    }
}