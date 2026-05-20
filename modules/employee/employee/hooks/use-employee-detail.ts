import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '../services/employee-service';
import { EMPLOYEE_ENDPOINTS } from '../endpoints';
import { toast } from 'sonner';

export function useEmployeeDetail(id: string | number) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [EMPLOYEE_ENDPOINTS.PORTAL.MANAGEMENT.DETAIL(id), id],
    queryFn: () => employeeService.getEmployeeDetail(id),
    enabled: !!id,
  });

  return {
    employee: data?.data,
    isLoading,
    isError,
    mutate: refetch,
  };
}

export function useEmployeeDetails(id: string | number, type: string) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [EMPLOYEE_ENDPOINTS.PORTAL.MANAGEMENT.DETAILS(id, type), id, type],
    queryFn: () => employeeService.getDetails(id, type),
    enabled: !!id && !!type,
    staleTime: 5 * 60 * 1000, // 5 minutes cache as per guide
  });

  return {
    items: Array.isArray(data?.data) ? data?.data : [],
    item: !Array.isArray(data?.data) ? data?.data : data?.data[0],
    isLoading,
    isError,
    mutate: refetch,
  };
}

export function useUpdateEmployeeDetails(id: string | number, type: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: any) => employeeService.updateDetails(id, type, data),
    onSuccess: () => {
      toast.success('Data berhasil diperbarui');
      queryClient.invalidateQueries({
        queryKey: [EMPLOYEE_ENDPOINTS.PORTAL.MANAGEMENT.DETAILS(id, type), id, type],
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gagal memperbarui data');
    },
  });

  return {
    update: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}
