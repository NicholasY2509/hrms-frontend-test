import { useQuery } from '@tanstack/react-query';
import { groupService } from '../services/group-service';
import { APPROVAL_GROUP_ENDPOINTS } from '../endpoints';

const EMPTY_ARRAY: any[] = [];

export function useApprovalGroups(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [APPROVAL_GROUP_ENDPOINTS.LIST, params],
    queryFn: () => groupService.getGroups(params),
  });

  return {
    items: data?.data || EMPTY_ARRAY,
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useApprovalGroupDetail(id?: number) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: id ? [APPROVAL_GROUP_ENDPOINTS.DETAIL(id)] : [],
    queryFn: () => (id ? groupService.getGroupDetail(id) : null),
    enabled: !!id,
  });

  return {
    group: data?.data,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

