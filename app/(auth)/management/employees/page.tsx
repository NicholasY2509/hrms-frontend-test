import { Metadata } from "next"
import { EmployeeManagementClient } from "./components/employee-management-client"
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import { employeeService } from "@/modules/employee/employee/services/employee-service"
import { EMPLOYEE_ENDPOINTS } from "@/modules/employee/employee/endpoints"

export const metadata: Metadata = {
  title: "Data Karyawan",
  description: "Kelola dan pantau data profil seluruh karyawan.",
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function EmployeeManagementPage({ searchParams }: PageProps) {
  const queryClient = new QueryClient()
  const params = await searchParams

  const defaultParams = {
    page: Number(params.page) || 1,
    per_page: Number(params.per_page) || 15,
    search: (params.search as string) || "",
    department_id: params.department_id ? Number(params.department_id) : null,
    team_id: params.team_id ? Number(params.team_id) : null,
    location_id: params.location_id ? Number(params.location_id) : null,
    position_id: params.position_id ? Number(params.position_id) : null,
    work_status_id: (params.work_status_id as string) || "all",
    employee_status_id: (params.employee_status_id as string) || "all",
  }

  await queryClient.prefetchQuery({
    queryKey: [EMPLOYEE_ENDPOINTS.PORTAL.MANAGEMENT.LIST, defaultParams],
    queryFn: () => employeeService.getManagementEmployees(defaultParams),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EmployeeManagementClient />
    </HydrationBoundary>
  )
}
