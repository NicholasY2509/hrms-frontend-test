import { PaginatedResponse, ApiResponse } from "@/types"
import { PositionHierarchyMatrix } from "../types"
import { POSITION_HIERARCHY_MATRIX_ENDPOINTS } from "../endpoints"
import apiClient from "@/lib/api-client"
import { PositionHierarchyMatrixFormValues } from "../schemas/position-hierarchy-matrix"

export const positionHierarchyMatrixService = {
  getList: async (params?: Record<string, any>) => {
    const response = await apiClient.get<
      PaginatedResponse<PositionHierarchyMatrix>
    >(POSITION_HIERARCHY_MATRIX_ENDPOINTS.LIST, { params })
    return response.data
  },

  create: async (data: PositionHierarchyMatrixFormValues) => {
    const response = await apiClient.post<ApiResponse<PositionHierarchyMatrix>>(
      POSITION_HIERARCHY_MATRIX_ENDPOINTS.CREATE,
      data
    )
    return response.data
  },

  update: async (
    id: string | number,
    data: PositionHierarchyMatrixFormValues
  ) => {
    const response = await apiClient.put<ApiResponse<PositionHierarchyMatrix>>(
      POSITION_HIERARCHY_MATRIX_ENDPOINTS.UPDATE(id),
      data
    )
    return response.data
  },

  delete: async (id: string | number) => {
    const response = await apiClient.delete(
      POSITION_HIERARCHY_MATRIX_ENDPOINTS.DELETE(id)
    )
    return response.data
  },
}
