import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { schemeService } from "../services/scheme-service";
import { APPROVAL_SCHEME_ENDPOINTS } from "../endpoints";
import { ApprovalScheme } from "../types";

export function useCreateScheme(options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (payload: Partial<ApprovalScheme>) => schemeService.createScheme(payload),
        onSuccess: () => {
            toast.success('Kategori berhasil dibuat');
            queryClient.invalidateQueries({ queryKey: [APPROVAL_SCHEME_ENDPOINTS.LIST] });
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || error.message || 'Gagal membuat kategori');
        },
    });

    return {
        createScheme: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
}

export function useUpdateScheme(options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: Partial<ApprovalScheme> }) =>
            schemeService.updateScheme(id, payload),
        onSuccess: (_, { id }) => {
            toast.success('Kategori berhasil diperbarui');
            queryClient.invalidateQueries({ queryKey: [APPROVAL_SCHEME_ENDPOINTS.LIST] });
            queryClient.invalidateQueries({ queryKey: [APPROVAL_SCHEME_ENDPOINTS.DETAIL(id)] });
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || error.message || 'Gagal memperbarui kategori');
        },
    });

    return {
        updateScheme: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
}

export function useDeleteScheme(options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (id: number) => schemeService.deleteScheme(id),
        onSuccess: () => {
            toast.success('Kategori berhasil dihapus');
            queryClient.invalidateQueries({ queryKey: [APPROVAL_SCHEME_ENDPOINTS.LIST] });
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Gagal menghapus kategori');
        },
    });

    return {
        deleteScheme: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
}