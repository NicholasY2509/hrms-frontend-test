export const EMPLOYEE_SALARY_COMPONENT_ENDPOINTS = {
  LIST: '/v1/payroll/portal/management/employee-salary-components',
  ASSIGN: '/v1/payroll/portal/management/employee-salary-components',
  REMOVE: (id: string | number) => `/v1/payroll/portal/management/employee-salary-components/${id}`,
} as const;
