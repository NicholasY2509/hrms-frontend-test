import { useQuery } from "@tanstack/react-query";
import { reportService } from "../services/report-service";
import { SYSTEM_ENDPOINTS } from "../endpoints";

export function useReportList(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [SYSTEM_ENDPOINTS.PORTAL.MANAGEMENT.REPORTS, params],
    queryFn: () => reportService.getPaginatedReports(params),
    refetchInterval: (query) => {
      const hasProcessing = query.state.data?.data.some(
        (report) => report.status === "processing" || report.status === "pending"
      );
      return hasProcessing ? 3000 : false;
    },
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}
