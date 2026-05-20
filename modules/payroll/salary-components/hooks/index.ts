import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salaryComponentService } from '../services';
import { SALARY_COMPONENT_ENDPOINTS } from '../endpoints';
import { SalaryComponentFormValues } from '../schemas';
import { toast } from 'sonner';

export function useSalaryComponents(params?: Record<string, any>) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [SALARY_COMPONENT_ENDPOINTS.LIST, params],
    queryFn: () => salaryComponentService.getList(params),
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useSalaryComponentMutation() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: SalaryComponentFormValues) => salaryComponentService.create(data),
    onSuccess: () => {
      toast.success("Komponen gaji berhasil dibuat");
      queryClient.invalidateQueries({ queryKey: [SALARY_COMPONENT_ENDPOINTS.LIST] });
    },
    onError: () => {
      toast.error("Gagal membuat komponen gaji");
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: SalaryComponentFormValues }) =>
      salaryComponentService.update(id, data),
    onSuccess: () => {
      toast.success("Komponen gaji berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: [SALARY_COMPONENT_ENDPOINTS.LIST] });
    },
    onError: () => {
      toast.error("Gagal memperbarui komponen gaji");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => salaryComponentService.delete(id),
    onSuccess: () => {
      toast.success("Komponen gaji berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: [SALARY_COMPONENT_ENDPOINTS.LIST] });
    },
    onError: () => {
      toast.error("Gagal menghapus komponen gaji");
    }
  });

  return {
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
