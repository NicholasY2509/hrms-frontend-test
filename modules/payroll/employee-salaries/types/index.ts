export interface EmployeeSalary {
  id: number;
  employee_id: number;
  bpjs_base_amount: number;
  actual_base_amount: number;
  effective_date: string;
  reason: string | null;
  created_at?: string;
}

export interface EmployeeSalaryFormValues {
  employee_id: number;
  bpjs_base_amount: number;
  actual_base_amount: number;
  effective_date: string;
  reason: string;
}
