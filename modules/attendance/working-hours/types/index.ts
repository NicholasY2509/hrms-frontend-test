import { Employee } from "@/modules/employee/employee/types";
import { AttendanceModel } from "../../attendances/types";

export interface WorkingHourModel {
  id: number;
  date: string;
  shift_start: string;
  shift_end: string;
  employee: Employee;
  working_hour: {
    id: number;
    name: string;
    clock_in: string;
    clock_out: string;
  };
  attendance: AttendanceModel | null;
  working_hour_id: number;
  employee_id: number;
}

export interface MasterWorkingHourModel {
  id: number;
  name: string;
  clock_in: string;
  clock_out: string;
  created_at: string;
  updated_at: string;
}
