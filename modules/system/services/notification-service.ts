import { SYSTEM_ENDPOINTS } from "../endpoints";
import { ApiResponse, PaginatedResponse } from "@/types";
import { NotificationModel, UnreadCountResponse } from "../types/notification";
import apiClient from "@/lib/api-client";

export const notificationService = {
  getNotifications: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<NotificationModel>>(
      SYSTEM_ENDPOINTS.PORTAL.EMPLOYEE.NOTIFICATIONS.LIST,
      { params }
    );
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await apiClient.get<ApiResponse<UnreadCountResponse>>(
      SYSTEM_ENDPOINTS.PORTAL.EMPLOYEE.NOTIFICATIONS.UNREAD_COUNT
    );
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await apiClient.post<ApiResponse<null>>(
      SYSTEM_ENDPOINTS.PORTAL.EMPLOYEE.NOTIFICATIONS.MARK_READ(id)
    );
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await apiClient.post<ApiResponse<null>>(
      SYSTEM_ENDPOINTS.PORTAL.EMPLOYEE.NOTIFICATIONS.MARK_ALL_READ
    );
    return response.data;
  },
};
