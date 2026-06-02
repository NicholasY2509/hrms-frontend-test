export interface EmployeeSalary {
  id: number;
  employee_id: number;
  employee?: {
    id: number;
    name: string;
    nik: string;
  };
  bpjs_base_amount: number;
  actual_base_amount: number;
  hourly_rate: number;
  real_hourly_rate: number;
  currency: string;
  calculation_factor: number;
  effective_date: string;
  reason: string | null;
  is_active: boolean;
  created_at?: string;
}

export interface EmployeeSalaryFormValues {
  employee_id: number;
  bpjs_base_amount: number;
  actual_base_amount: number;
  effective_date: string;
  reason: string;
}
