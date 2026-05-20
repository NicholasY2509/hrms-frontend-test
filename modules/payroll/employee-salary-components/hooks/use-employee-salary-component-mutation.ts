import { useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeSalaryComponentService } from '../services/employee-salary-component-service';
import { EMPLOYEE_SALARY_COMPONENT_ENDPOINTS } from '../endpoints';
import { EmployeeSalaryComponentFormValues } from '../types';
import { toast } from 'sonner';

export function useAssignEmployeeSalaryComponent(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: EmployeeSalaryComponentFormValues) => employeeSalaryComponentService.assign(data),
    onSuccess: () => {
      toast.success("Komponen gaji berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: [EMPLOYEE_SALARY_COMPONENT_ENDPOINTS.LIST] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal menambahkan komponen gaji");
    }
  });

  return {
    assignComponent: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useRemoveEmployeeSalaryComponent(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id }: { id: number; employeeId: number }) => employeeSalaryComponentService.remove(id),
    onSuccess: (_, variables) => {
      toast.success("Komponen gaji berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: [EMPLOYEE_SALARY_COMPONENT_ENDPOINTS.LIST, variables.employeeId] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal menghapus komponen gaji");
    }
  });

  return {
    removeComponent: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}
