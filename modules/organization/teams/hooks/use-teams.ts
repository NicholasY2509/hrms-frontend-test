import { useQuery } from '@tanstack/react-query';
import { TEAMS_ENDPOINTS } from '../endpoints';
import { Team } from '../types';
import { teamService } from '../services';

export function useTeams({ params = {}, enabled = true } = {}) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [TEAMS_ENDPOINTS.LIST, params],
    queryFn: () => teamService.getTeams(params),
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

export function useTeamDetail(id: string | number | null, enabled = true) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [TEAMS_ENDPOINTS.DETAIL(id as any)],
    queryFn: () => teamService.getTeamDetail(id as any),
    enabled: !!id && enabled,
  });

  return {
    item: data?.data,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}
