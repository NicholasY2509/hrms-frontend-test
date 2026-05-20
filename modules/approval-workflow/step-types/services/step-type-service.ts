import apiClient from '@/lib/api-client';
import { APPROVAL_STEP_TYPE_ENDPOINTS } from '../endpoints';
import { ApprovalStepType } from '../types';
import { ApiResponse, PaginatedResponse } from '@/types';

export const stepTypeService = {
  getStepTypes: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<ApprovalStepType>>(APPROVAL_STEP_TYPE_ENDPOINTS.LIST, { params });
    return response.data;
  },
  createStepType: async (data: Partial<ApprovalStepType>) => {
    const response = await apiClient.post<ApiResponse<ApprovalStepType>>(APPROVAL_STEP_TYPE_ENDPOINTS.CREATE, data);
    return response.data;
  },
  updateStepType: async (id: number, data: Partial<ApprovalStepType>) => {
    const response = await apiClient.patch<ApiResponse<ApprovalStepType>>(APPROVAL_STEP_TYPE_ENDPOINTS.UPDATE(id), data);
    return response.data;
  },
  deleteStepType: async (id: number) => {
    const response = await apiClient.delete(APPROVAL_STEP_TYPE_ENDPOINTS.DELETE(id));
    return response.data;
  },
};
