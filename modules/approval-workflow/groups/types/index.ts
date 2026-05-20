import { Employee } from '@/modules/employee/employee/types';

export interface ApprovalGroup {
  id: number;
  name: string;
  description: string | null;
  members_count: number;
  employees?: Employee[];
  created_at: string;
}
