import { useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '../services/employee-service';
import { EMPLOYEE_ENDPOINTS } from '../endpoints';
import { toast } from 'sonner';

export function useCreateEmployee(options?: { onSuccess?: (data: any) => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: any) => employeeService.createEmployee(data),
    onSuccess: (data) => {
      toast.success('Karyawan berhasil dibuat');
      queryClient.invalidateQueries({ queryKey: [EMPLOYEE_ENDPOINTS.PORTAL.MANAGEMENT.LIST] });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal membuat karyawan');
    },
  });

  return {
    createEmployee: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}
