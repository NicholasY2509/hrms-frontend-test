import { useMutation, useQueryClient } from '@tanstack/react-query';
import { groupService } from '../services/group-service';
import { APPROVAL_GROUP_ENDPOINTS } from '../endpoints';
import { GroupFormValues } from '../schemas/group-schema';
import { toast } from 'sonner';

export function useCreateApprovalGroup(options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: GroupFormValues) => groupService.createGroup(data),
        onSuccess: () => {
            toast.success('Grup berhasil dibuat');
            queryClient.invalidateQueries({ queryKey: [APPROVAL_GROUP_ENDPOINTS.LIST] });
            options?.onSuccess?.();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Gagal membuat grup');
        },
    });

    return {
        createGroup: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
}

export function useUpdateApprovalGroup(options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: GroupFormValues }) =>
            groupService.updateGroup(id, data),
        onSuccess: (_, { id }) => {
            toast.success('Grup berhasil diperbarui');
            queryClient.invalidateQueries({ queryKey: [APPROVAL_GROUP_ENDPOINTS.LIST] });
            queryClient.invalidateQueries({ queryKey: [APPROVAL_GROUP_ENDPOINTS.DETAIL(id)] });
            options?.onSuccess?.();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Gagal memperbarui grup');
        },
    });

    return {
        updateGroup: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
}

export function useDeleteApprovalGroup(options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (id: number) => groupService.deleteGroup(id),
        onSuccess: () => {
            toast.success('Grup berhasil dihapus');
            queryClient.invalidateQueries({ queryKey: [APPROVAL_GROUP_ENDPOINTS.LIST] });
            options?.onSuccess?.();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Gagal menghapus grup');
        },
    });

    return {
        deleteGroup: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
}

export function useSyncApprovalGroupMembers(options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, userIds }: { id: number; userIds: string[] }) =>
            groupService.syncGroupUsers(id, userIds),
        onSuccess: (_, { id }) => {
            toast.success('Anggota grup berhasil diperbarui');
            queryClient.invalidateQueries({ queryKey: [APPROVAL_GROUP_ENDPOINTS.LIST] });
            queryClient.invalidateQueries({ queryKey: [APPROVAL_GROUP_ENDPOINTS.DETAIL(id)] });
            options?.onSuccess?.();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Gagal memperbarui anggota grup');
        },
    });

    return {
        syncMembers: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
}