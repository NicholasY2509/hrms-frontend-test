'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft01Icon,
  Calendar01Icon,
  InformationCircleIcon,
  UserIcon,
  Timer01Icon,
  Loading03Icon,
  CancelCircleIcon,
  AttachmentIcon,
  CheckmarkCircle01Icon,
  WorkHistoryIcon,
  DocumentAttachmentFreeIcons,
  PrinterIcon,
} from '@hugeicons/core-free-icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCertificateOfEmploymentDetail, useSettleCertificateOfEmployment, useExportCertificateOfEmployment } from '@/modules/employee/certificate-of-employment/hooks/use-certificate';
import { ApprovalHistory } from '@/modules/approval/components/approval-history';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { CERTIFICATE_OF_EMPLOYMENT_ENDPOINTS } from '@/modules/employee/certificate-of-employment/endpoints';
import { formatDate, formatDateTime } from '@/lib/utils';
import { ConfirmModal } from '@/components/ui/confirm-modal';

export function CertificateOfEmploymentDetailClient() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { item, isLoading, isError, mutate } = useCertificateOfEmploymentDetail(params.id as string);

  const [isSettleModalOpen, setIsSettleModalOpen] = React.useState(false);
  const { settleCertificate, isLoading: isSettling } = useSettleCertificateOfEmployment(params.id as string, {
    onSuccess: () => {
      setIsSettleModalOpen(false);
      mutate();
    }
  });

  const { exportCertificate, isLoading: isExporting } = useExportCertificateOfEmployment(params.id as string);

  const getStatusBadge = (status: string | null) => {
    if (!status) return null;
    const s = status.toLowerCase();
    if (s === 'approved' || s === 'disetujui' || s === 'settled' || s === 'selesai' || s.includes('approved'))
      return <Badge variant="success" className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold gap-1">{status}</Badge>;
    if (s === 'rejected' || s === 'ditolak' || s.includes('rejected'))
      return <Badge variant="destructive" className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold gap-1">{status}</Badge>;
    if (s === 'pending' || s === 'menunggu' || s.includes('pending'))
      return <Badge variant="warning" className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold gap-1">{status}</Badge>;
    return <Badge variant="secondary" className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold">{status}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <HugeiconsIcon icon={Loading03Icon} className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">Memuat rincian CoE...</p>
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <div className="p-6 bg-muted/30 rounded-full">
          <HugeiconsIcon icon={CancelCircleIcon} className="h-16 w-16 text-muted-foreground/40" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold">Data Tidak Ditemukan</h3>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Data Surat Keterangan Kerja yang Anda cari mungkin telah dihapus atau Anda tidak memiliki akses.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" /> Kembali
        </Button>
      </div>
    );
  }

  const canSettle = item.status === 'Approved';
  const isSettled = item.status === 'Settled';

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-primary/5 hover:text-primary transition-colors">
            <HugeiconsIcon icon={ArrowLeft01Icon} className="h-6 w-6" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-foreground/90">Surat Keterangan Kerja</h1>
              {getStatusBadge(item.status)}
            </div>
            <p className="text-muted-foreground text-sm font-medium tracking-tight">
              No. Dokumen: <span className="font-bold text-foreground/80">{item.document_no || 'DRAFT'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {(canSettle || isSettled) && (
            <Button
              onClick={() => setIsSettleModalOpen(true)}
              disabled={isSettled || isSettling}
              className="gap-2 transition-all active:scale-95 px-6"
            >
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} />
              {isSettled ? 'Telah Diselesaikan' : 'Selesaikan & Terbitkan'}
            </Button>
          )}

          {isSettled && (
            <Button
              variant="outline"
              onClick={() => exportCertificate()}
              disabled={isExporting}
              className="gap-2 transition-all active:scale-95 px-6 border-primary/20 hover:bg-primary/5 text-primary"
            >
              {isExporting ? (
                <HugeiconsIcon icon={Loading03Icon} size={18} className="animate-spin" />
              ) : (
                <HugeiconsIcon icon={PrinterIcon} size={18} />
              )}
              Print
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-none pt-0 shadow-sm ring-1 ring-muted">
            <CardHeader className="bg-muted/30 py-4 border-b border-border/40">
              <CardTitle className="text-base flex items-center gap-2 font-bold tracking-tight">
                <HugeiconsIcon icon={UserIcon} className="h-5 w-5 text-primary" />
                Informasi Karyawan
              </CardTitle>
            </CardHeader>
            <CardContent className="">
              <div className="grid grid-cols-2 gap-y-8 gap-x-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nama Karyawan</p>
                  <p className="font-bold text-lg text-primary/90 leading-tight">{item.employee.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">NIK</p>
                  <p className="font-bold text-base leading-tight">{item.employee.nik}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Jabatan Terakhir</p>
                  <div className="flex items-center gap-2 font-bold text-base leading-tight">
                    <HugeiconsIcon icon={WorkHistoryIcon} size={18} className="text-primary/70 shrink-0" />
                    {item.work_position.name}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tanggal Pengajuan</p>
                  <div className="flex items-center gap-2 font-bold text-base leading-tight text-foreground/80">
                    <HugeiconsIcon icon={Calendar01Icon} size={18} className="text-primary/70 shrink-0" />
                    {formatDate(item.request_date)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none pt-0 shadow-sm ring-1 ring-muted">
            <CardHeader className="bg-muted/30 py-4 border-b border-border/40">
              <CardTitle className="text-base flex items-center gap-2 font-bold tracking-tight">
                <HugeiconsIcon icon={InformationCircleIcon} className="h-5 w-5 text-primary" />
                Keterangan / Catatan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 ring-1 ring-white/50 shadow-inner">
                <p className="text-sm leading-relaxed text-foreground font-medium">
                  {item.note || "Tidak ada catatan tambahan."}
                </p>
              </div>
            </CardContent>
          </Card>

          {item.attachment_url && (
            <Card className="overflow-hidden border-none pt-0 shadow-sm ring-1 ring-muted">
              <CardHeader className="bg-muted/30 py-4 border-b border-border/40">
                <CardTitle className="text-base flex items-center gap-2 font-bold tracking-tight">
                  <HugeiconsIcon icon={DocumentAttachmentFreeIcons} className="h-5 w-5 text-primary" />
                  Pratinjau Dokumen
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[600px] bg-muted/20">
                <iframe src={item.attachment_url} className="w-full h-full border-none" title="CoE Preview" />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ApprovalHistory
            approvals={item.approvals}
            currentUserId={user?.employee_id}
            userRoles={user?.roles}
            onActionSuccess={() => {
              mutate();
              queryClient.invalidateQueries({ queryKey: [CERTIFICATE_OF_EMPLOYMENT_ENDPOINTS.PORTAL.MANAGEMENT.LIST] });
            }}
          />

          {item.attachment_url && (
            <Card className="overflow-hidden border-none pt-0 shadow-sm ring-1 ring-muted bg-linear-to-br from-primary/5 to-transparent">
              <CardHeader className="bg-muted/30 py-4 border-b border-border/40">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <HugeiconsIcon icon={AttachmentIcon} className="h-3.5 w-3.5" />
                  Dokumen Digital
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Button variant="outline" className="w-full gap-2 font-bold shadow-sm h-11 rounded-xl" onClick={() => window.open(item.attachment_url!, '_blank')}>
                  <HugeiconsIcon icon={AttachmentIcon} size={18} />
                  Buka di Jendela Baru
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="overflow-hidden border-none pt-0 shadow-sm ring-1 ring-muted bg-primary/1">
            <CardHeader className="bg-muted/30 py-4 border-b border-border/40">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <HugeiconsIcon icon={Timer01Icon} className="h-3.5 w-3.5" />
                Metadata Sistem
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between text-xs items-center">
                  <span className="text-muted-foreground font-medium uppercase tracking-tight text-[10px]">Dibuat Pada</span>
                  <span className="font-bold text-foreground/80">{formatDateTime(item.created_at)}</span>
                </div>
                {item.issued_date && (
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-muted-foreground font-medium uppercase tracking-tight text-[10px]">Tanggal Terbit</span>
                    <span className="font-bold text-green-700">{formatDate(item.issued_date)}</span>
                  </div>
                )}
                {item.settled_at && (
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-muted-foreground font-medium uppercase tracking-tight text-[10px]">Diselesaikan</span>
                    <span className="font-bold text-blue-700">{formatDateTime(item.settled_at)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmModal
        isOpen={isSettleModalOpen}
        onClose={() => setIsSettleModalOpen(false)}
        onConfirm={() => { settleCertificate(); }}
        title="Selesaikan & Terbitkan CoE?"
        description="Tindakan ini akan memfinalisasi dokumen Surat Keterangan Kerja dan menandainya sebagai terbit. Karyawan akan menerima notifikasi bahwa dokumen telah tersedia."
        confirmText="Ya, Terbitkan"
        variant="default"
        isLoading={isSettling}
      />
    </div>
  );
}
