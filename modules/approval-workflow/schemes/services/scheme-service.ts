import apiClient from '@/lib/api-client';
import { APPROVAL_SCHEME_ENDPOINTS } from '../endpoints';
import { ApprovalScheme } from '../types';
import { ApiResponse, PaginatedResponse } from '@/types';

export const schemeService = {
  getSchemes: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<ApprovalScheme>>(APPROVAL_SCHEME_ENDPOINTS.LIST, { params });
    return response.data;
  },
  createScheme: async (data: Partial<ApprovalScheme>) => {
    const response = await apiClient.post<ApiResponse<ApprovalScheme>>(APPROVAL_SCHEME_ENDPOINTS.CREATE, data);
    return response.data;
  },
  getSchemeDetail: async (id: number | string) => {
    const response = await apiClient.get<ApiResponse<ApprovalScheme>>(APPROVAL_SCHEME_ENDPOINTS.DETAIL(id));
    return response.data;
  },
  updateScheme: async (id: number | string, data: Partial<ApprovalScheme>) => {
    const response = await apiClient.patch<ApiResponse<ApprovalScheme>>(APPROVAL_SCHEME_ENDPOINTS.UPDATE(id), data);
    return response.data;
  },
  deleteScheme: async (id: number | string) => {
    const response = await apiClient.delete(APPROVAL_SCHEME_ENDPOINTS.DELETE(id));
    return response.data;
  },
};
