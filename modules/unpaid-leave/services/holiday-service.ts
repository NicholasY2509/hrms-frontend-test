import { ApiResponse, PaginatedResponse } from "@/types";
import { UNPAID_LEAVE_ENDPOINTS } from "../endpoints";
import { Holiday } from "../types";
import apiClient from "@/lib/api-client";

export const holidayService = {
  getList: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<Holiday>>(
      UNPAID_LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.HOLIDAYS.LIST,
      { params }
    );
    return response.data;
  },

  getDetail: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<Holiday>>(
      UNPAID_LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.HOLIDAYS.DETAIL(id)
    );
    return response.data;
  },

  create: async (data: { name: string; date: string }) => {
    const response = await apiClient.post<ApiResponse<Holiday>>(
      UNPAID_LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.HOLIDAYS.CREATE,
      data
    );
    return response.data;
  },

  update: async (id: string | number, data: { name: string; date: string }) => {
    const response = await apiClient.put<ApiResponse<Holiday>>(
      UNPAID_LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.HOLIDAYS.UPDATE(id),
      data
    );
    return response.data;
  },

  delete: async (id: string | number) => {
    const response = await apiClient.delete<ApiResponse<any>>(
      UNPAID_LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.HOLIDAYS.DELETE(id)
    );
    return response.data;
  },

  autoInsertSundays: async (data: { start_date: string; end_date: string }) => {
    const response = await apiClient.post<ApiResponse<{ inserted_count: number }>>(
      UNPAID_LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.HOLIDAYS.AUTO_INSERT_SUNDAYS,
      data
    );
    return response.data;
  },
};
