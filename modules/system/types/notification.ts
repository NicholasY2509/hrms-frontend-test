export interface NotificationData {
  title?: string;
  message: string;
  icon?: string;
  color?: string;
  action_url?: string;
  [key: string]: any;
}

export interface NotificationModel {
  id: string;
  type: string;
  data: NotificationData;
  read_at: string | null;
  created_at: string;
  created_at_human: string;
}

export interface UnreadCountResponse {
  unread_count: number;
}
