export interface TaskLog {
  id: number;
  type: string;
  status: string;
  progress: number;
  message: string;
  payload: Record<string, any>;
  metadata: Record<string, any> | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface TaskLogFilters {
  start_date?: string;
  end_date?: string;
  page?: number;
  per_page?: number;
  search?: string;
  status?: "pending" | "processing" | "completed" | "failed" | string;
  type?: string;
}
