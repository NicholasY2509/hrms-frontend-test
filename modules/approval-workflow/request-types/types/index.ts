export interface ApprovalRequestType {
  id: number;
  name: string;
  slug: string;
  model_class: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}
