export const POSITION_HIERARCHY_MATRIX_ENDPOINTS = {
  LIST: '/v1/organization/config/position-hierarchy-matrices',
  CREATE: '/v1/organization/config/position-hierarchy-matrices',
  UPDATE: (id: string | number) => `/v1/organization/config/position-hierarchy-matrices/${id}`,
  DELETE: (id: string | number) => `/v1/organization/config/position-hierarchy-matrices/${id}`,
} as const;
