import apiClient from '@/lib/api-client';
import { PaginatedResponse } from '@/types';
import { WorkPosition } from '../types';
import { WORK_POSITIONS_ENDPOINTS } from '../endpoints';

export const workPositionService = {
  getWorkPositions: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<WorkPosition>>(
      WORK_POSITIONS_ENDPOINTS.LIST,
      { params }
    );
    return response.data;
  },

  getDetail: async (id: string | number) => {
    const response = await apiClient.get<{ data: WorkPosition }>(
      WORK_POSITIONS_ENDPOINTS.DETAIL(id)
    );
    return response.data;
  },

  getPassportRoles: async (id: string | number) => {
    const response = await apiClient.get<{ data: any[] }>(
      WORK_POSITIONS_ENDPOINTS.PASSPORT_ROLES(id)
    );
    return response.data;
  },

  savePassportRoles: async (id: string | number, payload: { roles: any[] }) => {
    const response = await apiClient.post(
      WORK_POSITIONS_ENDPOINTS.PASSPORT_ROLES(id),
      payload
    );
    return response.data;
  },
};
