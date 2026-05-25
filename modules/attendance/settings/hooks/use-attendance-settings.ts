import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { attendanceSettingsService } from "../services/attendance-settings"
import { ATTENDANCE_SETTINGS_ENDPOINTS } from "../endpoints"
import { toast } from "sonner"

export function useAttendanceGeneralSettings() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [ATTENDANCE_SETTINGS_ENDPOINTS.GENERAL],
    queryFn: () => attendanceSettingsService.getGeneralSettings(),
  })

  return {
    settings: data?.data || [],
    isLoading,
    isError: error,
    mutate: refetch,
  }
}

export function useAttendanceCalculationSettings() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [ATTENDANCE_SETTINGS_ENDPOINTS.CALCULATION],
    queryFn: () => attendanceSettingsService.getCalculationSettings(),
  })

  return {
    settings: data?.data || [],
    isLoading,
    isError: error,
    mutate: refetch,
  }
}

export function useUpdateAttendanceSettings() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: Record<string, string | number>) =>
      attendanceSettingsService.updateSettings(data),
    onSuccess: () => {
      toast.success("Pengaturan berhasil diperbarui")
      queryClient.invalidateQueries({
        queryKey: [ATTENDANCE_SETTINGS_ENDPOINTS.GENERAL],
      })
      queryClient.invalidateQueries({
        queryKey: [ATTENDANCE_SETTINGS_ENDPOINTS.CALCULATION],
      })
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Gagal memperbarui pengaturan"
      )
    },
  })

  return {
    updateSettings: mutation.mutateAsync,
    isLoading: mutation.isPending,
  }
}
