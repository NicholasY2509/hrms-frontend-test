import apiClient from "@/lib/api-client";
import { PaginatedResponse } from "@/types";
import { ATTENDANCE_USER_ENDPOINTS } from "../endpoints";
import { AttendanceUserModel } from "../types";

export const userService = {
  getUsers: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<AttendanceUserModel>>(
      ATTENDANCE_USER_ENDPOINTS.LIST,
      { params }
    );
    return response.data;
  },

  createUser: async (data: any) => {
    const response = await apiClient.post(
      ATTENDANCE_USER_ENDPOINTS.LIST,
      data
    );
    return response.data;
  },

  updateUser: async (id: string | number, data: any) => {
    const response = await apiClient.put(
      ATTENDANCE_USER_ENDPOINTS.DETAIL(id),
      data
    );
    return response.data;
  },

  deleteUser: async (id: string | number) => {
    const response = await apiClient.delete(
      ATTENDANCE_USER_ENDPOINTS.DETAIL(id)
    );
    return response.data;
  },
};
