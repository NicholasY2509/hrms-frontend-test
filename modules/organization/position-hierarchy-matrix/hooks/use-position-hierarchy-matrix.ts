import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { positionHierarchyMatrixService } from '../services/position-hierarchy-matrix-service';
import { POSITION_HIERARCHY_MATRIX_ENDPOINTS } from '../endpoints';
import { PositionHierarchyMatrixFormValues } from '../schemas/position-hierarchy-matrix';

export function usePositionHierarchyMatrices(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [POSITION_HIERARCHY_MATRIX_ENDPOINTS.LIST, params],
    queryFn: () => positionHierarchyMatrixService.getList(params),
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useCreatePositionHierarchyMatrix(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: PositionHierarchyMatrixFormValues) =>
      positionHierarchyMatrixService.create(data),
    onSuccess: () => {
      toast.success('Matrix mapping created successfully!');
      queryClient.invalidateQueries({
        queryKey: [POSITION_HIERARCHY_MATRIX_ENDPOINTS.LIST],
      });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create matrix mapping.');
    },
  });

  return {
    createMatrix: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useUpdatePositionHierarchyMatrix(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: PositionHierarchyMatrixFormValues }) =>
      positionHierarchyMatrixService.update(id, data),
    onSuccess: () => {
      toast.success('Matrix mapping updated successfully!');
      queryClient.invalidateQueries({
        queryKey: [POSITION_HIERARCHY_MATRIX_ENDPOINTS.LIST],
      });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update matrix mapping.');
    },
  });

  return {
    updateMatrix: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useDeletePositionHierarchyMatrix(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string | number) => positionHierarchyMatrixService.delete(id),
    onSuccess: () => {
      toast.success('Matrix mapping deleted successfully!');
      queryClient.invalidateQueries({
        queryKey: [POSITION_HIERARCHY_MATRIX_ENDPOINTS.LIST],
      });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete matrix mapping.');
    },
  });

  return {
    deleteMatrix: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}
