export const APPROVAL_ACTION_ENDPOINTS = {
  PENDING: '/v1/approvalworkflow/portal/management/actions/pending',
  UPCOMING: '/v1/approvalworkflow/portal/management/actions/upcoming',
  ONGOING: '/v1/approvalworkflow/portal/management/actions/ongoing',
  HISTORY: '/v1/approvalworkflow/portal/management/actions/history',
  APPROVE: (id: number | string) => `/v1/approvalworkflow/portal/management/actions/${id}/approve`,
  REJECT: (id: number | string) => `/v1/approvalworkflow/portal/management/actions/${id}/reject`,
} as const;

