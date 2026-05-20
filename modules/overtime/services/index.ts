
import { ApiResponse, PaginatedResponse } from "@/types";
import { OVERTIME_ENDPOINTS } from "../endpoints";
import { Overtime, OvertimeType } from "../types";
import apiClient from "@/lib/api-client";
import { OvertimeTypeFormValues } from "../schemas/type";

export const overtimeService = {
  portal: {
    employee: {
      getList: async (params?: Record<string, any>) => {
        const response = await apiClient.get<PaginatedResponse<Overtime>>(
          OVERTIME_ENDPOINTS.PORTAL.EMPLOYEE.LIST,
          { params }
        );
        return response.data;
      },
      getDetail: async (id: string | number) => {
        const response = await apiClient.get<ApiResponse<Overtime>>(
          OVERTIME_ENDPOINTS.PORTAL.EMPLOYEE.DETAIL(id)
        );
        return response.data;
      },
      create: async (data: any) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (key === "attachments" && Array.isArray(value)) {
            value.forEach((file) => formData.append("attachments[]", file));
          } else if (value !== null && value !== undefined) {
            if (value instanceof File || value instanceof Blob) {
              formData.append(key, value);
            } else {
              formData.append(key, String(value));
            }
          }
        });

        const response = await apiClient.post<ApiResponse<Overtime>>(
          OVERTIME_ENDPOINTS.PORTAL.EMPLOYEE.CREATE,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data;
      },
    },
    management: {
      getList: async (params?: Record<string, any>) => {
        const response = await apiClient.get<PaginatedResponse<Overtime>>(
          OVERTIME_ENDPOINTS.PORTAL.MANAGEMENT.LIST,
          { params }
        );
        return response.data;
      },
      getDetail: async (id: string | number) => {
        const response = await apiClient.get<ApiResponse<Overtime>>(
          OVERTIME_ENDPOINTS.PORTAL.MANAGEMENT.DETAIL(id)
        );
        return response.data;
      },
      update: async (id: string | number, data: { overtime_type_id: number | string }) => {
        const response = await apiClient.patch<ApiResponse<Overtime>>(
          OVERTIME_ENDPOINTS.PORTAL.MANAGEMENT.DETAIL(id),
          data
        );
        return response.data;
      },
      settle: async (id: string | number, data: { real_overtime_price: number | string }) => {
        const response = await apiClient.post<ApiResponse<Overtime>>(
          OVERTIME_ENDPOINTS.PORTAL.MANAGEMENT.SETTLE(id),
          data
        );
        return response.data;
      },
      getTypes: async () => {
        const response = await apiClient.get<ApiResponse<OvertimeType[]>>(
          OVERTIME_ENDPOINTS.PORTAL.MANAGEMENT.TYPES
        );
        return response.data;
      },
      createType: async (values: OvertimeTypeFormValues) => {
        const response = await apiClient.post<ApiResponse<OvertimeType>>(
          OVERTIME_ENDPOINTS.PORTAL.MANAGEMENT.TYPES,
          values
        );
        return response.data;
      },
      updateType: async (id: string | number, values: OvertimeTypeFormValues) => {
        const response = await apiClient.patch<ApiResponse<OvertimeType>>(
          OVERTIME_ENDPOINTS.PORTAL.MANAGEMENT.TYPE_DETAIL(id),
          values
        );
        return response.data;
      },
      deleteType: async (id: string | number) => {
        const response = await apiClient.delete(
          OVERTIME_ENDPOINTS.PORTAL.MANAGEMENT.TYPE_DETAIL(id)
        );
        return response.data;
      },
      export: async (params?: Record<string, any>) => {
        const response = await apiClient.get<ApiResponse<any>>(
          OVERTIME_ENDPOINTS.PORTAL.MANAGEMENT.EXPORT,
          { params }
        );
        return response.data;
      },
    },
  },
  config: {
    getTypes: async () => {
      const response = await apiClient.get<ApiResponse<OvertimeType[]>>(
        OVERTIME_ENDPOINTS.CONFIG.TYPES
      );
      return response.data;
    },
  },
};
