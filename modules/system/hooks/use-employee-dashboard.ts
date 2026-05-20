import { useQuery } from "@tanstack/react-query";
import { SYSTEM_ENDPOINTS } from "../endpoints";
import { dashboardService } from "../services/dashboard-service";

export function useEmployeeDashboard() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [SYSTEM_ENDPOINTS.PORTAL.EMPLOYEE.DASHBOARD],
    queryFn: dashboardService.getEmployeeDashboard,
  });

  return {
    data: data?.data,
    isLoading,
    isError: !!error,
    mutate: refetch,
  };
}
