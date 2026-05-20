import apiClient from "@/lib/api-client";
import { PaginatedResponse, ApiResponse } from "@/types";
import { CERTIFICATE_OF_EMPLOYMENT_ENDPOINTS } from "../endpoints";
import { CertificateOfEmploymentModel } from "../types";

export const certificateOfEmploymentService = {
  getList: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<CertificateOfEmploymentModel>>(
      CERTIFICATE_OF_EMPLOYMENT_ENDPOINTS.PORTAL.MANAGEMENT.LIST,
      { params }
    );
    return response.data;
  },

  getDetail: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<CertificateOfEmploymentModel>>(
      CERTIFICATE_OF_EMPLOYMENT_ENDPOINTS.PORTAL.MANAGEMENT.DETAIL(id)
    );
    return response.data;
  },

  create: async (employeeId: string | number) => {
    const response = await apiClient.post<ApiResponse<CertificateOfEmploymentModel>>(
      CERTIFICATE_OF_EMPLOYMENT_ENDPOINTS.PORTAL.MANAGEMENT.CREATE,
      {},
      { params: { employee_id: employeeId } }
    );
    return response.data;
  },

  settle: async (id: string | number) => {
    const response = await apiClient.post<ApiResponse<CertificateOfEmploymentModel>>(
      CERTIFICATE_OF_EMPLOYMENT_ENDPOINTS.PORTAL.MANAGEMENT.SETTLE(id)
    );
    return response.data;
  },

  export: async (id: string | number) => {
    const response = await apiClient.post<ApiResponse<any>>(
      CERTIFICATE_OF_EMPLOYMENT_ENDPOINTS.PORTAL.MANAGEMENT.EXPORT(id)
    );
    return response.data;
  },
};
