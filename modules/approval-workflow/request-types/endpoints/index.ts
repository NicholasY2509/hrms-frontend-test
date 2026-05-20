export const APPROVAL_REQUEST_TYPE_ENDPOINTS = {
  LIST: '/v1/approvalworkflow/config/request-types',
  CREATE: '/v1/approvalworkflow/config/request-types',
  UPDATE: (id: number | string) => `/v1/approvalworkflow/config/request-types/${id}`,
  DELETE: (id: number | string) => `/v1/approvalworkflow/config/request-types/${id}`,
} as const;
