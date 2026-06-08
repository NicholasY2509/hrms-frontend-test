import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { employeeService } from "../services/employee-service"
import { EMPLOYEE_ENDPOINTS } from "../endpoints"
import { EmployeeSummary } from "../types"

export function useEmployees(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [EMPLOYEE_ENDPOINTS.SEARCH, params],
    queryFn: () => employeeService.getEmployees(params),
  })

  return {
    employees: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  }
}

export function useSupervisors(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [EMPLOYEE_ENDPOINTS.SUPERVISORS_SEARCH, params],
    queryFn: () => employeeService.getSupervisors(params),
  })

  return {
    supervisors: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  }
}

export function useManagementEmployees(params?: {
  search?: string
  page?: number
  per_page?: number
  department_id?: number | string
  team_id?: number | string
  work_location_id?: number | string
  work_position_id?: number | string
  work_employee_status_id?: number | string
  employee_status_id?: number | string
}) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [EMPLOYEE_ENDPOINTS.PORTAL.MANAGEMENT.LIST, params],
    queryFn: () => employeeService.getManagementEmployees(params),
  })

  return {
    employees: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  }
}

export function useManagementEmployeeSummary() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: [EMPLOYEE_ENDPOINTS.PORTAL.MANAGEMENT.SUMMARY],
    queryFn: () => employeeService.getSummary(),
  })

  const rawData = data?.data
  const summaryArray = Array.isArray(rawData)
    ? rawData
    : (rawData as any)?.summary
      ? (rawData as any).summary
      : Object.values(rawData || {})

  return {
    summary: (summaryArray || []) as EmployeeSummary[],
    isLoading: isLoading || isFetching,
    refetch,
  }
}

export function useSuspenseManagementEmployeeSummary() {
  const { data, refetch } = useSuspenseQuery({
    queryKey: [EMPLOYEE_ENDPOINTS.PORTAL.MANAGEMENT.SUMMARY],
    queryFn: () => employeeService.getSummary(),
  })

  const rawData = data?.data
  const summaryArray = Array.isArray(rawData)
    ? rawData
    : (rawData as any)?.summary
      ? (rawData as any).summary
      : Object.values(rawData || {})

  return {
    summary: (summaryArray || []) as EmployeeSummary[],
    refetch,
  }
}

export function useEmployeeStatuses({ params = {}, enabled = true } = {}) {
  const { data, isLoading } = useQuery({
    queryKey: [EMPLOYEE_ENDPOINTS.CONFIG.EMPLOYEE_STATUSES.LIST, params],
    queryFn: () => employeeService.getStatuses(),
    enabled,
  })

  return {
    items: data?.data || [],
    isLoading,
  }
}

export function useGenerateNik(workPositionId?: number) {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: [
      EMPLOYEE_ENDPOINTS.PORTAL.MANAGEMENT.GENERATE_NIK,
      workPositionId,
    ],
    queryFn: () => employeeService.generateNik(workPositionId!),
    enabled: !!workPositionId,
  })

  return {
    nik: data?.data?.employee_id_number,
    isLoading: isLoading || isFetching,
    refetch,
  }
}
