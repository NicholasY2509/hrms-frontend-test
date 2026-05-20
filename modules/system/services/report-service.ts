import apiClient from "@/lib/api-client";
import { PaginatedResponse } from "@/types";
import { SYSTEM_ENDPOINTS } from "../endpoints";
import { ReportModel } from "../types/report";

export const reportService = {
  getPaginatedReports: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<ReportModel>>(
      SYSTEM_ENDPOINTS.PORTAL.MANAGEMENT.REPORTS,
      { params }
    );
    return response.data;
  },

  getReportDetail: async (id: number) => {
    const response = await apiClient.get<{ data: ReportModel }>(
      `${SYSTEM_ENDPOINTS.PORTAL.MANAGEMENT.REPORTS}/${id}`
    );
    return response.data;
  },
};
