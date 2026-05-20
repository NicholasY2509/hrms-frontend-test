import apiClient from "@/lib/api-client";
import { SalaryComponent } from "../types";
import { SalaryComponentFormValues } from "../schemas";
import { ApiResponse, PaginatedResponse } from "@/types";
import { SALARY_COMPONENT_ENDPOINTS } from "../endpoints";

export const salaryComponentService = {
  getList: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<SalaryComponent>>(
      SALARY_COMPONENT_ENDPOINTS.LIST,
      { params }
    );
    return response.data;
  },

  create: async (data: SalaryComponentFormValues) => {
    const response = await apiClient.post<ApiResponse<SalaryComponent>>(
      SALARY_COMPONENT_ENDPOINTS.CREATE,
      data
    );
    return response.data;
  },

  update: async (id: number, data: SalaryComponentFormValues) => {
    const response = await apiClient.put<ApiResponse<SalaryComponent>>(
      SALARY_COMPONENT_ENDPOINTS.UPDATE(id),
      data
    );
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(SALARY_COMPONENT_ENDPOINTS.DELETE(id));
    return response.data;
  },
};
