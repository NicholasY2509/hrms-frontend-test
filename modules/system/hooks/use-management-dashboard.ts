import { useQuery } from "@tanstack/react-query";
import { SYSTEM_ENDPOINTS } from "../endpoints";
import { dashboardService } from "../services/dashboard-service";

export function useManagementDashboard() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [SYSTEM_ENDPOINTS.PORTAL.MANAGEMENT.DASHBOARD],
    queryFn: dashboardService.getManagementDashboard,
  });

  return {
    data: data?.data,
    isLoading,
    isError: !!error,
    mutate: refetch,
  };
}
