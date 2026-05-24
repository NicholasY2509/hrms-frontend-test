import { useQuery } from "@tanstack/react-query";
import { AUDIT_ENDPOINTS } from "../endpoints";
import { taskService } from "../services/task.service";
import { TaskLogFilters } from "../types";

export function useTaskList(params?: TaskLogFilters) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [AUDIT_ENDPOINTS.CONFIG.TASKS, params],
    queryFn: () => taskService.getTasks(params),
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}
