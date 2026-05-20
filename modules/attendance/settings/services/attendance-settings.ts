import apiClient from "@/lib/api-client";
import { ATTENDANCE_SETTINGS_ENDPOINTS } from "../endpoints";
import { AttendanceSetting } from "../types";
import { ApiResponse } from "@/types";

export const attendanceSettingsService = {
  getGeneralSettings: async () => {
    const response = await apiClient.get<ApiResponse<AttendanceSetting[]>>(
      ATTENDANCE_SETTINGS_ENDPOINTS.GENERAL
    );
    return response.data;
  },

  getCalculationSettings: async () => {
    const response = await apiClient.get<ApiResponse<AttendanceSetting[]>>(
      ATTENDANCE_SETTINGS_ENDPOINTS.CALCULATION
    );
    return response.data;
  },

  updateSettings: async (data: Record<string, string | number>) => {
    const response = await apiClient.post<ApiResponse<any>>(
      ATTENDANCE_SETTINGS_ENDPOINTS.UPDATE,
      data
    );
    return response.data;
  },
};
