import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { careerService } from "../services";
import { CAREER_ENDPOINTS } from "../endpoints";
import { CareerTransitionRequest } from "../types";

export function useCareerList({ params = {}, enabled = true } = {}) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [CAREER_ENDPOINTS.PORTAL.MANAGEMENT.LIST, params],
    queryFn: () => careerService.getCareers(params),
    enabled,
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    mutate: refetch,
  };
}

export function useCareerTypes({ params = {}, enabled = true } = {}) {
  const { data, isLoading } = useQuery({
    queryKey: [CAREER_ENDPOINTS.CONFIG.CAREER_TYPES.LIST, params],
    queryFn: () => careerService.getCareerTypes(),
    enabled,
  });

  return {
    items: data?.data || [],
    isLoading,
  };
}

export function useCareerDetail(id: string | number, { enabled = true } = {}) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [CAREER_ENDPOINTS.PORTAL.MANAGEMENT.DETAIL(id)],
    queryFn: () => careerService.getCareerDetail(id),
    enabled: !!id && enabled,
  });

  return {
    item: data?.data,
    isLoading,
    isError,
    mutate: refetch,
  };
}

