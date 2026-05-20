import apiClient from "@/lib/api-client";
import { PaginatedResponse, ApiResponse } from "@/types";
import { RESIGNATION_ENDPOINTS } from "../endpoints";
import { ResignationModel } from "../types";

export const resignationService = {
  getList: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<ResignationModel>>(
      RESIGNATION_ENDPOINTS.PORTAL.MANAGEMENT.LIST,
      { params }
    );
    return response.data;
  },

  getDetail: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<ResignationModel>>(
      RESIGNATION_ENDPOINTS.PORTAL.MANAGEMENT.DETAIL(id)
    );
    return response.data;
  },

  getMyList: async () => {
    const response = await apiClient.get<PaginatedResponse<ResignationModel>>(
      RESIGNATION_ENDPOINTS.PORTAL.EMPLOYEE.LIST
    );
    return response.data;
  },

  create: async (data: any) => {
    const formData = new FormData();
    formData.append("effective_date", data.effective_date);
    formData.append("reason", data.reason);
    if (data.attachment) {
      formData.append("attachment", data.attachment);
    }

    const response = await apiClient.post<ApiResponse<ResignationModel>>(
      RESIGNATION_ENDPOINTS.PORTAL.EMPLOYEE.CREATE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  settle: async (id: string | number, effectiveDate?: string) => {
    const response = await apiClient.post<ApiResponse<ResignationModel>>(
      RESIGNATION_ENDPOINTS.PORTAL.MANAGEMENT.SETTLE(id),
      { effective_date: effectiveDate }
    );
    return response.data;
  },

  export: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<any>>(
      RESIGNATION_ENDPOINTS.PORTAL.MANAGEMENT.EXPORT(id)
    );
    return response.data;
  },
};
