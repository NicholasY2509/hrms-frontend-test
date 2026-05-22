import { useQuery } from "@tanstack/react-query"
import { shiftExchangeService } from "../services/shift-exchange-service"
import { SHIFT_EXCHANGE_ENDPOINTS } from "../endpoints"

export function useShiftExchangeList(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [SHIFT_EXCHANGE_ENDPOINTS.PORTAL.EMPLOYEE.LIST, params],
    queryFn: () => shiftExchangeService.getList(params),
  })

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  }
}

export function useShiftExchangeDetail(id: number) {
  const { data, error, isLoading } = useQuery({
    queryKey: [SHIFT_EXCHANGE_ENDPOINTS.PORTAL.EMPLOYEE.DETAIL(id)],
    queryFn: () => shiftExchangeService.getDetail(id!),
  })

  return {
    item: data?.data,
    isLoading,
    isError: error,
  }
}

export function useShiftExchangeWorkingHour(
  date?: string | null,
  employeeId?: number
) {
  const { data, isLoading, isError } = useQuery({
    queryKey: [
      SHIFT_EXCHANGE_ENDPOINTS.PORTAL.EMPLOYEE.WORKING_HOUR,
      date,
      employeeId,
    ],
    queryFn: () =>
      shiftExchangeService.getWorkingHour({
        date: date!.substring(0, 10),
        employee_id: employeeId,
      }),
    enabled: !!date && date.length >= 10,
  })

  return {
    data: data?.data,
    isLoading,
    isError,
  }
}
