import apiClient from "@/lib/api-client";
import { UNPAID_LEAVE_ENDPOINTS } from "../endpoints";
import { UnpaidLeave, UnpaidLeaveType, UnpaidLeaveCalendarData } from "../types";
import { UnpaidLeaveFormValues, UnpaidLeaveManagementFormValues } from "../schemas/unpaid-leave-schema";
import { UnpaidLeaveTypeFormValues } from "../schemas/unpaid-leave-type-schema";
import { format } from "date-fns";
import { PaginatedResponse, ApiResponse } from "@/types";

export const unpaidLeaveService = {
  portal: {
    employee: {
      getList: async (params?: Record<string, any>) => {
        const response = await apiClient.get<PaginatedResponse<UnpaidLeave>>(
          UNPAID_LEAVE_ENDPOINTS.PORTAL.EMPLOYEE.LIST,
          { params }
        );
        return response.data;
      },

      getDetail: async (id: string | number) => {
        const response = await apiClient.get<ApiResponse<UnpaidLeave>>(
          UNPAID_LEAVE_ENDPOINTS.PORTAL.EMPLOYEE.DETAIL(id)
        );
        return response.data;
      },

      create: async (values: UnpaidLeaveFormValues) => {
        const formData = new FormData();
        formData.append("unpaid_leave_type_id", values.unpaid_leave_type_id.toString());
        formData.append("start_date", format(values.start_date, "yyyy-MM-dd"));
        formData.append("end_date", format(values.end_date, "yyyy-MM-dd"));

        if (values.note) {
          formData.append("note", values.note);
        }

        if (values.attachment) {
          formData.append("attachment", values.attachment);
        }

        const response = await apiClient.post(
          UNPAID_LEAVE_ENDPOINTS.PORTAL.EMPLOYEE.CREATE,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data;
      },
    },

    management: {
      getList: async (params?: Record<string, any>) => {
        const response = await apiClient.get<PaginatedResponse<UnpaidLeave>>(
          UNPAID_LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.LIST,
          { params }
        );
        return response.data;
      },

      getDetail: async (id: string | number) => {
        const response = await apiClient.get<ApiResponse<UnpaidLeave>>(
          UNPAID_LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.DETAIL(id)
        );
        return response.data;
      },
      
      create: async (values: UnpaidLeaveManagementFormValues) => {
        const formData = new FormData();
        formData.append("employee_id", values.employee_id.toString());
        formData.append("unpaid_leave_type_id", values.unpaid_leave_type_id.toString());
        formData.append("start_date", format(values.start_date, "yyyy-MM-dd"));
        formData.append("end_date", format(values.end_date, "yyyy-MM-dd"));

        if (values.note) {
          formData.append("note", values.note);
        }

        if (values.attachment) {
          formData.append("attachment", values.attachment);
        }

        const response = await apiClient.post(
          UNPAID_LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.CREATE,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data;
      },
      
      getCalendar: async (params: Record<string, any>) => {
        const response = await apiClient.get<ApiResponse<UnpaidLeaveCalendarData>>(
          UNPAID_LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.CALENDAR,
          { params }
        );
        return response.data;
      },

      getTypes: async () => {
        const response = await apiClient.get<ApiResponse<UnpaidLeaveType[]>>(
          UNPAID_LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.TYPES
        );
        return response.data;
      },

      createType: async (values: UnpaidLeaveTypeFormValues) => {
        const response = await apiClient.post<ApiResponse<UnpaidLeaveType>>(
          UNPAID_LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.TYPES,
          values
        );
        return response.data;
      },

      updateType: async (id: string | number, values: UnpaidLeaveTypeFormValues) => {
        const response = await apiClient.put<ApiResponse<UnpaidLeaveType>>(
          UNPAID_LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.TYPE_DETAIL(id),
          values
        );
        return response.data;
      },

      deleteType: async (id: string | number) => {
        const response = await apiClient.delete(
          UNPAID_LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.TYPE_DETAIL(id)
        );
        return response.data;
      },
    }
  },
};
