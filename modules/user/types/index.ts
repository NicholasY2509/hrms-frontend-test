import { Employee } from "@/modules/employee/employee/types";

export interface UserModel {
  id: number;
  email: string;
  employee_id?: number | null;
  is_linked_to_employee?: boolean;
  employee: Employee | null;
  created_at: string;
  updated_at: string;
}
