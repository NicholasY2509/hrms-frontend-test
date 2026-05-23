import apiClient from "@/lib/api-client"
import { PaginatedResponse, ApiResponse } from "@/types"
import { ATTENDANCE_RECORD_ENDPOINTS } from "../endpoints"
import { AttendanceModel, EmployeeAttendanceHistoryData } from "../types"

export const attendanceService = {
  getList: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<AttendanceModel>>(
      ATTENDANCE_RECORD_ENDPOINTS.LIST,
      { params }
    )
    return response.data
  },

  exportAttendance: async (data: any) => {
    const response = await apiClient.post(
      ATTENDANCE_RECORD_ENDPOINTS.EXPORT,
      data
    )
    return response.data
  },

  calculateAttendance: async (data: {
    start_date: string
    end_date: string
  }) => {
    const response = await apiClient.post(
      ATTENDANCE_RECORD_ENDPOINTS.CALCULATE,
      data
    )
    return response.data
  },

  getEmployeeHistory: async (params: {
    start_date: string
    end_date: string
  }) => {
    const response = await apiClient.get<
      ApiResponse<EmployeeAttendanceHistoryData>
    >(ATTENDANCE_RECORD_ENDPOINTS.PORTAL.EMPLOYEE.HISTORY, { params })
    return response.data
  },

  updateAttendanceStatus: async (data: {
    attendance_status_id: number
    attendance_id: number
  }) => {
    const response = await apiClient.put(
      ATTENDANCE_RECORD_ENDPOINTS.PORTAL.MANAGEMENT.UPDATE_STATUS(
        data.attendance_id
      ),
      { attendance_status_id: data.attendance_status_id }
    )
    return response.data
  },

  batchUpdateAttendanceStatus: async (data: {
    attendance_ids: number[]
    attendance_status_id: number
  }) => {
    const response = await apiClient.put(
      ATTENDANCE_RECORD_ENDPOINTS.PORTAL.MANAGEMENT.BATCH_UPDATE_STATUS,
      data
    )
    return response.data
  },
}
