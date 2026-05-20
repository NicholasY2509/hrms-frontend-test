import apiClient from "@/lib/api-client";
import { PaginatedResponse } from "@/types";
import { ATTENDANCE_WORKING_HOUR_ENDPOINTS } from "../endpoints";
import { WorkingHourModel, MasterWorkingHourModel } from "../types";

export const workingHourService = {
  getSchedules: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<WorkingHourModel>>(
      ATTENDANCE_WORKING_HOUR_ENDPOINTS.LIST,
      { params }
    );
    return response.data;
  },

  getMasterWorkingHours: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<MasterWorkingHourModel>>(
      ATTENDANCE_WORKING_HOUR_ENDPOINTS.MASTER,
      { params }
    );
    return response.data;
  },

  getMasterWorkingHourDetail: async (id: string | number) => {
    const response = await apiClient.get<any>(
      ATTENDANCE_WORKING_HOUR_ENDPOINTS.MASTER_DETAIL(id)
    );
    return response.data;
  },

  importWorkingHours: async (data: FormData) => {
    const response = await apiClient.post(
      ATTENDANCE_WORKING_HOUR_ENDPOINTS.IMPORT,
      data,
      {
        headers: {
          "Content-Type": "multipart-form-data",
        },
      }
    );
    return response.data;
  },

  createMasterWorkingHour: async (data: any) => {
    const response = await apiClient.post(
      ATTENDANCE_WORKING_HOUR_ENDPOINTS.MASTER,
      data
    );
    return response.data;
  },

  updateMasterWorkingHour: async (id: string | number, data: any) => {
    const response = await apiClient.put(
      ATTENDANCE_WORKING_HOUR_ENDPOINTS.MASTER_DETAIL(id),
      data
    );
    return response.data;
  },

  deleteMasterWorkingHour: async (id: string | number) => {
    const response = await apiClient.delete(
      ATTENDANCE_WORKING_HOUR_ENDPOINTS.MASTER_DETAIL(id)
    );
    return response.data;
  },

  updateAttendanceWorkingHour: async (id: string | number, data: { working_hour_id: number; attendance_at: string }) => {
    const response = await apiClient.put(
      ATTENDANCE_WORKING_HOUR_ENDPOINTS.DETAIL(id),
      data
    );
    return response.data;
  },
};
