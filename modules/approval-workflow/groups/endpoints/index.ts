export const APPROVAL_GROUP_ENDPOINTS = {
  LIST: '/v1/approvalworkflow/config/groups',
  CREATE: '/v1/approvalworkflow/config/groups',
  DETAIL: (id: number | string) => `/v1/approvalworkflow/config/groups/${id}`,
  UPDATE: (id: number | string) => `/v1/approvalworkflow/config/groups/${id}`,
  SYNC_USERS: (id: number | string) => `/v1/approvalworkflow/config/groups/${id}/sync-employees`,
  DELETE: (id: number | string) => `/v1/approvalworkflow/config/groups/${id}`,
} as const;
