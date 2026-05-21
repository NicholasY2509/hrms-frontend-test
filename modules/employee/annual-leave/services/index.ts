import apiClient from "@/lib/api-client"
import { LEAVE_ENDPOINTS } from "../endpoints"
import { AnnualLeave } from "../types"
import { PaginatedResponse } from "@/types"

export const leaveService = {
  portal: {
    management: {
      getAnnualLeaves: async (params?: Record<string, any>) => {
        const response = await apiClient.get<PaginatedResponse<AnnualLeave>>(
          LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.ANNUAL_LEAVES,
          { params }
        )
        return response.data
      },
      adjustAnnualLeave: async (employeeId: string | number, data: any) => {
        const response = await apiClient.put(
          `${LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.ANNUAL_LEAVES}/adjust/${employeeId}`,
          data
        )
        return response.data
      },
    },
  },
}
