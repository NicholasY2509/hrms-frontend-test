import { useQuery } from '@tanstack/react-query';
import { requestTypeService } from '../services/request-type-service';
import { APPROVAL_REQUEST_TYPE_ENDPOINTS } from '../endpoints';

const EMPTY_ARRAY: any[] = [];

export function useApprovalRequestTypes(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [APPROVAL_REQUEST_TYPE_ENDPOINTS.LIST, params],
    queryFn: () => requestTypeService.getRequestTypes(params),
  });

  return {
    requestTypes: data?.data || EMPTY_ARRAY,
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}