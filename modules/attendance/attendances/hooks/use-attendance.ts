import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useActivityStore } from "@/hooks/use-activity-store"
import { ATTENDANCE_RECORD_ENDPOINTS } from "../endpoints"
import { attendanceService } from "../services/attendance-service"
import { ExportAttendanceFormValues } from "../schemas/export-attendance.schema"

export function useAttendanceList(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [ATTENDANCE_RECORD_ENDPOINTS.LIST, params],
    queryFn: () => attendanceService.getList(params),
  })

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  }
}

export function useExportAttendance(options?: { onSuccess?: () => void }) {
  const addActivity = useActivityStore((state) => state.addActivity)

  const mutation = useMutation({
    mutationFn: (values: ExportAttendanceFormValues) => {
      const payload = {
        type: values.report_type,
        format: values.format,
        start_date: values.start_date,
        end_date: values.end_date,
        employee_id: values.employee_id,
        department_id: values.department_id,
        team_id: values.team_id,
        attendance_status_id: values.attendance_status_id,
        work_location_id: values.work_location_id,
      }
      return attendanceService.exportAttendance(payload)
    },
    onSuccess: (data: any) => {
      if (data?.data?.task_id) {
        addActivity(data.data.task_id, {
          name: data.data.message || "Export Kehadiran",
          type: "report_generation",
        })
      }
      toast.info("Proses export sedang berjalan di latar belakang")
      options?.onSuccess?.()
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Gagal mengirim permintaan export"
      )
    },
  })

  return {
    exportAttendance: mutation.mutateAsync,
    isLoading: mutation.isPending,
  }
}

export function useCalculateAttendance(options?: { onSuccess?: () => void }) {
  const addActivity = useActivityStore((state) => state.addActivity)

  const mutation = useMutation({
    mutationFn: (values: { start_date: string; end_date: string }) => {
      return attendanceService.calculateAttendance(values)
    },
    onSuccess: (data: any, values) => {
      if (data?.data?.task_id) {
        addActivity(data.data.task_id, {
          name: `Kalkulasi Kehadiran (${values.start_date} - ${values.end_date})`,
          type: "attendance_calculation",
        })
      }
      toast.info("Kalkulasi kehadiran sedang berjalan di latar belakang")
      options?.onSuccess?.()
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Gagal melakukan kalkulasi kehadiran"
      )
    },
  })

  return {
    calculateAttendance: mutation.mutateAsync,
    isLoading: mutation.isPending,
  }
}

export function useEmployeeAttendanceHistory(params: {
  start_date: string
  end_date: string
}) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [ATTENDANCE_RECORD_ENDPOINTS.PORTAL.EMPLOYEE.HISTORY, params],
    queryFn: () => attendanceService.getEmployeeHistory(params),
    enabled: !!params.start_date && !!params.end_date,
  })

  return {
    records: data?.data?.records || [],
    summary: data?.data?.summary || [],
    isLoading,
    isError: error,
    mutate: refetch,
  }
}

export function useEmployeeAttendanceStatus(
  employeeId: number | null,
  params: { start_date: string; end_date: string }
) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [
      employeeId
        ? ATTENDANCE_RECORD_ENDPOINTS.PORTAL.MANAGEMENT.EMPLOYEE_STATUS(
            employeeId
          )
        : null,
      params,
    ],
    queryFn: () => attendanceService.getEmployeeStatus(employeeId!, params),
    enabled: !!employeeId && !!params.start_date && !!params.end_date,
  })

  return {
    records: data?.data || [],
    isLoading,
    isError: error,
    mutate: refetch,
  }
}

export function useUpdateAttendanceStatus(options?: {
  onSuccess?: () => void
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (values: {
      attendance_status_id: number
      attendance_id: number
    }) => {
      return attendanceService.updateAttendanceStatus(values)
    },
    onSuccess: (data: any) => {
      toast.success("Status kehadiran berhasil diubah")
      queryClient.invalidateQueries({
        queryKey: [ATTENDANCE_RECORD_ENDPOINTS.LIST],
      })
      options?.onSuccess?.()
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Gagal mengubah status kehadiran"
      )
    },
  })

  return {
    updateAttendanceStatus: mutation.mutateAsync,
    isLoading: mutation.isPending,
  }
}

export function useBatchUpdateAttendanceStatus(options?: {
  onSuccess?: () => void
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (values: {
      attendance_ids: number[]
      attendance_status_id: number
    }) => {
      return attendanceService.batchUpdateAttendanceStatus(values)
    },
    onSuccess: (data: any) => {
      toast.success("Status kehadiran massal berhasil diubah")
      queryClient.invalidateQueries({
        queryKey: [ATTENDANCE_RECORD_ENDPOINTS.LIST],
      })
      options?.onSuccess?.()
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Gagal mengubah status kehadiran massal"
      )
    },
  })

  return {
    batchUpdateAttendanceStatus: mutation.mutateAsync,
    isLoading: mutation.isPending,
  }
}
