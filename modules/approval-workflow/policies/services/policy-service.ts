import apiClient from '@/lib/api-client';
import { APPROVAL_POLICY_ENDPOINTS } from '../endpoints';
import { ApprovalPolicy, ApprovalPolicyStep } from '../types';
import { ApiResponse, PaginatedResponse } from '@/types';

export const policyService = {
  getPolicies: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<ApprovalPolicy>>(APPROVAL_POLICY_ENDPOINTS.LIST, { params });
    return response.data;
  },
  createPolicy: async (data: Partial<ApprovalPolicy>) => {
    const response = await apiClient.post<ApiResponse<ApprovalPolicy>>(APPROVAL_POLICY_ENDPOINTS.CREATE, data);
    return response.data;
  },
  getPolicyDetail: async (id: number) => {
    const response = await apiClient.get<ApiResponse<ApprovalPolicy>>(APPROVAL_POLICY_ENDPOINTS.DETAIL(id));
    return response.data;
  },
  updatePolicySteps: async (id: number, steps: Partial<ApprovalPolicyStep>[]) => {
    const response = await apiClient.post<ApiResponse<any>>(APPROVAL_POLICY_ENDPOINTS.UPDATE_STEPS(id), { steps });
    return response.data;
  },
  deletePolicy: async (id: number) => {
    const response = await apiClient.delete(APPROVAL_POLICY_ENDPOINTS.DELETE(id));
    return response.data;
  },
};
