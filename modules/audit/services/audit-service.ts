
import { PaginatedResponse } from "@/types";
import { AUDIT_ENDPOINTS } from "../endpoints";
import { AuditLog, AuditLogFilters } from "../types";
import apiClient from "@/lib/api-client";

export const auditService = {
  getLogs: async (params?: AuditLogFilters) => {
    const response = await apiClient.get<PaginatedResponse<AuditLog>>(
      AUDIT_ENDPOINTS.CONFIG.LOGS,
      { params }
    );
    return response.data;
  },
};
