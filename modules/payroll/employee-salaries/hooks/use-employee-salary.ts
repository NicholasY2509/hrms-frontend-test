import { useQuery } from '@tanstack/react-query';
import { EMPLOYEE_SALARY_ENDPOINTS } from '../endpoints';
import { employeeSalaryService } from '../services/employee-salary-service';

export function useEmployeeSalaryList(params?: Record<string, any>) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [EMPLOYEE_SALARY_ENDPOINTS.LIST, params],
    queryFn: () => employeeSalaryService.getList(params),
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useEmployeeSalaryHistory(employeeId: number) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [EMPLOYEE_SALARY_ENDPOINTS.HISTORY, employeeId],
    queryFn: () => employeeSalaryService.getHistory(employeeId),
    enabled: !!employeeId,
  });

  return {
    items: data?.data || [],
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useMySalary() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [EMPLOYEE_SALARY_ENDPOINTS.PORTAL.EMPLOYEE.MY_SALARY],
    queryFn: () => employeeSalaryService.getMySalary(),
  });

  return {
    item: data?.data,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}


export * from './use-employee-salary-mutation';
