import apiClient from "@/lib/api-client";
import { ApiResponse } from "@/types";
import { APPROVAL_ACTION_ENDPOINTS } from "../endpoints";
import { ApprovalRequest, ApprovalActionResponse } from "../types";

export const approvalActionService = {
  getPending: async (params?: Record<string, any>) => {
    const response = await apiClient.get<ApprovalActionResponse<ApprovalRequest>>(
      APPROVAL_ACTION_ENDPOINTS.PENDING,
      { params }
    );
    return response.data;
  },

  getUpcoming: async (params?: Record<string, any>) => {
    const response = await apiClient.get<ApprovalActionResponse<ApprovalRequest>>(
      APPROVAL_ACTION_ENDPOINTS.UPCOMING,
      { params }
    );
    return response.data;
  },

  getOngoing: async (params?: Record<string, any>) => {
    const response = await apiClient.get<ApprovalActionResponse<ApprovalRequest>>(
      APPROVAL_ACTION_ENDPOINTS.ONGOING,
      { params }
    );
    return response.data;
  },

  getHistory: async (params?: Record<string, any>) => {
    const response = await apiClient.get<ApprovalActionResponse<ApprovalRequest>>(
      APPROVAL_ACTION_ENDPOINTS.HISTORY,
      { params }
    );
    return response.data;
  },

  approve: async (id: number | string, notes: string, attachment?: File) => {
    const formData = new FormData();
    formData.append('notes', notes);
    if (attachment) {
      formData.append('attachment', attachment);
    }

    const response = await apiClient.post<ApiResponse<ApprovalRequest>>(
      APPROVAL_ACTION_ENDPOINTS.APPROVE(id),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  reject: async (id: number | string, notes: string) => {
    const response = await apiClient.post<ApiResponse<ApprovalRequest>>(
      APPROVAL_ACTION_ENDPOINTS.REJECT(id),
      { notes }
    );
    return response.data;
  },
};