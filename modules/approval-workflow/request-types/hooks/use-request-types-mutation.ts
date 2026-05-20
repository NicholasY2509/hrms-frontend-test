import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requestTypeService } from '../services/request-type-service';
import { APPROVAL_REQUEST_TYPE_ENDPOINTS } from '../endpoints';
import { RequestTypeFormValues } from '../schemas/request-type-schema';
import { toast } from 'sonner';

export function useCreateRequestType(options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: RequestTypeFormValues) => requestTypeService.createRequestType(data),
        onSuccess: () => {
            toast.success('Tipe pengajuan berhasil dibuat');
            queryClient.invalidateQueries({ queryKey: [APPROVAL_REQUEST_TYPE_ENDPOINTS.LIST] });
            options?.onSuccess?.();
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Gagal membuat tipe pengajuan');
        },
    });

    return {
        createRequestType: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
}

export function useUpdateRequestType(options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, data }: { id: number | string; data: RequestTypeFormValues }) =>
            requestTypeService.updateRequestType(id, data),
        onSuccess: () => {
            toast.success('Tipe pengajuan berhasil diperbarui');
            queryClient.invalidateQueries({ queryKey: [APPROVAL_REQUEST_TYPE_ENDPOINTS.LIST] });
            options?.onSuccess?.();
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Gagal memperbarui tipe pengajuan');
        },
    });

    return {
        updateRequestType: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
}

export function useDeleteRequestType(options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (id: number | string) => requestTypeService.deleteRequestType(id),
        onSuccess: () => {
            toast.success('Tipe pengajuan berhasil dihapus');
            queryClient.invalidateQueries({ queryKey: [APPROVAL_REQUEST_TYPE_ENDPOINTS.LIST] });
            options?.onSuccess?.();
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Gagal menghapus tipe pengajuan');
        },
    });

    return {
        deleteRequestType: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
}