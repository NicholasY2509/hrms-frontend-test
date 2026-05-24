import { useQuery } from '@tanstack/react-query';
import { CHART_ENDPOINTS } from '../endpoints';
import { chartService } from '../services';

export function useOrgChart() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [CHART_ENDPOINTS.CONFIG.ORG_CHART],
    queryFn: () => chartService.getOrgChart(),
  });

  return {
    data: data?.data, // Assuming ApiResponse returns data in the 'data' property
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function usePositionEmployees(positionId: string | null) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [CHART_ENDPOINTS.CONFIG.EMPLOYEES(positionId || '')],
    queryFn: () => chartService.getEmployeesByPosition(positionId!),
    enabled: !!positionId,
  });

  return {
    employees: data?.data || [],
    isLoading,
    isError: error,
    mutate: refetch,
  };
}
