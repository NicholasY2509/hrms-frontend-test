import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { useActivityStore } from "@/hooks/use-activity-store";
import { ATTENDANCE_WORKING_HOUR_ENDPOINTS } from "../endpoints";
import { workingHourService } from "../services/working-hour-service";
import { ImportWorkingHourFormValues } from "../schemas/import-working-hour.schema";
import { WorkingHourFormValues } from "../schemas/working-hour.schema";

export function useWorkingHourList(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [ATTENDANCE_WORKING_HOUR_ENDPOINTS.LIST, params],
    queryFn: () => workingHourService.getSchedules(params),
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useMasterWorkingHourList(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [ATTENDANCE_WORKING_HOUR_ENDPOINTS.MASTER, params],
    queryFn: () => workingHourService.getMasterWorkingHours(params),
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useMasterWorkingHourDetail(id: string | number) {
  const { data, error, isLoading } = useQuery({
    queryKey: [ATTENDANCE_WORKING_HOUR_ENDPOINTS.MASTER_DETAIL(id)],
    queryFn: () => workingHourService.getMasterWorkingHourDetail(id!),
    enabled: !!id,
  });

  return {
    item: data?.data,
    isLoading,
    isError: error,
  };
}

export function useImportWorkingHour(options?: { onSuccess?: (data: any) => void }) {
  const addActivity = useActivityStore((state) => state.addActivity);

  const mutation = useMutation({
    mutationFn: (data: ImportWorkingHourFormValues) => {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("month", format(data.month, "yyyy-MM"));
      formData.append("upload_type", data.upload_type);
      if (data.day_type) {
        formData.append("day_type", data.day_type);
      }
      return workingHourService.importWorkingHours(formData);
    },
    onSuccess: (data: any) => {
      if (data?.data?.task_id) {
        addActivity(data.data.task_id, {
          name: data.data.message || "Import Jam Kerja",
          type: "general",
        });
      }
      toast.info("Import Berjalan di latar belakang");
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal mengimpor jam kerja");
    },
  });

  return {
    importWorkingHour: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useCreateMasterWorkingHour(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: WorkingHourFormValues) => workingHourService.createMasterWorkingHour(data),
    onSuccess: () => {
      toast.success("Jam kerja berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_WORKING_HOUR_ENDPOINTS.MASTER] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menambahkan jam kerja");
    },
  });

  return {
    createMasterWorkingHour: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useUpdateMasterWorkingHour(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: WorkingHourFormValues }) =>
      workingHourService.updateMasterWorkingHour(id, data),
    onSuccess: () => {
      toast.success("Jam kerja berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_WORKING_HOUR_ENDPOINTS.MASTER] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui jam kerja");
    },
  });

  return {
    updateMasterWorkingHour: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useDeleteMasterWorkingHour(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => workingHourService.deleteMasterWorkingHour(id),
    onSuccess: () => {
      toast.success("Jam kerja berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_WORKING_HOUR_ENDPOINTS.MASTER] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menghapus jam kerja");
    },
  });

  return {
    deleteMasterWorkingHour: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useUpdateAttendanceWorkingHour(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { working_hour_id: number; attendance_at: string } }) =>
      workingHourService.updateAttendanceWorkingHour(id, data),
    onSuccess: () => {
      toast.success("Jadwal kerja berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_WORKING_HOUR_ENDPOINTS.LIST] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui jadwal kerja");
    },
  });

  return {
    updateAttendanceWorkingHour: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

