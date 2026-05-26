import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { unpaidLeaveService } from "../services/unpaid-leave-service";
import { UNPAID_LEAVE_ENDPOINTS } from "../endpoints";
import { toast } from "sonner";
import { UnpaidLeaveFormValues, UnpaidLeaveManagementFormValues } from "../schemas/unpaid-leave-schema";
/**
 * PORTAL - EMPLOYEE CONTEXT
 */
export function useUnpaidLeaveList(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [UNPAID_LEAVE_ENDPOINTS.PORTAL.EMPLOYEE.LIST, params],
    queryFn: () => unpaidLeaveService.portal.employee.getList(params),
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useUnpaidLeaveDetail(id: string | number | null) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: id ? [UNPAID_LEAVE_ENDPOINTS.PORTAL.EMPLOYEE.DETAIL(id)] : [],
    queryFn: () => (id ? unpaidLeaveService.portal.employee.getDetail(id) : null),
    enabled: !!id,
  });

  return {
    item: data?.data,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

/**
 * PORTAL - MANAGEMENT CONTEXT
 */
export function useUnpaidLeaveManagementList(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [UNPAID_LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.LIST, params],
    queryFn: () => unpaidLeaveService.portal.management.getList(params),
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useUnpaidLeaveManagementDetail(id: string | number | null) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: id ? [UNPAID_LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.DETAIL(id)] : [],
    queryFn: () => (id ? unpaidLeaveService.portal.management.getDetail(id) : null),
    enabled: !!id,
  });

  return {
    item: data?.data,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useUnpaidLeaveCalendar(params: { start_date: string; end_date: string; [key: string]: any }) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [UNPAID_LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.CALENDAR, params],
    queryFn: () => unpaidLeaveService.portal.management.getCalendar(params),
    enabled: !!params.start_date && !!params.end_date,
  });

  return {
    data: data?.data,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

/**
 * CONFIGURATION CONTEXT
 */
export function useUnpaidLeaveTypes() {
  const { data, error, isLoading } = useQuery({
    queryKey: [UNPAID_LEAVE_ENDPOINTS.CONFIG.TYPES],
    queryFn: () => unpaidLeaveService.portal.management.getTypes(),
  });

  return {
    items: data?.data || [],
    isLoading,
    isError: error,
  };
}

// --- MUTATIONS ---

export function useCreateUnpaidLeave(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: UnpaidLeaveFormValues) =>
      unpaidLeaveService.portal.employee.create(values),
    onSuccess: () => {
      toast.success("Pengajuan cuti berhasil dikirim");
      queryClient.invalidateQueries({
        queryKey: [UNPAID_LEAVE_ENDPOINTS.PORTAL.EMPLOYEE.LIST],
      });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Gagal mengirim pengajuan cuti";
      toast.error(message);
    },
  });

  return {
    createUnpaidLeave: (values: UnpaidLeaveFormValues) =>
      mutation.mutateAsync(values),
    isLoading: mutation.isPending,
  };
}

export function useCreateUnpaidLeaveManagement(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: UnpaidLeaveManagementFormValues) =>
      unpaidLeaveService.portal.management.create(values),
    onSuccess: () => {
      toast.success("Pengajuan cuti berhasil dibuat");
      queryClient.invalidateQueries({
        queryKey: [UNPAID_LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.LIST],
      });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Gagal membuat pengajuan cuti";
      toast.error(message);
    },
  });

  return {
    createUnpaidLeave: (values: UnpaidLeaveManagementFormValues) =>
      mutation.mutateAsync(values),
    isLoading: mutation.isPending,
  };
}

