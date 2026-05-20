import { ApprovalStep } from "@/modules/approval/types";

export interface WarningLetterEmployee {
  id: number;
  name: string;
  nik: string;
}

export interface WarningLetterType {
  id: number;
  name: string;
}

export interface WarningLetterModel {
  id: number;
  document_no: string;
  name: string | null;
  employee_id: number;
  employee: WarningLetterEmployee;
  warning_letter_type_id: number;
  warning_letter_type: WarningLetterType;
  warning_at: string;
  start_date: string;
  end_date: string;
  note: string | null;
  attachment: string | null;
  attachment_url: string | null;
  confirmed_at: string | null;
  settled_at: string | null;
  status: string | null;
  approvals: ApprovalStep[];
  created_at: string;
  updated_at: string;
}
