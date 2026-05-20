import { WorkPosition } from '@/modules/organization/work-position/types';
import { WorkLocation } from '@/modules/organization/work-location/types';
import { Department } from '@/modules/organization/department/types';

export interface ApprovalRuleStep {
  id?: number;
  type_slug: string;
  sequence: number;
  target_id: number | null;
  target_name?: string;
}

export interface ApprovalRule {
  id: number;
  approval_scheme_id: number;
  work_position_id: number | null;
  work_position?: WorkPosition;
  department_id: number | null;
  department?: Department;
  work_location_id: number | null;
  work_location?: WorkLocation;
  is_active: boolean;
  is_default: boolean;
  steps?: ApprovalRuleStep[];
  created_at: string;
}
