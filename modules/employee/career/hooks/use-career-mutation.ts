import { useMutation, useQueryClient } from "@tanstack/react-query";
import { careerService } from "../services";
import { CareerTransitionRequest } from "../types";
import { CAREER_ENDPOINTS } from "../endpoints";
import { toast } from "sonner";

export function useCreateCareer(options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: CareerTransitionRequest) => careerService.createCareer(data),
        onSuccess: () => {
            toast.success("Transisi karir berhasil disimpan");
            queryClient.invalidateQueries({ queryKey: [CAREER_ENDPOINTS.PORTAL.MANAGEMENT.LIST] });
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Gagal menyimpan transisi karir");
        },
    });

    return {
        createCareer: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
}

export function useSettleCareer(id: string | number, options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () => careerService.settleCareer(id),
        onSuccess: () => {
            toast.success("Transisi karir berhasil diselesaikan");
            queryClient.invalidateQueries({ queryKey: [CAREER_ENDPOINTS.PORTAL.MANAGEMENT.LIST] });
            queryClient.invalidateQueries({ queryKey: [CAREER_ENDPOINTS.PORTAL.MANAGEMENT.DETAIL(id), id] });
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Gagal menyelesaikan transisi karir");
        },
    });

    return {
        settleCareer: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
}

export function useExportCareer(id: string | number, options?: { onSuccess?: () => void }) {
    const mutation = useMutation({
        mutationFn: () => careerService.exportCareer(id),
        onSuccess: (data: any) => {
            toast.info(data.message || "Permintaan cetak formulir sedang diproses");
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Gagal memproses permintaan cetak");
        }
    });

    return {
        exportCareer: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
}
