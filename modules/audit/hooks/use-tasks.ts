import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { AUDIT_ENDPOINTS } from "../endpoints"
import { taskService } from "../services/task.service"
import { TaskLogFilters } from "../types"
import { toast } from "sonner"

export function useTaskList(params?: TaskLogFilters) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [AUDIT_ENDPOINTS.CONFIG.TASKS, params],
    queryFn: () => taskService.getTasks(params),
  })

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  }
}

export function useClearQueue(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => taskService.clearQueue(),
    onSuccess: () => {
      toast.success("Antrean berhasil dibersihkan")
      queryClient.invalidateQueries({
        queryKey: [AUDIT_ENDPOINTS.CONFIG.TASKS],
      })
      options?.onSuccess?.()
    },
    onError: () => {
      toast.error("Gagal membersihkan antrean")
    },
  })

  return {
    clearQueue: mutation.mutateAsync,
    isLoading: mutation.isPending,
  }
}

export function useRestartQueue(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => taskService.restartQueue(),
    onSuccess: () => {
      toast.success("Worker antrean berhasil di-restart")
      queryClient.invalidateQueries({
        queryKey: [AUDIT_ENDPOINTS.CONFIG.TASKS],
      })
      options?.onSuccess?.()
    },
    onError: () => {
      toast.error("Gagal me-restart worker antrean")
    },
  })

  return {
    restartQueue: mutation.mutateAsync,
    isLoading: mutation.isPending,
  }
}
