export const EMPLOYEE_SALARY_ENDPOINTS = {
  PORTAL: {
    EMPLOYEE: {
      MY_SALARY: '/v1/payroll/portal/employee/my-salary'
    }
  },
  LIST: '/v1/payroll/portal/management/employee-salaries',
  HISTORY: '/v1/payroll/portal/management/employee-salaries/history',
  STORE: '/v1/payroll/portal/management/employee-salaries',
} as const;
