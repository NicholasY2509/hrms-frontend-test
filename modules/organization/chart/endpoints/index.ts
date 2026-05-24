export const CHART_ENDPOINTS = {
  CONFIG: {
    ORG_CHART: "/v1/organization/config/org-chart",
    EMPLOYEES: (positionId: string) => `/v1/organization/config/org-chart/${positionId}/employees`,
  },
} as const
