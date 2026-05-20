import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workLocationService } from '../services';
import { WORK_LOCATION_ENDPOINTS } from '../endpoints';
import { WorkLocationFormValues } from '../schemas';

export function useCreateWorkLocation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: WorkLocationFormValues) => workLocationService.create(data),
    onSuccess: () => {
      toast.success('Lokasi kerja berhasil ditambahkan');
      queryClient.invalidateQueries({ queryKey: [WORK_LOCATION_ENDPOINTS.LIST] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menambahkan lokasi kerja');
    },
  });

  return {
    createWorkLocation: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useUpdateWorkLocation(id: string | number, options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: WorkLocationFormValues) => workLocationService.update(id, data),
    onSuccess: () => {
      toast.success('Lokasi kerja berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: [WORK_LOCATION_ENDPOINTS.LIST] });
      queryClient.invalidateQueries({ queryKey: [WORK_LOCATION_ENDPOINTS.DETAIL(id)] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal memperbarui lokasi kerja');
    },
  });

  return {
    updateWorkLocation: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useDeleteWorkLocation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string | number) => workLocationService.delete(id),
    onSuccess: () => {
      toast.success('Lokasi kerja berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: [WORK_LOCATION_ENDPOINTS.LIST] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menghapus lokasi kerja');
    },
  });

  return {
    deleteWorkLocation: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}
