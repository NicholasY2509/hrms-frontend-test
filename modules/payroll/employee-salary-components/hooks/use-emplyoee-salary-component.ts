import { useQuery } from '@tanstack/react-query';
import { employeeSalaryComponentService } from '../services/employee-salary-component-service';
import { EMPLOYEE_SALARY_COMPONENT_ENDPOINTS } from '../endpoints';

export function useEmployeeSalaryComponents(employeeId: number) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [EMPLOYEE_SALARY_COMPONENT_ENDPOINTS.LIST, employeeId],
    queryFn: () => employeeSalaryComponentService.getList(employeeId),
    enabled: !!employeeId,
  });

  return {
    items: data?.data || [],
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export * from './use-employee-salary-component-mutation';
