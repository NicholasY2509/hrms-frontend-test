import { useQuery } from '@tanstack/react-query';
import { supervisorService } from '../services/supervisor-service';
import { SUPERVISOR_ENDPOINTS } from '../endpoints';

export function useSupervisors({ params = {}, enabled = true } = {}) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [SUPERVISOR_ENDPOINTS.PORTAL.MANAGEMENT.LIST, params],
    queryFn: () => supervisorService.getSupervisors(params),
    enabled,
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}
