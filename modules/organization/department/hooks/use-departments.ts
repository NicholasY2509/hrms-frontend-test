import { useQuery } from '@tanstack/react-query';
import { departmentService } from '../services';
import { DEPARTMENT_ENDPOINTS } from '../endpoints';
import { Department } from '../types';

const EMPTY_ARRAY: Department[] = [];

export function useDepartments({ params = {}, enabled = true } = {}) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [DEPARTMENT_ENDPOINTS.LIST, params],
    queryFn: () => departmentService.getDepartments(params),
    enabled,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  return {
    items: data?.data || EMPTY_ARRAY,
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useDepartmentDetail(id?: string | number | null, enabled = true) {
  const { data, error, isLoading } = useQuery({
    queryKey: [DEPARTMENT_ENDPOINTS.DETAIL(id as any)],
    queryFn: () => departmentService.getDepartmentDetail(id as any),
    enabled: !!id && id !== 'all' && enabled,
  });

  return {
    department: data?.data,
    isLoading,
    isError: error,
  };
}
