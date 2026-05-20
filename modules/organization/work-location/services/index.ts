import apiClient from '@/lib/api-client';
import { WORK_LOCATION_ENDPOINTS } from '../endpoints';
import { WorkLocation } from '../types';
import { PaginatedResponse } from '@/types';

export const workLocationService = {
  getList: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<WorkLocation>>(
      WORK_LOCATION_ENDPOINTS.LIST,
      { params }
    );
    return response.data;
  },

  getDetail: async (id: string | number) => {
    const response = await apiClient.get<{ data: WorkLocation }>(
      WORK_LOCATION_ENDPOINTS.DETAIL(id)
    );
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post<{ data: WorkLocation }>(
      WORK_LOCATION_ENDPOINTS.CREATE,
      data
    );
    return response.data;
  },

  update: async (id: string | number, data: any) => {
    const response = await apiClient.put<{ data: WorkLocation }>(
      WORK_LOCATION_ENDPOINTS.UPDATE(id),
      data
    );
    return response.data;
  },

  delete: async (id: string | number) => {
    const response = await apiClient.delete(WORK_LOCATION_ENDPOINTS.DELETE(id));
    return response.data;
  },
};
