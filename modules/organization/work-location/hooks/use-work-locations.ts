import { useQuery } from '@tanstack/react-query';
import { WORK_LOCATION_ENDPOINTS } from '../endpoints';
import { workLocationService } from '../services';

export function useWorkLocations({ params = {}, enabled = true } = {}) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [WORK_LOCATION_ENDPOINTS.LIST, params],
    queryFn: () => workLocationService.getList(params),
    enabled,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useWorkLocationDetail(id: string | number, enabled = true) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [WORK_LOCATION_ENDPOINTS.DETAIL(id)],
    queryFn: () => workLocationService.getDetail(id),
    enabled: !!id && enabled,
  });

  return {
    workLocation: data?.data,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}
