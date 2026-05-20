import apiClient from '@/lib/api-client';
import { PaginatedResponse } from '@/types';
import { SUPERVISOR_ENDPOINTS } from '../endpoints';
import { SupervisorModel } from '../types';

export const supervisorService = {
  getSupervisors: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<SupervisorModel>>(
      SUPERVISOR_ENDPOINTS.PORTAL.MANAGEMENT.LIST,
      { params }
    );
    return response.data;
  },

  create: async (data: { employee_id: number }) => {
    const response = await apiClient.post(
      SUPERVISOR_ENDPOINTS.PORTAL.MANAGEMENT.CREATE,
      data
    );
    return response.data;
  },

  update: async (id: number | string, data: { employee_id: number }) => {
    const response = await apiClient.put(
      SUPERVISOR_ENDPOINTS.PORTAL.MANAGEMENT.UPDATE(id),
      data
    );
    return response.data;
  },

  delete: async (id: number | string) => {
    const response = await apiClient.delete(
      SUPERVISOR_ENDPOINTS.PORTAL.MANAGEMENT.DELETE(id)
    );
    return response.data;
  },
};
