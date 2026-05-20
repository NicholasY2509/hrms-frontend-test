import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CERTIFICATE_OF_EMPLOYMENT_ENDPOINTS } from "../endpoints";
import { certificateOfEmploymentService } from "../services/certificate-of-employement-service";
import { toast } from "sonner";

export function useCertificateOfEmploymentList(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [CERTIFICATE_OF_EMPLOYMENT_ENDPOINTS.PORTAL.MANAGEMENT.LIST, params],
    queryFn: () => certificateOfEmploymentService.getList(params),
  });

  return {
    items: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useCertificateOfEmploymentDetail(id: string | number) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [CERTIFICATE_OF_EMPLOYMENT_ENDPOINTS.PORTAL.MANAGEMENT.DETAIL(id)],
    queryFn: () => certificateOfEmploymentService.getDetail(id),
    enabled: !!id,
  });

  return {
    item: data?.data,
    isLoading,
    isError: error,
    mutate: refetch,
  };
}

export function useCreateCertificateOfEmployment(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (employeeId: string | number) => certificateOfEmploymentService.create(employeeId),
    onSuccess: () => {
      toast.success("Pengajuan Surat Keterangan Kerja berhasil dibuat");
      queryClient.invalidateQueries({ queryKey: [CERTIFICATE_OF_EMPLOYMENT_ENDPOINTS.PORTAL.MANAGEMENT.LIST] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal membuat pengajuan");
    }
  });

  return {
    createCertificate: mutation.mutateAsync,
    isLoading: mutation.isPending
  };
}

export function useSettleCertificateOfEmployment(id: string | number, options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => certificateOfEmploymentService.settle(id),
    onSuccess: () => {
      toast.success("Surat Keterangan Kerja berhasil diselesaikan");
      queryClient.invalidateQueries({ queryKey: [CERTIFICATE_OF_EMPLOYMENT_ENDPOINTS.PORTAL.MANAGEMENT.LIST] });
      queryClient.invalidateQueries({ queryKey: [CERTIFICATE_OF_EMPLOYMENT_ENDPOINTS.PORTAL.MANAGEMENT.DETAIL(id)] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal menyelesaikan Surat Keterangan Kerja");
    }
  });

  return {
    settleCertificate: mutation.mutateAsync,
    isLoading: mutation.isPending
  };
}

export function useExportCertificateOfEmployment(id: string | number, options?: { onSuccess?: () => void }) {
  const mutation = useMutation({
    mutationFn: () => certificateOfEmploymentService.export(id),
    onSuccess: (data: any) => {
      toast.info(data.message || "Permintaan cetak CoE sedang diproses");
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal memproses permintaan cetak");
    }
  });

  return {
    exportCertificate: mutation.mutateAsync,
    isLoading: mutation.isPending
  };
}
