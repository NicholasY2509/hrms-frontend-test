import { PaginatedResponse, ApiResponse } from "@/types"
import { SHIFT_EXCHANGE_ENDPOINTS } from "../endpoints"
import { ShiftExchange } from "../types"
import { ShiftExchangeFormValues } from "../schemas"
import apiClient from "@/lib/api-client"

export interface ShiftExchangeWorkingHourResponse {
  id: number
  date: string
  shift_start: string
  shift_end: string
  status: string | null
  working_hour: {
    id: number
    name: string
    clock_in: string
    clock_out: string
  }
  attendance: any
  working_hour_id: number
  employee_id: number
}

export const shiftExchangeService = {
  getList: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<ShiftExchange>>(
      SHIFT_EXCHANGE_ENDPOINTS.PORTAL.EMPLOYEE.LIST,
      { params }
    )
    return response.data
  },

  create: async (data: ShiftExchangeFormValues) => {
    const response = await apiClient.post<ApiResponse<ShiftExchange>>(
      SHIFT_EXCHANGE_ENDPOINTS.PORTAL.EMPLOYEE.CREATE,
      data
    )
    return response.data
  },

  getDetail: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<ShiftExchange>>(
      SHIFT_EXCHANGE_ENDPOINTS.PORTAL.EMPLOYEE.DETAIL(id)
    )
    return response.data
  },

  getWorkingHour: async (params: { date: string; employee_id?: number }) => {
    const response = await apiClient.get<
      ApiResponse<ShiftExchangeWorkingHourResponse>
    >(SHIFT_EXCHANGE_ENDPOINTS.PORTAL.EMPLOYEE.WORKING_HOUR, { params })
    return response.data
  },
}
