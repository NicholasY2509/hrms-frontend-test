import { useQuery } from "@tanstack/react-query";
import { ATTENDANCE_SHARED_ENDPOINTS } from "../endpoints";
import { sharedService } from "../services/shared-service";

export function useAttendanceStatuses() {
  const { data, isLoading, error } = useQuery({
    queryKey: [ATTENDANCE_SHARED_ENDPOINTS.STATUSES],
    queryFn: () => sharedService.getStatuses(),
  });

  return {
    items: data?.data || [],
    isLoading,
    isError: error,
  };
}
