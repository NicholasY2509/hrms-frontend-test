import { ApprovalStep } from "@/modules/approval/types";

export interface ResignationEmployee {
  id: number;
  name: string;
  nik: string;
}

export interface ResignationModel {
  id: number;
  employee_id: number;
  employee: ResignationEmployee;
  effective_date: string;
  reason: string;
  attachment: string | null;
  attachment_url: string | null;
  confirmed_at: string | null;
  settled_at: string | null;
  status: string | null;
  approvals: ApprovalStep[];
  created_at: string;
  updated_at: string;
}
