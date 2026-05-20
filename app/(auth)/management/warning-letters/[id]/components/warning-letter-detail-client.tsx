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
  PrinterIcon
} from '@hugeicons/core-free-icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWarningLetterDetail } from '@/modules/employee/warning-letter/hooks/use-warning-letter';
import { ApprovalHistory } from '@/modules/approval/components/approval-history';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { WARNING_LETTER_ENDPOINTS } from '@/modules/employee/warning-letter/endpoints';
import { formatDate, formatDateTime } from '@/lib/utils';
import { useSettleWarningLetter, useExportWarningLetter } from '@/modules/employee/warning-letter/hooks/use-warning-letter-mutation';
import { ConfirmModal } from '@/components/ui/confirm-modal';

export function WarningLetterDetailClient() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { item, isLoading, isError, mutate } = useWarningLetterDetail(params.id as string);

  const [isSettleModalOpen, setIsSettleModalOpen] = React.useState(false);
  const { settleWarningLetter, isLoading: isSettling } = useSettleWarningLetter(params.id as string, {
    onSuccess: () => {
      setIsSettleModalOpen(false);
      mutate();
    }
  });

  const { exportWarningLetter, isLoading: isExporting } = useExportWarningLetter(params.id as string);

  const getTypeBadge = (typeName: string) => {
    let colorClass = "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"; // SP 1
    if (typeName.includes("2")) {
      colorClass = "bg-orange-500/10 text-orange-600 border-orange-500/20"; // SP 2
    } else if (typeName.includes("3")) {
      colorClass = "bg-red-500/10 text-red-600 border-red-500/20"; // SP 3
    }

    return (
      <Badge variant="outline" className={`font-bold ${colorClass}`}>
        {typeName}
      </Badge>
    );
  };

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
        <p className="text-muted-foreground animate-pulse font-medium">Memuat rincian SP...</p>
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
            Surat Peringatan yang Anda cari mungkin telah dihapus atau Anda tidak memiliki akses.
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
              <h1 className="text-2xl font-bold tracking-tight">Detail Surat Peringatan</h1>
              {getStatusBadge(item.status)}
            </div>
            <p className="text-muted-foreground text-sm font-medium tracking-tight">ID SP: #{item.id} • {item.document_no}</p>
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
              {isSettled ? 'Telah Diselesaikan' : 'Selesaikan SP'}
            </Button>
          )}

          {isSettled && (
            <Button
              variant="outline"
              onClick={() => exportWarningLetter()}
              disabled={isExporting}
              className="gap-2 transition-all active:scale-95 px-6 border-primary/20 hover:bg-primary/5 text-primary"
            >
              {isExporting ? (
                <HugeiconsIcon icon={Loading03Icon} size={18} className="animate-spin" />
              ) : (
                <HugeiconsIcon icon={PrinterIcon} size={18} />
              )}
              Cetak SP
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-none pt-0 shadow-sm ring-1 ring-muted">
            <CardHeader className="bg-muted/30 py-4">
              <CardTitle className="text-lg flex items-center gap-2 font-bold tracking-tight">
                <HugeiconsIcon icon={UserIcon} className="h-5 w-5 text-primary" />
                Informasi Karyawan
              </CardTitle>
            </CardHeader>
            <CardContent className="">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nama Karyawan</p>
                  <p className="font-bold text-lg text-primary">{item.employee.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nomor Induk Karyawan (NIK)</p>
                  <p className="font-bold text-base">{item.employee.nik}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tipe Surat Peringatan</p>
                  {getTypeBadge(item.warning_letter_type.name)}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tanggal SP</p>
                  <div className="flex items-center gap-2 font-bold text-base">
                    <HugeiconsIcon icon={Calendar01Icon} size={18} className="text-primary" />
                    {formatDate(item.warning_at)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none pt-0 shadow-sm ring-1 ring-muted">
            <CardHeader className="bg-muted/30 py-4">
              <CardTitle className="text-lg flex items-center gap-2 font-bold tracking-tight">
                <HugeiconsIcon icon={InformationCircleIcon} className="h-5 w-5 text-primary" />
                Detail & Masa Berlaku
              </CardTitle>
            </CardHeader>
            <CardContent className="">
              <div className="divide-y divide-border">
                <div className="px-1 pb-4 grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mulai Berlaku</p>
                    <p className="font-bold text-base">{formatDate(item.start_date)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Berakhir Pada</p>
                    <p className="font-bold text-base">{formatDate(item.end_date)}</p>
                  </div>
                </div>
                <div className="px-1 py-4 space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pelanggaran / Alasan SP</p>
                  <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                    <p className="text-sm leading-relaxed text-foreground font-medium">
                      {item.name || "Tidak ada rincian pelanggaran yang dicatat."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ApprovalHistory
            approvals={item.approvals}
            currentUserId={user?.employee_id}
            userRoles={user?.roles}
            onActionSuccess={() => {
              mutate();
              queryClient.invalidateQueries({ queryKey: [WARNING_LETTER_ENDPOINTS.PORTAL.MANAGEMENT.LIST] });
            }}
          />

          {item.attachment_url && (
            <Card className="overflow-hidden border-none pt-0 shadow-sm ring-1 ring-muted">
              <CardHeader className="bg-muted/30 py-4">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <HugeiconsIcon icon={AttachmentIcon} className="h-3.5 w-3.5" />
                  Lampiran Dokumen
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Button variant="outline" className="w-full gap-2 font-bold" onClick={() => window.open(item.attachment_url!, '_blank')}>
                  <HugeiconsIcon icon={AttachmentIcon} size={18} />
                  Lihat Lampiran
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="overflow-hidden border-none pt-0 shadow-sm ring-1 ring-muted bg-primary/[0.02]">
            <CardHeader className="bg-muted/30 py-4">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <HugeiconsIcon icon={Timer01Icon} className="h-3.5 w-3.5" />
                Informasi Sistem
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Dibuat Pada:</span>
                  <span className="font-bold text-foreground">{formatDateTime(item.created_at)}</span>
                </div>
                {item.confirmed_at && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Dikonfirmasi:</span>
                    <span className="font-bold text-green-600">{formatDateTime(item.confirmed_at)}</span>
                  </div>
                )}
                {item.settled_at && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Diselesaikan:</span>
                    <span className="font-bold text-blue-600">{formatDateTime(item.settled_at)}</span>
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
        onConfirm={() => { settleWarningLetter(); }}
        title="Selesaikan Surat Peringatan?"
        description="Tindakan ini akan menandai Surat Peringatan ini sebagai selesai/berlaku secara permanen. Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Selesaikan"
        variant="default"
        isLoading={isSettling}
      />
    </div>
  );
}
