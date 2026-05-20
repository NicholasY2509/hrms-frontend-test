export interface AuditLog {
  id: number;
  log_name: string;
  description: string;
  subject_type: string;
  subject_id: number;
  event: string;
  causer: AuditLogCauser | null;
  properties: any[];
  attribute_changes: AuditLogAttributeChanges | null;
  created_at: string;
  human_time: string;
}

export interface AuditLogCauser {
  id: number;
  name: string;
  type: string;
}

export interface AuditLogAttributeChanges {
  old: Record<string, any>;
  attributes: Record<string, any>;
}

export interface AuditLogFilters {
  causer_id?: number | string;
  start_date?: string;
  end_date?: string;
  event?: string;
  log_name?: string;
  per_page?: number;
  subject_type?: string;
  page?: number;
}
