import apiClient from '@/lib/api-client';
import { EMPLOYEE_ENDPOINTS } from '../endpoints';
import { Employee, EmployeeSummary } from '../types';
import { PaginatedResponse } from '@/types';

export const employeeService = {
  getEmployees: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<Employee>>(
      EMPLOYEE_ENDPOINTS.SEARCH,
      { params }
    );
    return response.data;
  },

  getSupervisors: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<Employee>>(
      EMPLOYEE_ENDPOINTS.SUPERVISORS_SEARCH,
      { params }
    );
    return response.data;
  },

  generateNik: async (workPositionId: number) => {
    const response = await apiClient.get<{ data: { employee_id_number: string } }>(
      EMPLOYEE_ENDPOINTS.PORTAL.MANAGEMENT.GENERATE_NIK,
      { params: { work_position_id: workPositionId } }
    );
    return response.data;
  },

  getManagementEmployees: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<Employee> & { summary: EmployeeSummary[] }>(
      EMPLOYEE_ENDPOINTS.PORTAL.MANAGEMENT.LIST,
      { params }
    );
    return response.data;
  },

  getEmployeeDetail: async (id: string | number) => {
    const response = await apiClient.get<{ data: Employee }>(
      EMPLOYEE_ENDPOINTS.PORTAL.MANAGEMENT.DETAIL(id)
    );
    return response.data;
  },

  createEmployee: async (data: FormData) => {
    const response = await apiClient.post(
      EMPLOYEE_ENDPOINTS.PORTAL.MANAGEMENT.CREATE,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  getDetails: async (id: string | number, type: string) => {
    const response = await apiClient.get<{ data: any[] }>(
      EMPLOYEE_ENDPOINTS.PORTAL.MANAGEMENT.DETAILS(id, type)
    );
    return response.data;
  },

  getStatuses: async () => {
    const response = await apiClient.get<PaginatedResponse<any>>(
      EMPLOYEE_ENDPOINTS.CONFIG.EMPLOYEE_STATUSES.LIST
    );
    return response.data;
  },

  updateDetails: async (id: string | number, type: string, data: any) => {
    const isFormData = data instanceof FormData;
    const url = EMPLOYEE_ENDPOINTS.PORTAL.MANAGEMENT.DETAILS(id, type);

    if (isFormData) {
      data.append('_method', 'PUT');
      const response = await apiClient.post(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }

    const response = await apiClient.put(url, data);
    return response.data;
  },
};
