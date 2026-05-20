import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { TEAMS_ENDPOINTS } from '../endpoints';
import { TeamFormValues } from '../schemas';
import { teamService } from '../services';

export function useCreateTeam(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: TeamFormValues) => teamService.createTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEAMS_ENDPOINTS.LIST] });
      toast.success('Tim berhasil ditambahkan');
      options?.onSuccess?.();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal menambahkan tim');
    },
  });

  return {
    createTeam: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useUpdateTeam(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: TeamFormValues }) => teamService.updateTeam(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEAMS_ENDPOINTS.LIST] });
      toast.success('Tim berhasil diupdate');
      options?.onSuccess?.();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal mengupdate tim');
    },
  });

  return {
    updateTeam: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useDeleteTeam(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string | number) => teamService.deleteTeam(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [TEAMS_ENDPOINTS.LIST] });
      queryClient.invalidateQueries({ queryKey: [TEAMS_ENDPOINTS.DETAIL(id)] });
      toast.success('Tim berhasil dihapus');
      options?.onSuccess?.();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal menghapus tim');
    },
  });

  return {
    deleteTeam: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}
