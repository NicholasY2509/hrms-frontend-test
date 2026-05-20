export const EMPLOYEE_SALARY_ENDPOINTS = {
  PORTAL: {
    EMPLOYEE: {
      MY_SALARY: '/v1/payroll/portal/employee/my-salary'
    }
  },
  HISTORY: '/v1/payroll/portal/management/employee-salaries',
  STORE: '/v1/payroll/portal/management/employee-salaries',
} as const;
