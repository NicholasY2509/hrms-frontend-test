import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { systemSettingsService } from "../services/system-settings"
import { toast } from "sonner"

export function useSystemSettings(group: string) {
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ["system-settings", group],
    queryFn: () => systemSettingsService.getSettingsByGroup(group),
  })

  const updateMutation = useMutation({
    mutationFn: (settings: Record<string, string | number>) =>
      systemSettingsService.updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-settings", group] })
      toast.success("Pengaturan berhasil disimpan")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menyimpan pengaturan")
    },
  })

  return {
    settings: data?.data || [],
    isLoading,
    isError,
    updateSettings: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  }
}
