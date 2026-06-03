import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { leaveService } from "../services";
import { LEAVE_ENDPOINTS } from "../endpoints";
import { ManualLogFormValues } from "../schemas/manual-log-schema";

export function useAnnualLeaveList(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.ANNUAL_LEAVES, params],
    queryFn: () => leaveService.portal.management.getAnnualLeaves(params),
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useCreateManualLog(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: any) => leaveService.portal.management.createManualLog(data),
    onSuccess: () => {
      toast.success("Berhasil membuat log cuti manual.");
      queryClient.invalidateQueries({
        queryKey: [LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.ANNUAL_LEAVES],
      });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Gagal membuat log cuti manual."
      );
    },
  });

  return {
    createManualLog: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}
