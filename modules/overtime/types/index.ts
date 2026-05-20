import { Employee } from "@/modules/employee/employee/types";

export interface OvertimeType {
  id: number;
  name: string;
  description: string;
  price: string;
}

export interface OvertimeApproval {
  id: number;
  approver_id: number | number[];
  approver_name: string;
  role?: string | null;
  status: string;
  note?: string | null;
  updated_at: string;
}

export interface Overtime {
  id: number;
  employee: Employee
  type: "UMUM" | "DAC" | "NATIONAL";
  overtime_type: OvertimeType | "UMUM" | "DAC" | "NATIONAL" | null;
  overtime_type_id: number | null;
  dac_type?: string | null;
  date: string;
  start_time: string;
  finish_time: string;
  total_time: string;
  note?: string | null;
  attachment_urls: string[];
  status: string;
  document_no?: string;
  estimated_overtime_price?: number;
  real_overtime_price?: number | null;
  settled_at?: string | null;
  approvals?: OvertimeApproval[];
  created_at: string;
}

export interface OvertimeFormValues {
  date: string;
  type: "UMUM" | "DAC" | "NATIONAL";
  overtime_type_id?: number | null;
  start_time: string;
  finish_time: string;
  note?: string;
  estimated_cost?: number;
  attachments?: File[];
}
