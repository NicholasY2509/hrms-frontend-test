import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../services/notification-service";
import { SYSTEM_ENDPOINTS } from "../endpoints";
import { toast } from "sonner";

export function useNotifications(params?: { unread_only?: boolean; page?: number; per_page?: number }) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [SYSTEM_ENDPOINTS.PORTAL.EMPLOYEE.NOTIFICATIONS.LIST, params],
    queryFn: () => notificationService.getNotifications(params),
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    refetch,
  };
}

export function useUnreadNotificationCount() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [SYSTEM_ENDPOINTS.PORTAL.EMPLOYEE.NOTIFICATIONS.UNREAD_COUNT],
    queryFn: () => notificationService.getUnreadCount(),
    // Refetch every 1 minute to keep it updated
    refetchInterval: 60000,
  });

  return {
    unreadCount: data?.data?.unread_count || 0,
    isLoading,
    isError: error,
    refetch,
  };
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [SYSTEM_ENDPOINTS.PORTAL.EMPLOYEE.NOTIFICATIONS.LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [SYSTEM_ENDPOINTS.PORTAL.EMPLOYEE.NOTIFICATIONS.UNREAD_COUNT],
      });
    },
  });

  return {
    markAsRead: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [SYSTEM_ENDPOINTS.PORTAL.EMPLOYEE.NOTIFICATIONS.LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [SYSTEM_ENDPOINTS.PORTAL.EMPLOYEE.NOTIFICATIONS.UNREAD_COUNT],
      });
      toast.success("Semua notifikasi ditandai telah dibaca");
    },
    onError: () => {
      toast.error("Gagal menandai semua notifikasi");
    },
  });

  return {
    markAllAsRead: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}
