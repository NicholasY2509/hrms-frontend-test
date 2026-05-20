import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { APPROVAL_POLICY_ENDPOINTS } from '../endpoints';
import { policyService } from '../services/policy-service';
import { PolicyFormValues } from '../schemas/policy-schema';

export function useCreatePolicy(options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (values: PolicyFormValues) => {
            const payload = {
                ...values,
                work_position_id: values.is_default ? null : (values.work_position_id ? values.work_position_id : null),
            };
            return policyService.createPolicy(payload);
        },
        onSuccess: () => {
            toast.success('Kebijakan berhasil dibuat');
            queryClient.invalidateQueries({ queryKey: [APPROVAL_POLICY_ENDPOINTS.LIST] });
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || error.message || 'Gagal membuat kebijakan');
        },
    });

    return {
        createPolicy: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
}

export function useUpdatePolicySteps(options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, steps }: { id: number; steps: any[] }) =>
            policyService.updatePolicySteps(id, steps),
        onSuccess: () => {
            toast.success('Kebijakan berhasil diperbarui');
            queryClient.invalidateQueries({ queryKey: [APPROVAL_POLICY_ENDPOINTS.LIST] });
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || error.message || 'Gagal memperbarui kebijakan');
        },
    });

    return {
        updatePolicySteps: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
}

export function useDeletePolicy(options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (id: number) => policyService.deletePolicy(id),
        onSuccess: () => {
            toast.success('Kebijakan berhasil dihapus');
            queryClient.invalidateQueries({ queryKey: [APPROVAL_POLICY_ENDPOINTS.LIST] });
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Gagal menghapus kebijakan');
        },
    });

    return {
        deletePolicy: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
}