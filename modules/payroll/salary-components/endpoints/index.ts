export const SALARY_COMPONENT_ENDPOINTS = {
  LIST: '/v1/payroll/configuration/salary-components',
  CREATE: '/v1/payroll/configuration/salary-components',
  UPDATE: (id: string | number) => `/v1/payroll/configuration/salary-components/${id}`,
  DELETE: (id: string | number) => `/v1/payroll/configuration/salary-components/${id}`,
} as const;
