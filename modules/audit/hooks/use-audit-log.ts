import { useQuery } from "@tanstack/react-query";
import { AUDIT_ENDPOINTS } from "../endpoints";
import { auditService } from "../services/audit-service";
import { AuditLogFilters } from "../types";

export function useAuditLogList(params?: AuditLogFilters) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [AUDIT_ENDPOINTS.CONFIG.LOGS, params],
    queryFn: () => auditService.getLogs(params),
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}
