import apiClient from '@/lib/api-client';
import { APPROVAL_RULE_ENDPOINTS } from '../endpoints';
import { ApprovalRule } from '../types';
import { ApiResponse } from '@/types';

export const ruleService = {
  createRule: async (data: Partial<ApprovalRule>) => {
    const response = await apiClient.post<ApiResponse<ApprovalRule>>(APPROVAL_RULE_ENDPOINTS.CREATE, data);
    return response.data;
  },
  updateRule: async (id: number | string, data: Partial<ApprovalRule>) => {
    const response = await apiClient.patch<ApiResponse<ApprovalRule>>(APPROVAL_RULE_ENDPOINTS.UPDATE(id), data);
    return response.data;
  },
  deleteRule: async (id: number | string) => {
    const response = await apiClient.delete(APPROVAL_RULE_ENDPOINTS.DELETE(id));
    return response.data;
  },
};
