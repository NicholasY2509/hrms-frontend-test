import apiClient from "@/lib/api-client";
import { SYSTEM_ENDPOINTS } from "../endpoints";
import { DashboardData, EmployeeDashboardData } from "../types/dashboard";
import { ApiResponse } from "@/types";

export const dashboardService = {
  getManagementDashboard: async () => {
    const response = await apiClient.get<ApiResponse<DashboardData>>(
      SYSTEM_ENDPOINTS.PORTAL.MANAGEMENT.DASHBOARD
    );
    return response.data;
  },

  getEmployeeDashboard: async () => {
    const response = await apiClient.get<ApiResponse<EmployeeDashboardData>>(
      SYSTEM_ENDPOINTS.PORTAL.EMPLOYEE.DASHBOARD
    );
    return response.data;
  },
};
