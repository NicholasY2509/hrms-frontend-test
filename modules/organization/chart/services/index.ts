import apiClient from "@/lib/api-client";
import { CHART_ENDPOINTS } from "../endpoints";
import { OrgChartData } from "../types";
import { ApiResponse } from "@/types";

export const chartService = {
  getOrgChart: async () => {
    const response = await apiClient.get<ApiResponse<OrgChartData>>(CHART_ENDPOINTS.CONFIG.ORG_CHART);
    return response.data;
  },

  getEmployeesByPosition: async (positionId: string) => {
    const response = await apiClient.get(
      CHART_ENDPOINTS.CONFIG.EMPLOYEES(positionId)
    );
    return response.data;
  }
};
