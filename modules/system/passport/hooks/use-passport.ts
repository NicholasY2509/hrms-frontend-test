import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { passportService } from '../services';
import { PassportRolePayload } from '../types';
import { SYSTEM_ENDPOINTS } from '../../endpoints';
import { toast } from 'sonner';

const EMPTY_ARRAY: any[] = [];

export function usePassportClients() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [SYSTEM_ENDPOINTS.CONFIG.PASSPORT_CLIENTS],
    queryFn: () => passportService.getClients(),
  });

  return {
    items: data?.data || EMPTY_ARRAY,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function usePassportRoles(clientId?: number | string) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [SYSTEM_ENDPOINTS.CONFIG.PASSPORT_ROLES, clientId],
    queryFn: () => passportService.getRoles(clientId!),
    enabled: !!clientId,
  });

  return {
    items: data?.data || EMPTY_ARRAY,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useGlobalPassportRoles() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [SYSTEM_ENDPOINTS.CONFIG.GLOBAL_PASSPORT_ROLES],
    queryFn: () => passportService.getGlobalRoles(),
  });

  return {
    items: data?.data || EMPTY_ARRAY,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useUpdateGlobalPassportRoles(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: PassportRolePayload) => passportService.saveGlobalRoles(payload),
    onSuccess: () => {
      toast.success('Berhasil menyimpan peran global');
      queryClient.invalidateQueries({ queryKey: [SYSTEM_ENDPOINTS.CONFIG.GLOBAL_PASSPORT_ROLES] });
      options?.onSuccess?.();
    },
    onError: () => {
      toast.error('Gagal menyimpan peran global');
    },
  });

  return {
    saveGlobalRoles: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}
