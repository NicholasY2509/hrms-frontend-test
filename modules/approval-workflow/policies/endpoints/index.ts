export const APPROVAL_POLICY_ENDPOINTS = {
  LIST: '/v1/approvalworkflow/policies',
  CREATE: '/v1/approvalworkflow/policies',
  DETAIL: (id: number | string) => `/v1/approvalworkflow/policies/${id}`,
  UPDATE_STEPS: (id: number | string) => `/v1/approvalworkflow/policies/${id}/steps`,
  DELETE: (id: number | string) => `/v1/approvalworkflow/policies/${id}`,
} as const;
