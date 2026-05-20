import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ATTENDANCE_USER_ENDPOINTS } from "../endpoints";
import { userService } from "../services/user-service";
import { AttendanceUserFormValues } from "../schemas/attendance-user.schema";

export function useAttendanceUserList(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [ATTENDANCE_USER_ENDPOINTS.LIST, params],
    queryFn: () => userService.getUsers(params),
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useCreateAttendanceUser(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: AttendanceUserFormValues) => userService.createUser(data),
    onSuccess: () => {
      toast.success("Pemetaan user absensi berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_USER_ENDPOINTS.LIST] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menambahkan pemetaan user absensi");
    },
  });

  return {
    createAttendanceUser: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useUpdateAttendanceUser(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: AttendanceUserFormValues }) =>
      userService.updateUser(id, data),
    onSuccess: () => {
      toast.success("Pemetaan user absensi berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_USER_ENDPOINTS.LIST] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui pemetaan user absensi");
    },
  });

  return {
    updateAttendanceUser: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useDeleteAttendanceUser(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string | number) => userService.deleteUser(id),
    onSuccess: () => {
      toast.success("Pemetaan user absensi berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_USER_ENDPOINTS.LIST] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menghapus pemetaan user absensi");
    },
  });

  return {
    deleteAttendanceUser: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}
