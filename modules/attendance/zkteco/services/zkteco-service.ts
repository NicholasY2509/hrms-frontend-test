import apiClient from "@/lib/api-client";
import { PaginatedResponse } from "@/types";
import { ATTENDANCE_ZKTECO_ENDPOINTS } from "../endpoints";
import { ZktecoMachineModel, ZktecoAttendanceModel, ZktecoUserModel } from "../types";

export const zktecoService = {
  getMachines: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<ZktecoMachineModel>>(
      ATTENDANCE_ZKTECO_ENDPOINTS.MACHINES,
      { params }
    );
    return response.data;
  },

  getAttendances: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<ZktecoAttendanceModel>>(
      ATTENDANCE_ZKTECO_ENDPOINTS.ATTENDANCES,
      { params }
    );
    return response.data;
  },

  getUsers: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<ZktecoUserModel>>(
      ATTENDANCE_ZKTECO_ENDPOINTS.USERS,
      { params }
    );
    return response.data;
  },

  syncUsers: async (machineId: number) => {
    const response = await apiClient.post(
      ATTENDANCE_ZKTECO_ENDPOINTS.SYNC_USERS,
      { zkteco_machine_id: machineId }
    );
    return response.data;
  },

  syncAttendances: async (data: { zkteco_machine_id: number; start_date: string; end_date: string }) => {
    const response = await apiClient.post(
      ATTENDANCE_ZKTECO_ENDPOINTS.SYNC_ATTENDANCES,
      data
    );
    return response.data;
  },
};
