import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RESIGNATION_ENDPOINTS } from "../endpoints";
import { resignationService } from "../services";
import { toast } from "sonner";

export function useResignationList(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [RESIGNATION_ENDPOINTS.PORTAL.MANAGEMENT.LIST, params],
    queryFn: () => resignationService.getList(params),
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useResignationDetail(id: string | number) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [RESIGNATION_ENDPOINTS.PORTAL.MANAGEMENT.DETAIL(id)],
    queryFn: () => resignationService.getDetail(id),
    enabled: !!id,
  });

  return {
    item: data?.data,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useCreateResignation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: any) => resignationService.create(data),
    onSuccess: () => {
      toast.success("Permohonan pengunduran diri berhasil dikirim");
      queryClient.invalidateQueries({
        queryKey: [RESIGNATION_ENDPOINTS.PORTAL.MANAGEMENT.LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [RESIGNATION_ENDPOINTS.PORTAL.EMPLOYEE.LIST],
      });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Gagal mengirim permohonan"
      );
    },
  });

  return {
    createResignation: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useMyResignationList() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [RESIGNATION_ENDPOINTS.PORTAL.EMPLOYEE.LIST],
    queryFn: () => resignationService.getMyList(),
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useSettleResignation(id: string | number, options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (effectiveDate?: string) => resignationService.settle(id, effectiveDate),
    onSuccess: () => {
      toast.success("Pengunduran diri berhasil diselesaikan");
      queryClient.invalidateQueries({ queryKey: [RESIGNATION_ENDPOINTS.PORTAL.MANAGEMENT.LIST] });
      queryClient.invalidateQueries({ queryKey: [RESIGNATION_ENDPOINTS.PORTAL.MANAGEMENT.DETAIL(id)] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal menyelesaikan pengunduran diri");
    },
  });

  return {
    settleResignation: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useExportResignation(id: string | number, options?: { onSuccess?: () => void }) {
  const mutation = useMutation({
    mutationFn: () => resignationService.export(id),
    onSuccess: (data: any) => {
      toast.info(data.message || "Permintaan cetak surat sedang diproses");
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal memproses permintaan cetak");
    }
  });

  return {
    exportResignation: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}
