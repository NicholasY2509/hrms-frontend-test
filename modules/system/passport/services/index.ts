import apiClient from '@/lib/api-client';
import { ApiResponse } from '@/types';
import { SYSTEM_ENDPOINTS } from '../../endpoints';
import { PassportClient, PassportRole, PassportRolePayload } from '../types';

export const passportService = {
  getClients: async () => {
    const response = await apiClient.get<ApiResponse<PassportClient[]>>(
      SYSTEM_ENDPOINTS.CONFIG.PASSPORT_CLIENTS
    );
    return response.data;
  },

  getRoles: async (clientId: number | string) => {
    const response = await apiClient.get<ApiResponse<PassportRole[]>>(
      SYSTEM_ENDPOINTS.CONFIG.PASSPORT_ROLES,
      { params: { client_id: clientId } }
    );
    return response.data;
  },

  getGlobalRoles: async () => {
    const response = await apiClient.get<ApiResponse<PassportRole[]>>(
      SYSTEM_ENDPOINTS.CONFIG.GLOBAL_PASSPORT_ROLES
    );
    return response.data;
  },

  saveGlobalRoles: async (payload: PassportRolePayload) => {
    const response = await apiClient.post<ApiResponse<any>>(
      SYSTEM_ENDPOINTS.CONFIG.GLOBAL_PASSPORT_ROLES,
      payload
    );
    return response.data;
  },
};
