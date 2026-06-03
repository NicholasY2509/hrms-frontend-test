import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { WORK_POSITIONS_ENDPOINTS } from '../endpoints';
import { workPositionService } from '../services';

const EMPTY_ARRAY: any[] = [];

export function useWorkPositions({ params = {}, enabled = true } = {}) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [WORK_POSITIONS_ENDPOINTS.LIST, params],
    queryFn: () => workPositionService.getWorkPositions(params),
    enabled,
  });

  return {
    items: data?.data || EMPTY_ARRAY,
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useWorkPositionDetail(id: string | number, enabled = true) {
  const { data, error, isLoading } = useQuery({
    queryKey: [WORK_POSITIONS_ENDPOINTS.DETAIL(id)],
    queryFn: () => workPositionService.getDetail(id),
    enabled: !!id && enabled,
  });

  return {
    position: data?.data,
    isLoading,
    isError: error,
  };
}

export function useWorkPositionPassportRoles(id: string | number) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [WORK_POSITIONS_ENDPOINTS.PASSPORT_ROLES(id)],
    queryFn: () => workPositionService.getPassportRoles(id),
    enabled: !!id,
  });

  return {
    items: data?.data || EMPTY_ARRAY,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useUpdateWorkPositionPassportRoles(id: string | number, options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: { roles: any[] }) => workPositionService.savePassportRoles(id, payload),
    onSuccess: () => {
      toast.success('Berhasil menyimpan peran untuk posisi kerja ini');
      queryClient.invalidateQueries({ queryKey: [WORK_POSITIONS_ENDPOINTS.PASSPORT_ROLES(id)] });
      options?.onSuccess?.();
    },
    onError: () => {
      toast.error('Gagal menyimpan peran');
    },
  });

  return {
    savePassportRoles: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}
