import { Employee } from "@/modules/employee/employee/types";

export interface AnnualLeave {
  id: number;
  employee_id: number;
  employee: Employee
  annual_leave_at: string;
  total: number;
  status: string;
  description: string;
  deduction_details: DeductionDetail[];
  balance_before: Record<string, number> | null;
  balance_after: Record<string, number> | null;
  created_at: string;
  updated_at: string;
}

export interface DeductionDetail {
  year: number;
  amount: number;
}
