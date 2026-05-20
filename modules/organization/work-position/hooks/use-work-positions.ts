import { useQuery } from '@tanstack/react-query';
import { WORK_POSITIONS_ENDPOINTS } from '../endpoints';
import { workPositionService } from '../services';

export function useWorkPositions({ params = {}, enabled = true } = {}) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [WORK_POSITIONS_ENDPOINTS.LIST, params],
    queryFn: () => workPositionService.getWorkPositions(params),
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

export function useWorkPositionDetail(id: string | number, enabled = true) {
  const { data, error, isLoading } = useQuery({
    queryKey: [WORK_POSITIONS_ENDPOINTS.DETAIL(id)],
    queryFn: () => workPositionService.getDetail(id),
    enabled: !!id && enabled,
  });

  return {
    position: data?.data,
    isLoading,
    isError: error,
  };
}
