import apiClient from "@/lib/api-client";
import { PaginatedResponse } from "@/types";
import { ATTENDANCE_MOBILE_SCAN_ENDPOINTS } from "../endpoints";
import { MobileScanModel } from "../types";

export const mobileScanService = {
  getMobileScans: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<MobileScanModel>>(
      ATTENDANCE_MOBILE_SCAN_ENDPOINTS.LIST,
      { params }
    );
    return response.data;
  },
};
