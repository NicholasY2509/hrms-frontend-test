import { ApprovalStep } from "@/modules/approval/types";

export interface CertificateEmployee {
  id: number;
  name: string;
  nik: string;
}

export interface CertificateWorkPosition {
  id: number;
  name: string;
}

export interface CertificateOfEmploymentModel {
  id: string;
  document_no: string;
  employee_id: number;
  employee: CertificateEmployee;
  work_position_id: number;
  work_position: CertificateWorkPosition;
  request_date: string;
  issued_date: string | null;
  note: string | null;
  attachment: string | null;
  attachment_url: string | null;
  settled_at: string | null;
  status: string | null;
  approvals: ApprovalStep[];
  created_at: string;
  updated_at: string;
}
