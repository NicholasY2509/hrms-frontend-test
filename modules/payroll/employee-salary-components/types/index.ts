import { SalaryComponent } from "../../salary-components/types";

export interface EmployeeSalaryComponent {
  id: number;
  employee_id: number;
  salary_component_id: number;
  amount: number;
  effective_date: string;
  is_calculated: boolean;
  salary_component?: SalaryComponent;
}

export interface EmployeeSalaryComponentFormValues {
  employee_id: number;
  salary_component_id: number;
  amount: number;
  effective_date: string;
  is_calculated: boolean;
}
