import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { warningLetterService } from "../services/warning-letter-service";
import { WARNING_LETTER_ENDPOINTS } from "../endpoints";

export function useWarningLetterList(params: Record<string, any> = {}, enabled = true) {
  const { data, isLoading } = useQuery({
    queryKey: [WARNING_LETTER_ENDPOINTS.PORTAL.MANAGEMENT.LIST, params],
    queryFn: () => warningLetterService.getList(params),
    enabled,
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
  };
}


export function useWarningLetterTypes({ params = {}, enabled = true } = {}) {
  const { data, isLoading } = useQuery({
    queryKey: [WARNING_LETTER_ENDPOINTS.CONFIG.LIST, params],
    queryFn: () => warningLetterService.getTypes(),
    enabled,
  });

  return {
    items: data?.data || [],
    isLoading,
  };
}

export function useWarningLetterDetail(id: string | number, { enabled = true } = {}) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [WARNING_LETTER_ENDPOINTS.PORTAL.MANAGEMENT.DETAIL(id)],
    queryFn: () => warningLetterService.getDetail(id),
    enabled: !!id && enabled,
  });

  return {
    item: data?.data,
    isLoading,
    isError,
    mutate: refetch,
  };
}

export function useWarningLetterEmployeeList(params: Record<string, any> = {}, enabled = true) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [WARNING_LETTER_ENDPOINTS.PORTAL.EMPLOYEE.LIST, params],
    queryFn: () => warningLetterService.portal.employee.getList(params),
    enabled,
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    mutate: refetch,
  };
}

export function useWarningLetterEmployeeDetail(id: string | number | null, { enabled = true } = {}) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: id ? [WARNING_LETTER_ENDPOINTS.PORTAL.EMPLOYEE.DETAIL(id)] : [],
    queryFn: () => (id ? warningLetterService.portal.employee.getDetail(id) : null),
    enabled: !!id && enabled,
  });

  return {
    item: data?.data,
    isLoading,
    isError,
    mutate: refetch,
  };
}
