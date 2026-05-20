import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EMPLOYEE_SALARY_ENDPOINTS } from '../endpoints';
import { EmployeeSalaryFormValues } from '../types';
import { toast } from 'sonner';
import { employeeSalaryService } from '../services/employee-salary-service';

export function useUpdateEmployeeSalary(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: EmployeeSalaryFormValues) => employeeSalaryService.update(data),
    onSuccess: (_, variables) => {
      toast.success("Gaji karyawan berhasil diperbarui");
      queryClient.invalidateQueries({
        queryKey: [EMPLOYEE_SALARY_ENDPOINTS.HISTORY, variables.employee_id]
      });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal memperbarui gaji karyawan");
    }
  });

  return {
    updateSalary: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}
