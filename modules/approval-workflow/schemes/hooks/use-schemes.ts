import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { APPROVAL_SCHEME_ENDPOINTS } from '../endpoints';
import { schemeService } from '../services/scheme-service';
import { ApprovalScheme } from '../types';

const EMPTY_ARRAY: ApprovalScheme[] = [];

export function useApprovalSchemes(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [APPROVAL_SCHEME_ENDPOINTS.LIST, params],
    queryFn: () => schemeService.getSchemes(params),
  });

  return {
    items: data?.data || EMPTY_ARRAY,
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useApprovalSchemeDetail(id?: number | string) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: id ? [APPROVAL_SCHEME_ENDPOINTS.DETAIL(id)] : [],
    queryFn: () => (id ? schemeService.getSchemeDetail(id) : null),
    enabled: !!id,
  });

  return {
    scheme: data?.data,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}