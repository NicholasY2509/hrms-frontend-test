import apiClient from '@/lib/api-client';
import { PaginatedResponse } from '@/types';
import { USER_ENDPOINTS } from '../endpoints';
import { UserModel } from '../types';

export const userService = {
  getList: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<UserModel>>(
      USER_ENDPOINTS.PORTAL.MANAGEMENT.LIST,
      { params }
    );
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post(
      USER_ENDPOINTS.PORTAL.MANAGEMENT.CREATE,
      data
    );
    return response.data;
  },

  update: async (id: number | string, data: any) => {
    const response = await apiClient.put(
      USER_ENDPOINTS.PORTAL.MANAGEMENT.UPDATE(id),
      data
    );
    return response.data;
  },

  delete: async (id: number | string) => {
    const response = await apiClient.delete(
      USER_ENDPOINTS.PORTAL.MANAGEMENT.DELETE(id)
    );
    return response.data;
  },
};
