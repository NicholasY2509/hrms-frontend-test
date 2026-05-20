import { PaginatedResponse } from "@/types";

export interface SummaryCounts {
  pending: number;
  upcoming: number;
  ongoing: number;
  history: number;
}

export interface ApprovalActionResponse<T> extends PaginatedResponse<T> {
  summary_counts: SummaryCounts;
}

export interface ApprovalRequest {
  id: number;
  reference_number: string | null;
  approvable_request_step_id: number | null;
  category: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  user_step_status: 'pending' | 'approved' | 'rejected' | null;
  current_step_sequence: number;
  approvable_type: string;
  approvable_id: string | number;
  metadata?: any;
  created_at: string;
  updated_at: string;
  // Included relations
  approvable?: any;
  steps?: any[];
}

