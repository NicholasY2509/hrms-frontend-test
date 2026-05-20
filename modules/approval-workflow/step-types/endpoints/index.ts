export const APPROVAL_STEP_TYPE_ENDPOINTS = {
  LIST: '/v1/approvalworkflow/config/step-types',
  CREATE: '/v1/approvalworkflow/config/step-types',
  UPDATE: (id: number | string) => `/v1/approvalworkflow/config/step-types/${id}`,
  DELETE: (id: number | string) => `/v1/approvalworkflow/config/step-types/${id}`,
} as const;
