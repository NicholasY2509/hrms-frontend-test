import apiClient from "@/lib/api-client";
import { ApiResponse } from "@/types";

export interface SystemSetting {
  id: number;
  key: string;
  value: string;
  type: string;
  group: string;
  description: string;
}

export const systemSettingsService = {
  getSettingsByGroup: async (group: string) => {
    const response = await apiClient.get<ApiResponse<SystemSetting[]>>(
      `/v1/system/configuration/settings?group=${group}`
    );
    return response.data;
  },

  updateSettings: async (settings: Record<string, string | number>) => {
    const response = await apiClient.post<ApiResponse<any>>(
      `/v1/system/configuration/settings/bulk`,
      { settings }
    );
    return response.data;
  },
};
