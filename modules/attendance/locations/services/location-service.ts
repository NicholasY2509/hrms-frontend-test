import apiClient from "@/lib/api-client";
import { PaginatedResponse } from "@/types";
import { ATTENDANCE_LOCATION_ENDPOINTS } from "../endpoints";
import { AttendanceLocationModel, WorkLocationModel } from "../types";

export const locationService = {
  getLocations: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<AttendanceLocationModel>>(
      ATTENDANCE_LOCATION_ENDPOINTS.LIST,
      { params }
    );
    return response.data;
  },

  getWorkLocations: async () => {
    const response = await apiClient.get<PaginatedResponse<WorkLocationModel>>(
      ATTENDANCE_LOCATION_ENDPOINTS.WORK_LOCATIONS
    );
    return response.data;
  },

  createLocation: async (data: any) => {
    const response = await apiClient.post(
      ATTENDANCE_LOCATION_ENDPOINTS.LIST,
      data
    );
    return response.data;
  },

  updateLocation: async (id: string | number, data: any) => {
    const response = await apiClient.put(
      ATTENDANCE_LOCATION_ENDPOINTS.DETAIL(id),
      data
    );
    return response.data;
  },

  deleteLocation: async (id: string | number) => {
    const response = await apiClient.delete(
      ATTENDANCE_LOCATION_ENDPOINTS.DETAIL(id)
    );
    return response.data;
  },
};
