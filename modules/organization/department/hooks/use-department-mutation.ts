import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { departmentService } from '../services';
import { DEPARTMENT_ENDPOINTS } from '../endpoints';
import { DepartmentFormValues } from '../schemas';

export function useCreateDepartment(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: DepartmentFormValues) => departmentService.createDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DEPARTMENT_ENDPOINTS.LIST] });
      toast.success('Department berhasil dibuat');
      options?.onSuccess?.();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal membuat department');
    },
  });

  return {
    createDepartment: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useUpdateDepartment(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: DepartmentFormValues }) =>
      departmentService.updateDepartment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DEPARTMENT_ENDPOINTS.LIST] });
      toast.success('Department berhasil diperbarui');
      options?.onSuccess?.();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal memperbarui department');
    },
  });

  return {
    updateDepartment: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useDeleteDepartment(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string | number) => departmentService.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DEPARTMENT_ENDPOINTS.LIST] });
      toast.success('Department berhasil dihapus');
      options?.onSuccess?.();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal menghapus department');
    },
  });

  return {
    deleteDepartment: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}
