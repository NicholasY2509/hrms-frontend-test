import apiClient from '@/lib/api-client';
import { APPROVAL_GROUP_ENDPOINTS } from '../endpoints';
import { ApprovalGroup } from '../types';
import { ApiResponse, PaginatedResponse } from '@/types';

export const groupService = {
  getGroups: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<ApprovalGroup>>(APPROVAL_GROUP_ENDPOINTS.LIST, { params });
    return response.data;
  },
  getGroupDetail: async (id: number | string) => {
    const response = await apiClient.get<ApiResponse<ApprovalGroup>>(APPROVAL_GROUP_ENDPOINTS.DETAIL(id));
    return response.data;
  },
  createGroup: async (data: Partial<ApprovalGroup>) => {
    const response = await apiClient.post<ApiResponse<ApprovalGroup>>(APPROVAL_GROUP_ENDPOINTS.CREATE, data);
    return response.data;
  },
  updateGroup: async (id: number | string, data: Partial<ApprovalGroup>) => {
    const response = await apiClient.patch<ApiResponse<ApprovalGroup>>(APPROVAL_GROUP_ENDPOINTS.UPDATE(id), data);
    return response.data;
  },
  deleteGroup: async (id: number | string) => {
    const response = await apiClient.delete(APPROVAL_GROUP_ENDPOINTS.DELETE(id));
    return response.data;
  },
  syncGroupUsers: async (id: number | string, userIds: (number | string)[]) => {
    const response = await apiClient.post<ApiResponse<any>>(APPROVAL_GROUP_ENDPOINTS.SYNC_USERS(id), { employee_ids: userIds });
    return response.data;
  },
};
