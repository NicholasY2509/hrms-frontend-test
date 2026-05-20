import { WorkPosition } from '@/modules/organization/work-position/types';
import { WorkLocation } from '@/modules/organization/work-location/types';

export interface ApprovalPolicyStep {
  id?: number;
  type_slug: string;
  sequence: number;
  target_id: number | null;
  target_name?: string;
}

export interface ApprovalPolicy {
  id: number;
  name: string;
  approvable_type: string;
  approvable_type_name?: string;
  work_position_id: number | null;
  work_position?: WorkPosition;
  work_location_id: number | null;
  work_location?: WorkLocation;
  is_default: boolean;
  is_active: boolean;
  steps?: ApprovalPolicyStep[];
  created_at: string;
}
