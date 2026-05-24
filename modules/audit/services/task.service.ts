import { PaginatedResponse } from "@/types";
import { AUDIT_ENDPOINTS } from "../endpoints";
import { TaskLog, TaskLogFilters } from "../types";
import apiClient from "@/lib/api-client";

export const taskService = {
  getTasks: async (params?: TaskLogFilters) => {
    const response = await apiClient.get<PaginatedResponse<TaskLog>>(
      AUDIT_ENDPOINTS.CONFIG.TASKS,
      { params }
    );
    return response.data;
  },
};
