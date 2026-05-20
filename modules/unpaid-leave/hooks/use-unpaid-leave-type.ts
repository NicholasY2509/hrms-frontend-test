import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { unpaidLeaveService } from "../services/unpaid-leave-service";
import { UNPAID_LEAVE_ENDPOINTS } from "../endpoints";
import { UnpaidLeaveTypeFormValues } from "../schemas/unpaid-leave-type-schema";
import { toast } from "sonner";

export function useUnpaidLeaveTypeList() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [UNPAID_LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.TYPES],
    queryFn: () => unpaidLeaveService.portal.management.getTypes(),
  });

  return {
    items: data?.data || [],
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useUnpaidLeaveTypeMutation() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (values: UnpaidLeaveTypeFormValues) =>
      unpaidLeaveService.portal.management.createType(values),
    onSuccess: () => {
      toast.success("Tipe izin berhasil ditambahkan");
      queryClient.invalidateQueries({
        queryKey: [UNPAID_LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.TYPES],
      });
    },
    onError: () => {
      toast.error("Gagal menambahkan tipe izin");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string | number;
      values: UnpaidLeaveTypeFormValues;
    }) => unpaidLeaveService.portal.management.updateType(id, values),
    onSuccess: () => {
      toast.success("Tipe izin berhasil diperbarui");
      queryClient.invalidateQueries({
        queryKey: [UNPAID_LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.TYPES],
      });
    },
    onError: () => {
      toast.error("Gagal memperbarui tipe izin");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) =>
      unpaidLeaveService.portal.management.deleteType(id),
    onSuccess: () => {
      toast.success("Tipe izin berhasil dihapus");
      queryClient.invalidateQueries({
        queryKey: [UNPAID_LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.TYPES],
      });
    },
    onError: () => {
      toast.error("Gagal menghapus tipe izin");
    },
  });

  return {
    createType: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateType: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteType: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
