import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { leaveService } from "../services"
import { LEAVE_ENDPOINTS } from "../endpoints"
import { EMPLOYEE_ENDPOINTS } from "@/modules/employee/employee/endpoints"
import { AdjustAnnualLeaveFormValues } from "../schemas/adjust-annual-leave-schema"

export function useAdjustAnnualLeave(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({
      employeeId,
      data,
    }: {
      employeeId: string | number
      data: AdjustAnnualLeaveFormValues
    }) => leaveService.portal.management.adjustAnnualLeave(employeeId, data),
    onSuccess: (_, variables) => {
      toast.success("Hak cuti berhasil diubah")
      queryClient.invalidateQueries({
        queryKey: [LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.ANNUAL_LEAVES],
      })
      queryClient.invalidateQueries({
        queryKey: [
          EMPLOYEE_ENDPOINTS.PORTAL.MANAGEMENT.DETAIL(variables.employeeId),
        ],
      })
      options?.onSuccess?.()
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal mengubah hak cuti")
    },
  })

  return {
    adjustAnnualLeave: mutation.mutateAsync,
    isLoading: mutation.isPending,
  }
}
