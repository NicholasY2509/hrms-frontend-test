import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { APPROVAL_POLICY_ENDPOINTS } from '../endpoints';
import { policyService } from '../services/policy-service';
import { PolicyFormValues } from '../schemas/policy-schema';

export function usePolicies(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [APPROVAL_POLICY_ENDPOINTS.LIST, params],
    queryFn: () => policyService.getPolicies(params),
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

