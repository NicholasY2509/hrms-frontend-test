import apiClient from '@/lib/api-client';
import { DEPARTMENT_ENDPOINTS } from '../endpoints';
import { Department } from '../types';
import { PaginatedResponse } from '@/types';
import { DepartmentFormValues } from '../schemas';

export const departmentService = {
  getDepartments: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<Department>>(
      DEPARTMENT_ENDPOINTS.LIST,
      { params }
    );
    return response.data;
  },
  createDepartment: async (data: DepartmentFormValues) => {
    const response = await apiClient.post(DEPARTMENT_ENDPOINTS.CREATE, data);
    return response.data;
  },
  updateDepartment: async (id: number | string, data: DepartmentFormValues) => {
    const response = await apiClient.put(DEPARTMENT_ENDPOINTS.UPDATE(id), data);
    return response.data;
  },
  deleteDepartment: async (id: number | string) => {
    const response = await apiClient.delete(DEPARTMENT_ENDPOINTS.DELETE(id));
    return response.data;
  },
  getDepartmentDetail: async (id: number | string) => {
    const response = await apiClient.get<{ data: Department }>(
      DEPARTMENT_ENDPOINTS.DETAIL(id)
    );
    return response.data;
  },
};
