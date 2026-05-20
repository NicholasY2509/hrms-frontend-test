import apiClient from '@/lib/api-client';
import { TEAMS_ENDPOINTS } from '../endpoints';
import { Team } from '../types';
import { PaginatedResponse } from '@/types';
import { TeamFormValues } from '../schemas';

export const teamService = {
  getTeams: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<Team>>(
      TEAMS_ENDPOINTS.LIST,
      { params }
    );
    return response.data;
  },

  getTeamDetail: async (id: string | number) => {
    const response = await apiClient.get<{ data: Team }>(
      TEAMS_ENDPOINTS.DETAIL(id)
    );
    return response.data;
  },

  createTeam: async (data: TeamFormValues) => {
    const response = await apiClient.post(TEAMS_ENDPOINTS.CREATE, data);
    return response.data;
  },

  updateTeam: async (id: string | number, data: TeamFormValues) => {
    const response = await apiClient.put(TEAMS_ENDPOINTS.UPDATE(id), data);
    return response.data;
  },

  deleteTeam: async (id: string | number) => {
    const response = await apiClient.delete(TEAMS_ENDPOINTS.DELETE(id));
    return response.data;
  },
};
