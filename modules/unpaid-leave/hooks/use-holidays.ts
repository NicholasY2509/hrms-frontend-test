import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { holidayService } from "../services/holiday-service";
import { UNPAID_LEAVE_ENDPOINTS } from "../endpoints";
import { HolidayFormValues } from "../schemas/holiday-schema";
import { toast } from "sonner";

export function useHolidayList(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [UNPAID_LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.HOLIDAYS.LIST, params],
    queryFn: () => holidayService.getList(params),
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useHolidayMutation() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (values: HolidayFormValues) => holidayService.create(values),
    onSuccess: () => {
      toast.success("Hari libur berhasil ditambahkan");
      queryClient.invalidateQueries({
        queryKey: [UNPAID_LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.HOLIDAYS.LIST],
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal menambahkan hari libur");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string | number; values: HolidayFormValues }) =>
      holidayService.update(id, values),
    onSuccess: () => {
      toast.success("Hari libur berhasil diperbarui");
      queryClient.invalidateQueries({
        queryKey: [UNPAID_LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.HOLIDAYS.LIST],
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal memperbarui hari libur");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => holidayService.delete(id),
    onSuccess: () => {
      toast.success("Hari libur berhasil dihapus");
      queryClient.invalidateQueries({
        queryKey: [UNPAID_LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.HOLIDAYS.LIST],
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal menghapus hari libur");
    },
  });

  return {
    createHoliday: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateHoliday: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteHoliday: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export function useAutoInsertSundays() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { start_date: string; end_date: string }) => holidayService.autoInsertSundays(data),
    onSuccess: (data) => {
      toast.success(data.message || "Berhasil menghasilkan hari Minggu otomatis");
      queryClient.invalidateQueries({
        queryKey: [UNPAID_LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.HOLIDAYS.LIST],
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal menghasilkan hari Minggu");
    },
  });

  return {
    autoInsertSundays: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}
