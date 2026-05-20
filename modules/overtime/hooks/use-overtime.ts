import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { overtimeService } from "../services";
import { OVERTIME_ENDPOINTS } from "../endpoints";
import { toast } from "sonner";
import { OvertimeFormValues } from "../types";

export function useOvertimeEmployeeList(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [OVERTIME_ENDPOINTS.PORTAL.EMPLOYEE.LIST, params],
    queryFn: () => overtimeService.portal.employee.getList(params),
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useOvertimeEmployeeDetail(id: string | number | null) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: id ? [OVERTIME_ENDPOINTS.PORTAL.EMPLOYEE.DETAIL(id)] : [],
    queryFn: () => (id ? overtimeService.portal.employee.getDetail(id) : null),
    enabled: !!id,
  });

  return {
    item: data?.data,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useOvertimeManagementList(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [OVERTIME_ENDPOINTS.PORTAL.MANAGEMENT.LIST, params],
    queryFn: () => overtimeService.portal.management.getList(params),
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useOvertimeManagementDetail(id: string | number | null) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: id ? [OVERTIME_ENDPOINTS.PORTAL.MANAGEMENT.DETAIL(id)] : [],
    queryFn: () => (id ? overtimeService.portal.management.getDetail(id) : null),
    enabled: !!id,
  });

  return {
    item: data?.data,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useCreateOvertime(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: OvertimeFormValues) =>
      overtimeService.portal.employee.create(data),
    onSuccess: (response) => {
      toast.success(response.message || "Pengajuan lembur berhasil dibuat");
      queryClient.invalidateQueries({
        queryKey: [OVERTIME_ENDPOINTS.PORTAL.EMPLOYEE.LIST],
      });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Gagal membuat pengajuan lembur"
      );
    },
  });

  return {
    createOvertime: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useOvertimeTypes() {
  const { data, error, isLoading } = useQuery({
    queryKey: [OVERTIME_ENDPOINTS.CONFIG.TYPES],
    queryFn: () => overtimeService.config.getTypes(),
  });

  return {
    items: data?.data || [],
    isLoading,
    isError: error,
  };
}

export function useOvertimeManagementTypes() {
  const { data, error, isLoading } = useQuery({
    queryKey: [OVERTIME_ENDPOINTS.PORTAL.MANAGEMENT.TYPES],
    queryFn: () => overtimeService.portal.management.getTypes(),
  });

  return {
    items: data?.data || [],
    isLoading,
    isError: error,
  };
}

export function useUpdateOvertimeType(id: string | number, options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { overtime_type_id: number | string }) =>
      overtimeService.portal.management.update(id, data),
    onSuccess: (response) => {
      toast.success(response.message || "Tipe lembur berhasil diperbarui");
      queryClient.invalidateQueries({
        queryKey: [OVERTIME_ENDPOINTS.PORTAL.MANAGEMENT.DETAIL(id)],
      });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Gagal memperbarui tipe lembur"
      );
    },
  });

  return {
    updateOvertimeType: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useSettleOvertime(id: string | number, options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { real_overtime_price: number | string }) =>
      overtimeService.portal.management.settle(id, data),
    onSuccess: (response) => {
      toast.success(response.message || "Lembur berhasil disettle");
      queryClient.invalidateQueries({
        queryKey: [OVERTIME_ENDPOINTS.PORTAL.MANAGEMENT.DETAIL(id)],
      });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Gagal melakukan settle lembur"
      );
    },
  });

  return {
    settleOvertime: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useExportOvertime(options?: { onSuccess?: () => void }) {
  const mutation = useMutation({
    mutationFn: (params?: Record<string, any>) => overtimeService.portal.management.export(params),
    onSuccess: (data: any) => {
      toast.info(data.message || "Permintaan cetak laporan lembur sedang diproses");
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal memproses permintaan cetak");
    }
  });

  return {
    exportOvertime: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}
