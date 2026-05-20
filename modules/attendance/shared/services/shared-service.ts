import apiClient from "@/lib/api-client";
import { ATTENDANCE_SHARED_ENDPOINTS } from "../endpoints";
import { AttendanceStatus } from "../types";

export const sharedService = {
  getStatuses: async () => {
    const response = await apiClient.get<{ data: AttendanceStatus[] }>(
      ATTENDANCE_SHARED_ENDPOINTS.STATUSES
    );
    return response.data;
  },
};
