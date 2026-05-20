import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ATTENDANCE_LOCATION_ENDPOINTS } from "../endpoints";
import { locationService } from "../services/location-service";
import { AttendanceLocationFormValues } from "../schemas/attendance-location.schema";

export function useAttendanceLocationList(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [ATTENDANCE_LOCATION_ENDPOINTS.LIST, params],
    queryFn: () => locationService.getLocations(params),
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useWorkLocationList() {
  const { data, error, isLoading } = useQuery({
    queryKey: [ATTENDANCE_LOCATION_ENDPOINTS.WORK_LOCATIONS],
    queryFn: () => locationService.getWorkLocations(),
  });

  return {
    items: data?.data || [],
    isLoading,
    isError: error,
  };
}

export function useCreateAttendanceLocation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: AttendanceLocationFormValues) => locationService.createLocation(data),
    onSuccess: () => {
      toast.success("Lokasi absensi berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_LOCATION_ENDPOINTS.LIST] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menambahkan lokasi absensi");
    },
  });

  return {
    createAttendanceLocation: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useUpdateAttendanceLocation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: AttendanceLocationFormValues }) =>
      locationService.updateLocation(id, data),
    onSuccess: () => {
      toast.success("Lokasi absensi berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_LOCATION_ENDPOINTS.LIST] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui lokasi absensi");
    },
  });

  return {
    updateAttendanceLocation: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useDeleteAttendanceLocation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string | number) => locationService.deleteLocation(id),
    onSuccess: () => {
      toast.success("Lokasi absensi berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_LOCATION_ENDPOINTS.LIST] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menghapus lokasi absensi");
    },
  });

  return {
    deleteAttendanceLocation: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}
