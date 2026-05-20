import apiClient from "@/lib/api-client";
import { ApiResponse, PaginatedResponse } from "@/types";
import { CAREER_ENDPOINTS } from "../endpoints";
import { CareerModel, CareerType } from "../types";

export const careerService = {
  getCareers: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<CareerModel>>(
      CAREER_ENDPOINTS.PORTAL.MANAGEMENT.LIST,
      { params }
    );
    return response.data;
  },

  createCareer: async (data: any) => {
    const response = await apiClient.post<ApiResponse<CareerModel>>(
      CAREER_ENDPOINTS.PORTAL.MANAGEMENT.CREATE,
      data
    );
    return response.data;
  },

  getCareerTypes: async () => {
    const response = await apiClient.get<ApiResponse<CareerType[]>>(
      CAREER_ENDPOINTS.CONFIG.CAREER_TYPES.LIST
    );
    return response.data;
  },

  getCareerDetail: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<CareerModel>>(
      CAREER_ENDPOINTS.PORTAL.MANAGEMENT.DETAIL(id)
    );
    return response.data;
  },

  settleCareer: async (id: string | number) => {
    const response = await apiClient.post<ApiResponse<CareerModel>>(
      CAREER_ENDPOINTS.PORTAL.MANAGEMENT.SETTLE(id)
    );
    return response.data;
  },

  exportCareer: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<any>>(
      CAREER_ENDPOINTS.PORTAL.MANAGEMENT.EXPORT(id)
    );
    return response.data;
  },
};
