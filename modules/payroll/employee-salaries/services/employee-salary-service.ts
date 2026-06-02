import apiClient from "@/lib/api-client";
import { EMPLOYEE_SALARY_ENDPOINTS } from "../endpoints";
import { EmployeeSalary, EmployeeSalaryFormValues } from "../types";
import { ApiResponse, PaginatedResponse } from "@/types";

export const employeeSalaryService = {
  getMySalary: async () => {
    const response = await apiClient.get<ApiResponse<EmployeeSalary>>(
      EMPLOYEE_SALARY_ENDPOINTS.PORTAL.EMPLOYEE.MY_SALARY,
    );
    return response.data;
  },

  getList: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<EmployeeSalary>>(
      EMPLOYEE_SALARY_ENDPOINTS.LIST,
      { params }
    );
    return response.data;
  },

  getHistory: async (employeeId: number) => {
    const response = await apiClient.get<PaginatedResponse<EmployeeSalary>>(
      EMPLOYEE_SALARY_ENDPOINTS.HISTORY,
      { params: { employee_id: employeeId } }
    );
    return response.data;
  },

  update: async (data: EmployeeSalaryFormValues) => {
    const response = await apiClient.post<ApiResponse<EmployeeSalary>>(
      EMPLOYEE_SALARY_ENDPOINTS.STORE,
      data
    );
    return response.data;
  },
};
