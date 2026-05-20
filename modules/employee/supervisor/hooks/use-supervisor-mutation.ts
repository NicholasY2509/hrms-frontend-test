import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supervisorService } from '../services/supervisor-service';
import { toast } from 'sonner';
import { SUPERVISOR_ENDPOINTS } from '../endpoints';

export function useCreateSupervisor(options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: { employee_id: number }) => supervisorService.create(data),
        onSuccess: () => {
            toast.success('Atasan berhasil ditambahkan');
            queryClient.invalidateQueries({ queryKey: [SUPERVISOR_ENDPOINTS.PORTAL.MANAGEMENT.LIST] });
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Gagal menambahkan atasan');
        },
    });

    return {
        createSupervisor: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
}

export function useUpdateSupervisor(options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, data }: { id: number | string; data: { employee_id: number } }) =>
            supervisorService.update(id, data),
        onSuccess: () => {
            toast.success('Atasan berhasil diperbarui');
            queryClient.invalidateQueries({ queryKey: [SUPERVISOR_ENDPOINTS.PORTAL.MANAGEMENT.LIST] });
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Gagal memperbarui atasan');
        },
    });

    return {
        updateSupervisor: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
}

export function useDeleteSupervisor(options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (id: number | string) => supervisorService.delete(id),
        onSuccess: () => {
            toast.success('Atasan berhasil dihapus');
            queryClient.invalidateQueries({ queryKey: [SUPERVISOR_ENDPOINTS.PORTAL.MANAGEMENT.LIST] });
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Gagal menghapus atasan');
        },
    });

    return {
        deleteSupervisor: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
}