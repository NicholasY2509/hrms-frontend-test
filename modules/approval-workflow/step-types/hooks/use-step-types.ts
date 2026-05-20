import { useQuery } from '@tanstack/react-query';
import { stepTypeService } from '../services/step-type-service';
import { APPROVAL_STEP_TYPE_ENDPOINTS } from '../endpoints';

export function useApprovalStepTypes(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [APPROVAL_STEP_TYPE_ENDPOINTS.LIST, params],
    queryFn: () => stepTypeService.getStepTypes(params),
  });

  return {
    stepTypes: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}
