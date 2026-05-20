import { useQuery } from "@tanstack/react-query";
import { leaveService } from "../services";
import { LEAVE_ENDPOINTS } from "../endpoints";

export function useAnnualLeaveList(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.ANNUAL_LEAVES, params],
    queryFn: () => leaveService.portal.management.getAnnualLeaves(params),
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}
