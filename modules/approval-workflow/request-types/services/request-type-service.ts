import apiClient from '@/lib/api-client';
import { APPROVAL_REQUEST_TYPE_ENDPOINTS } from '../endpoints';
import { ApprovalRequestType } from '../types';
import { ApiResponse, PaginatedResponse } from '@/types';

export const requestTypeService = {
  getRequestTypes: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<ApprovalRequestType>>(APPROVAL_REQUEST_TYPE_ENDPOINTS.LIST, { params });
    return response.data;
  },
  createRequestType: async (data: Partial<ApprovalRequestType>) => {
    const response = await apiClient.post<ApiResponse<ApprovalRequestType>>(APPROVAL_REQUEST_TYPE_ENDPOINTS.CREATE, data);
    return response.data;
  },
  updateRequestType: async (id: string | number, data: Partial<ApprovalRequestType>) => {
    const response = await apiClient.patch<ApiResponse<ApprovalRequestType>>(APPROVAL_REQUEST_TYPE_ENDPOINTS.UPDATE(id), data);
    return response.data;
  },
  deleteRequestType: async (id: string | number) => {
    const response = await apiClient.delete(APPROVAL_REQUEST_TYPE_ENDPOINTS.DELETE(id));
    return response.data;
  },
};
