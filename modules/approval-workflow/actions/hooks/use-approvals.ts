import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { approvalActionService } from "../services/approval-action-service";
import { APPROVAL_ACTION_ENDPOINTS } from "../endpoints";

export type ApprovalCategory = 'pending' | 'upcoming' | 'ongoing' | 'history';

export function useApprovals(
  category: ApprovalCategory,
  params?: Record<string, any>,
  options?: { enabled?: boolean }
) {
  const endpointMap = {
    pending: APPROVAL_ACTION_ENDPOINTS.PENDING,
    upcoming: APPROVAL_ACTION_ENDPOINTS.UPCOMING,
    ongoing: APPROVAL_ACTION_ENDPOINTS.ONGOING,
    history: APPROVAL_ACTION_ENDPOINTS.HISTORY,
  };

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [endpointMap[category], params],
    queryFn: () => {
      switch (category) {
        case 'upcoming': return approvalActionService.getUpcoming(params);
        case 'ongoing': return approvalActionService.getOngoing(params);
        case 'history': return approvalActionService.getHistory(params);
        default: return approvalActionService.getPending(params);
      }
    },
    ...options,
  });

  return {
    approvals: data?.data || [],
    meta: data?.meta,
    summary_counts: data?.summary_counts,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function usePendingApprovals(params?: Record<string, any>, options?: { enabled?: boolean }) {
  return useApprovals('pending', params, options);
}

export function useApproveRequest(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, notes, attachment }: { id: number | string; notes: string; attachment?: File }) =>
      approvalActionService.approve(id, notes, attachment),
    onSuccess: () => {
      toast.success("Pengajuan berhasil disetujui");
      // Invalidate all approval lists
      queryClient.invalidateQueries({ queryKey: [APPROVAL_ACTION_ENDPOINTS.PENDING] });
      queryClient.invalidateQueries({ queryKey: [APPROVAL_ACTION_ENDPOINTS.UPCOMING] });
      queryClient.invalidateQueries({ queryKey: [APPROVAL_ACTION_ENDPOINTS.ONGOING] });
      queryClient.invalidateQueries({ queryKey: [APPROVAL_ACTION_ENDPOINTS.HISTORY] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal menyetujui pengajuan");
    },
  });

  return {
    approve: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useRejectRequest(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, notes }: { id: number | string; notes: string }) =>
      approvalActionService.reject(id, notes),
    onSuccess: () => {
      toast.success("Pengajuan telah ditolak");
      // Invalidate all approval lists
      queryClient.invalidateQueries({ queryKey: [APPROVAL_ACTION_ENDPOINTS.PENDING] });
      queryClient.invalidateQueries({ queryKey: [APPROVAL_ACTION_ENDPOINTS.UPCOMING] });
      queryClient.invalidateQueries({ queryKey: [APPROVAL_ACTION_ENDPOINTS.ONGOING] });
      queryClient.invalidateQueries({ queryKey: [APPROVAL_ACTION_ENDPOINTS.HISTORY] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal menolak pengajuan");
    },
  });

  return {
    reject: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}


