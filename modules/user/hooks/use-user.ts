import { useQuery } from '@tanstack/react-query';
import { USER_ENDPOINTS } from '../endpoints';
import { userService } from '../services/user-service';

export function useUserList(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [USER_ENDPOINTS.PORTAL.MANAGEMENT.LIST, params],
    queryFn: () => userService.getList(params),
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}
