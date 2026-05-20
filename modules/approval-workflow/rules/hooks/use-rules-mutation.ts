import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { APPROVAL_RULE_ENDPOINTS } from '../endpoints';
import { APPROVAL_SCHEME_ENDPOINTS } from '../../schemes/endpoints';
import { ruleService } from '../services/rule-service';
import { ApprovalRule, ApprovalRuleStep } from '../types';

export function useCreateRule(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ schemeId, payload }: { schemeId: number; payload: Partial<ApprovalRule> }) =>
      ruleService.createRule({ ...payload, approval_scheme_id: schemeId }),
    onSuccess: (_, { schemeId }) => {
      toast.success('Aturan berhasil dibuat');
      queryClient.invalidateQueries({ queryKey: [APPROVAL_SCHEME_ENDPOINTS.DETAIL(schemeId)] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message || 'Gagal membuat aturan');
    },
  });

  return {
    createRule: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useUpdateRule(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<ApprovalRule> }) =>
      ruleService.updateRule(id, payload),
    onSuccess: () => {
      toast.success('Aturan berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: [APPROVAL_SCHEME_ENDPOINTS.LIST] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message || 'Gagal memperbarui aturan');
    },
  });

  return {
    updateRule: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useDeleteRule(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => ruleService.deleteRule(id),
    onSuccess: () => {
      toast.success('Aturan berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: [APPROVAL_SCHEME_ENDPOINTS.LIST] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gagal menghapus aturan');
    },
  });

  return {
    deleteRule: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useUpdateRuleSteps(options?: { onSuccess?: () => void; schemeId?: number | string }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, steps, work_location_id }: { id: number; steps: ApprovalRuleStep[]; work_location_id?: number | null }) =>
      ruleService.updateRule(id, { steps, work_location_id }),
    onSuccess: () => {
      toast.success('Aturan persetujuan berhasil disimpan');

      if (options?.schemeId) {
        queryClient.invalidateQueries({
          queryKey: [APPROVAL_SCHEME_ENDPOINTS.DETAIL(options.schemeId)]
        });
      } else {
        queryClient.invalidateQueries({ queryKey: [APPROVAL_SCHEME_ENDPOINTS.LIST] });
      }

      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gagal menyimpan aturan persetujuan');
    },
  });

  return {
    updateSteps: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

