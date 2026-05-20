export interface ApprovalStepType {
  id: number;
  slug: string;
  name: string;
  needs_target: boolean;
  description: string | null;
  created_at: string;
}
