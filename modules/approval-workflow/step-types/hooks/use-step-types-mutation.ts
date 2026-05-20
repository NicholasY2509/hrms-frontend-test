import { useMutation, useQueryClient } from '@tanstack/react-query';
import { stepTypeService } from '../services/step-type-service';
import { APPROVAL_STEP_TYPE_ENDPOINTS } from '../endpoints';
import { StepTypeFormValues } from '../schemas/step-type-schema';
import { toast } from 'sonner';

export function useCreateStepType(options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (values: StepTypeFormValues) => stepTypeService.createStepType(values),
        onSuccess: () => {
            toast.success('Tipe tahapan berhasil dibuat');
            queryClient.invalidateQueries({ queryKey: [APPROVAL_STEP_TYPE_ENDPOINTS.LIST] });
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || error.message || 'Gagal membuat tipe tahapan');
        },
    });

    return {
        createStepType: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
}

export function useUpdateStepType(options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, values }: { id: number; values: StepTypeFormValues }) =>
            stepTypeService.updateStepType(id, values),
        onSuccess: () => {
            toast.success('Tipe tahapan berhasil diperbarui');
            queryClient.invalidateQueries({ queryKey: [APPROVAL_STEP_TYPE_ENDPOINTS.LIST] });
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || error.message || 'Gagal memperbarui tipe tahapan');
        },
    });

    return {
        updateStepType: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
}

export function useDeleteStepType(options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (id: number) => stepTypeService.deleteStepType(id),
        onSuccess: () => {
            toast.success('Tipe tahapan berhasil dihapus');
            queryClient.invalidateQueries({ queryKey: [APPROVAL_STEP_TYPE_ENDPOINTS.LIST] });
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || error.message || 'Gagal menghapus tipe tahapan');
        },
    });

    return {
        deleteStepType: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
}
