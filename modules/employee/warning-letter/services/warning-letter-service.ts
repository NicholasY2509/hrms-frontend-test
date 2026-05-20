import apiClient from "@/lib/api-client";
import { PaginatedResponse, ApiResponse } from "@/types";
import { WARNING_LETTER_ENDPOINTS } from "../endpoints";
import { WarningLetterModel, WarningLetterType } from "../types";

export const warningLetterService = {
  getList: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<WarningLetterModel>>(
      WARNING_LETTER_ENDPOINTS.PORTAL.MANAGEMENT.LIST,
      { params }
    );
    return response.data;
  },

  getDetail: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<WarningLetterModel>>(
      WARNING_LETTER_ENDPOINTS.PORTAL.MANAGEMENT.DETAIL(id)
    );
    return response.data;
  },

  create: async (data: FormData) => {
    const response = await apiClient.post<ApiResponse<WarningLetterModel>>(
      WARNING_LETTER_ENDPOINTS.PORTAL.MANAGEMENT.CREATE,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  getTypes: async () => {
    const response = await apiClient.get<PaginatedResponse<WarningLetterType>>(
      WARNING_LETTER_ENDPOINTS.CONFIG.LIST
    );
    return response.data;
  },

  settle: async (id: string | number) => {
    const response = await apiClient.post<ApiResponse<WarningLetterModel>>(
      WARNING_LETTER_ENDPOINTS.PORTAL.MANAGEMENT.SETTLE(id)
    );
    return response.data;
  },

  export: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<any>>(
      WARNING_LETTER_ENDPOINTS.PORTAL.MANAGEMENT.EXPORT(id)
    );
    return response.data;
  },

  portal: {
    employee: {
      getList: async (params?: Record<string, any>) => {
        const response = await apiClient.get<PaginatedResponse<WarningLetterModel>>(
          WARNING_LETTER_ENDPOINTS.PORTAL.EMPLOYEE.LIST,
          { params }
        );
        return response.data;
      },
      getDetail: async (id: string | number) => {
        const response = await apiClient.get<ApiResponse<WarningLetterModel>>(
          WARNING_LETTER_ENDPOINTS.PORTAL.EMPLOYEE.DETAIL(id)
        );
        return response.data;
      },
    },
  },
};
