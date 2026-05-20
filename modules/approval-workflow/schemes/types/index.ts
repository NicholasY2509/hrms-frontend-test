import { ApprovalRule } from '../../rules/types';

export interface ApprovalScheme {
  id: number;
  name: string;
  model_class: string;
  description: string | null;
  is_active: boolean;
  rules_count?: number;
  position_rules_count?: number;
  department_rules_count?: number;
  rules?: ApprovalRule[];
  created_at: string;
}
