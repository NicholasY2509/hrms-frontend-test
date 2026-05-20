export interface ReportModel {
  id: number;
  user_id: number;
  name: string;
  type: string;
  format: 'excel' | 'pdf' | 'csv' | 'txt';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  current_message: string | null;
  file_path: string | null;
  download_url?: string | null;
  filters: Record<string, any>;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    email: string;
    last_logged_in_at: string | null;
  };
}
