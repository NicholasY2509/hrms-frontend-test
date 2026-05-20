export const APPROVAL_RULE_ENDPOINTS = {
  CREATE: '/v1/approvalworkflow/config/rules',
  UPDATE: (id: number | string) => `/v1/approvalworkflow/config/rules/${id}`,
  DELETE: (id: number | string) => `/v1/approvalworkflow/config/rules/${id}`,
} as const;
