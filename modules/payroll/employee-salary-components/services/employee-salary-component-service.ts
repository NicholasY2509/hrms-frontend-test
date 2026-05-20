import apiClient from "@/lib/api-client";
import { EMPLOYEE_SALARY_COMPONENT_ENDPOINTS } from "../endpoints";
import { EmployeeSalaryComponent, EmployeeSalaryComponentFormValues } from "../types";
import { ApiResponse, PaginatedResponse } from "@/types";

export const employeeSalaryComponentService = {
  getList: async (employeeId: number) => {
    const response = await apiClient.get<PaginatedResponse<EmployeeSalaryComponent>>(
      EMPLOYEE_SALARY_COMPONENT_ENDPOINTS.LIST,
      { params: { employee_id: employeeId } }
    );
    return response.data;
  },

  assign: async (data: EmployeeSalaryComponentFormValues) => {
    const response = await apiClient.post<ApiResponse<EmployeeSalaryComponent>>(
      EMPLOYEE_SALARY_COMPONENT_ENDPOINTS.ASSIGN,
      data
    );
    return response.data;
  },

  remove: async (id: number) => {
    const response = await apiClient.delete(EMPLOYEE_SALARY_COMPONENT_ENDPOINTS.REMOVE(id));
    return response.data;
  },
};
