import { useQuery } from "@tanstack/react-query";
import { ATTENDANCE_MOBILE_SCAN_ENDPOINTS } from "../endpoints";
import { mobileScanService } from "../services/mobile-scan-service";

export function useMobileScanList(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [ATTENDANCE_MOBILE_SCAN_ENDPOINTS.LIST, params],
    queryFn: () => mobileScanService.getMobileScans(params),
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}
