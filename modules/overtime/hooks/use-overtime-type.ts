import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { overtimeService } from "../services";
import { OVERTIME_ENDPOINTS } from "../endpoints";
import { OvertimeTypeFormValues } from "../schemas/type";
import { toast } from "sonner";

export function useOvertimeTypeList() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [OVERTIME_ENDPOINTS.PORTAL.MANAGEMENT.TYPES],
    queryFn: () => overtimeService.portal.management.getTypes(),
  });

  return {
    items: data?.data || [],
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useOvertimeTypeMutation() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (values: OvertimeTypeFormValues) =>
      overtimeService.portal.management.createType(values),
    onSuccess: () => {
      toast.success("Tipe lembur berhasil ditambahkan");
      queryClient.invalidateQueries({
        queryKey: [OVERTIME_ENDPOINTS.PORTAL.MANAGEMENT.TYPES],
      });
    },
    onError: () => {
      toast.error("Gagal menambahkan tipe lembur");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string | number;
      values: OvertimeTypeFormValues;
    }) => overtimeService.portal.management.updateType(id, values),
    onSuccess: () => {
      toast.success("Tipe lembur berhasil diperbarui");
      queryClient.invalidateQueries({
        queryKey: [OVERTIME_ENDPOINTS.PORTAL.MANAGEMENT.TYPES],
      });
    },
    onError: () => {
      toast.error("Gagal memperbarui tipe lembur");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) =>
      overtimeService.portal.management.deleteType(id),
    onSuccess: () => {
      toast.success("Tipe lembur berhasil dihapus");
      queryClient.invalidateQueries({
        queryKey: [OVERTIME_ENDPOINTS.PORTAL.MANAGEMENT.TYPES],
      });
    },
    onError: () => {
      toast.error("Gagal menghapus tipe lembur");
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
