import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { WARNING_LETTER_ENDPOINTS } from "../endpoints";
import { warningLetterService } from "../services/warning-letter-service";

export function useCreateWarningLetter(options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: FormData) => warningLetterService.create(data),
        onSuccess: () => {
            toast.success("Surat Peringatan berhasil dikeluarkan");
            queryClient.invalidateQueries({ queryKey: [WARNING_LETTER_ENDPOINTS.PORTAL.MANAGEMENT.LIST] });
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Gagal mengeluarkan Surat Peringatan");
        },
    });

    return {
        createWarningLetter: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
}

export function useSettleWarningLetter(id: string | number, options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () => warningLetterService.settle(id),
        onSuccess: () => {
            toast.success("Surat Peringatan berhasil diselesaikan");
            queryClient.invalidateQueries({ queryKey: [WARNING_LETTER_ENDPOINTS.PORTAL.MANAGEMENT.LIST] });
            queryClient.invalidateQueries({ queryKey: [WARNING_LETTER_ENDPOINTS.PORTAL.MANAGEMENT.DETAIL(id), id] });
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Gagal menyelesaikan Surat Peringatan");
        },
    });

    return {
        settleWarningLetter: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
}

export function useExportWarningLetter(id: string | number, options?: { onSuccess?: () => void }) {
    const mutation = useMutation({
        mutationFn: () => warningLetterService.export(id),
        onSuccess: (data: any) => {
            toast.info(data.message || "Permintaan cetak SP sedang diproses");
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Gagal memproses permintaan cetak");
        }
    });

    return {
        exportWarningLetter: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
}