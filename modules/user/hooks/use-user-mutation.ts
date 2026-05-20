import { useMutation, useQueryClient } from '@tanstack/react-query';
import { USER_ENDPOINTS } from '../endpoints';
import { userService } from '../services/user-service';
import { toast } from 'sonner';

export function useCreateUser(options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: any) => userService.create(data),
        onSuccess: () => {
            toast.success('Pengguna berhasil dibuat');
            queryClient.invalidateQueries({ queryKey: [USER_ENDPOINTS.PORTAL.MANAGEMENT.LIST] });
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Gagal membuat pengguna');
        },
    });

    return {
        createUser: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
}

export function useUpdateUser(options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, data }: { id: number | string; data: any }) =>
            userService.update(id, data),
        onSuccess: () => {
            toast.success('Pengguna berhasil diperbarui');
            queryClient.invalidateQueries({ queryKey: [USER_ENDPOINTS.PORTAL.MANAGEMENT.LIST] });
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Gagal memperbarui pengguna');
        },
    });

    return {
        updateUser: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
}

export function useDeleteUser() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (id: number | string) => userService.delete(id),
        onSuccess: () => {
            toast.success('Pengguna berhasil dihapus');
            queryClient.invalidateQueries({ queryKey: [USER_ENDPOINTS.PORTAL.MANAGEMENT.LIST] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Gagal menghapus pengguna');
        },
    });

    return {
        deleteUser: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
}