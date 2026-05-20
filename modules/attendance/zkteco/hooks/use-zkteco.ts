import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useActivityStore } from "@/hooks/use-activity-store"
import { ATTENDANCE_ZKTECO_ENDPOINTS } from "../endpoints"
import { zktecoService } from "../services/zkteco-service"
import { ZktecoSyncFormValues } from "../schemas/zkteco-sync.schema"
import { ZktecoAttendanceSyncFormValues } from "../schemas/zkteco-attendance-sync.schema"

export function useZktecoMachines(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [ATTENDANCE_ZKTECO_ENDPOINTS.MACHINES, params],
    queryFn: () => zktecoService.getMachines(params),
  })

  return {
    machines: data?.data || [],
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isLoadingMachines: isLoading,
    isError: error,
    mutate: refetch,
  }
}

export function useZktecoAttendances(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [ATTENDANCE_ZKTECO_ENDPOINTS.ATTENDANCES, params],
    queryFn: () => zktecoService.getAttendances(params),
  })

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  }
}

export function useZktecoUsers(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [ATTENDANCE_ZKTECO_ENDPOINTS.USERS, params],
    queryFn: () => zktecoService.getUsers(params),
  })

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  }
}

export function useSyncZktecoUsers(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  const addActivity = useActivityStore((state) => state.addActivity)

  const mutation = useMutation({
    mutationFn: (values: ZktecoSyncFormValues) => {
      return zktecoService.syncUsers(values.zkteco_machine_id)
    },
    onSuccess: (data: any) => {
      if (data?.data?.task_id) {
        addActivity(data.data.task_id, {
          name: data.data.name || "Sinkronisasi User Fingerprint",
          type: "zkteco_user_sync",
        })
        toast.info("Proses sinkronisasi sedang berjalan di latar belakang")
      } else {
        toast.success("Sinkronisasi user fingerprint berhasil dimulai")
      }

      queryClient.invalidateQueries({
        queryKey: [ATTENDANCE_ZKTECO_ENDPOINTS.USERS],
      })
      options?.onSuccess?.()
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Gagal melakukan sinkronisasi user fingerprint"
      )
    },
  })

  return {
    syncZktecoUsers: mutation.mutateAsync,
    isLoading: mutation.isPending,
  }
}

export function useSyncZktecoAttendances(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  const addActivity = useActivityStore((state) => state.addActivity)

  const mutation = useMutation({
    mutationFn: (values: ZktecoAttendanceSyncFormValues) => {
      return zktecoService.syncAttendances(values)
    },
    onSuccess: (data: any) => {
      if (data?.data?.task_id) {
        addActivity(data.data.task_id, {
          name: data.data.name || "Sinkronisasi Absensi Fingerprint",
          type: "zkteco_attendance_sync",
        })
        toast.info("Proses sinkronisasi sedang berjalan di latar belakang")
      } else {
        toast.success("Sinkronisasi absensi fingerprint berhasil dimulai")
      }

      queryClient.invalidateQueries({
        queryKey: [ATTENDANCE_ZKTECO_ENDPOINTS.ATTENDANCES],
      })
      options?.onSuccess?.()
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Gagal melakukan sinkronisasi absensi fingerprint"
      )
    },
  })

  return {
    syncZktecoAttendances: mutation.mutateAsync,
    isLoading: mutation.isPending,
  }
}
