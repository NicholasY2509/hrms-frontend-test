export const APPROVAL_SCHEME_ENDPOINTS = {
  LIST: '/v1/approvalworkflow/config/schemes',
  CREATE: '/v1/approvalworkflow/config/schemes',
  DETAIL: (id: number | string) => `/v1/approvalworkflow/config/schemes/${id}`,
  UPDATE: (id: number | string) => `/v1/approvalworkflow/config/schemes/${id}`,
  DELETE: (id: number | string) => `/v1/approvalworkflow/config/schemes/${id}`,
} as const;
