import { useMutation, useQueryClient } from "@tanstack/react-query"
import { shiftExchangeService } from "../services/shift-exchange-service"
import { SHIFT_EXCHANGE_ENDPOINTS } from "../endpoints"
import { ShiftExchangeFormValues } from "../schemas"
import { toast } from "sonner"

export function useCreateShiftExchange(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: ShiftExchangeFormValues) =>
      shiftExchangeService.create(data),
    onSuccess: () => {
      toast.success("Berhasil membuat pengajuan tukar shift")
      queryClient.invalidateQueries({
        queryKey: [SHIFT_EXCHANGE_ENDPOINTS.PORTAL.EMPLOYEE.LIST],
      })
      options?.onSuccess?.()
    },
    onError: () => {
      toast.error("Gagal membuat pengajuan tukar shift")
    },
  })

  return {
    createShiftExchange: mutation.mutateAsync,
    isLoading: mutation.isPending,
  }
}
