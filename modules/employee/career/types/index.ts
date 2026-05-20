import { ApprovalStep } from "@/modules/approval/types";

export interface CareerEmployee {
  id: number;
  name: string;
  nik: string;
}

export interface CareerType {
  id: number;
  name: string;
}

export interface CareerReference {
  id: number;
  name: string;
}

export interface CareerModel {
  id: number;
  employee_id: number;
  employee: CareerEmployee;
  career_type_id: number;
  career_type: CareerType;

  before_employee_status_id: number | null;
  before_employee_status: CareerReference | null;
  before_work_position_id: number | null;
  before_work_position: CareerReference | null;
  before_department_id: number | null;
  before_department: CareerReference | null;
  before_work_location_id: number | null;
  before_work_location: CareerReference | null;
  before_team_id: number | null;
  before_team: CareerReference | null;
  before_supervisor_id: number | null;

  after_employee_status_id: number | null;
  after_employee_status: CareerReference | null;
  after_work_position_id: number | null;
  after_work_position: CareerReference | null;
  after_department_id: number | null;
  after_department: CareerReference | null;
  after_work_location_id: number | null;
  after_work_location: CareerReference | null;
  after_team_id: number | null;
  after_team: CareerReference | null;
  after_supervisor_id: number | null;

  career_at: string;
  note: string | null;
  confirmed_at: string | null;
  settled_at: string | null;
  status: string | null;
  approvals: ApprovalStep[];
  created_at: string;
  updated_at: string;
}

export interface CareerTransitionRequest {
  employee_id: number;
  career_type_id: number;
  career_at: string;
  note?: string | null;

  before_employee_status_id: number;
  before_work_position_id: number;
  before_department_id: number;
  before_work_location_id: number;
  before_team_id?: number | null;
  before_supervisor_id?: number | null;

  after_employee_status_id: number;
  after_work_position_id: number;
  after_department_id: number;
  after_work_location_id: number;
  after_team_id?: number | null;
  after_supervisor_id?: number | null;
}
