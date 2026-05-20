'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft01Icon,
  Calendar01Icon,
  InformationCircleIcon,
  UserIcon,
  ArrowRight01Icon,
  Message01Icon,
  Timer01Icon,
  Loading03Icon,
  CancelCircleIcon,
  PrinterIcon
} from '@hugeicons/core-free-icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCareerDetail } from '@/modules/employee/career/hooks/use-career';
import { ApprovalHistory } from '@/modules/approval/components/approval-history';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { CAREER_ENDPOINTS } from '@/modules/employee/career/endpoints';
import { formatDate, formatDateTime } from '@/lib/utils';
import { useSettleCareer, useExportCareer } from '@/modules/employee/career/hooks/use-career-mutation';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';

export function CareerDetailClient() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { item, isLoading, isError, mutate } = useCareerDetail(params.id as string);

  const [isSettleModalOpen, setIsSettleModalOpen] = React.useState(false);
  const { settleCareer, isLoading: isSettling } = useSettleCareer(params.id as string, {
    onSuccess: () => {
      setIsSettleModalOpen(false);
      mutate();
    }
  });

  const { exportCareer, isLoading: isExporting } = useExportCareer(params.id as string);

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
        <p className="text-muted-foreground animate-pulse font-medium">Memuat rincian karir...</p>
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
            Riwayat karir yang Anda cari mungkin telah dihapus atau Anda tidak memiliki akses.
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
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-primary/5 hover:text-primary">
            <HugeiconsIcon icon={ArrowLeft01Icon} className="h-6 w-6" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">Detail {item.career_type.name}</h1>
              {getStatusBadge(item.status)}
            </div>
            <p className="text-muted-foreground text-sm font-medium tracking-tight">ID Karir: #{item.id}</p>
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
              {isSettled ? 'Telah Diselesaikan' : 'Selesaikan Transisi'}
            </Button>
          )}

          {isSettled && (
            <Button
              variant="outline"
              onClick={() => exportCareer()}
              disabled={isExporting}
              className="gap-2 transition-all active:scale-95 px-6 border-primary/20 hover:bg-primary/5 text-primary"
            >
              {isExporting ? (
                <HugeiconsIcon icon={Loading03Icon} size={18} className="animate-spin" />
              ) : (
                <HugeiconsIcon icon={PrinterIcon} size={18} />
              )}
              Cetak Transisi
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Transition Details */}
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
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tipe Transisi</p>
                  <Badge variant="outline" className="font-bold bg-primary/5 text-primary border-primary/20">{item.career_type.name}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tanggal Efektif</p>
                  <div className="flex items-center gap-2 font-bold text-base">
                    <HugeiconsIcon icon={Calendar01Icon} size={18} className="text-primary" />
                    {formatDate(item.career_at)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none pt-0 shadow-sm ring-1 ring-muted">
            <CardHeader className="bg-muted/30 py-4">
              <CardTitle className="text-lg flex items-center gap-2 font-bold tracking-tight">
                <HugeiconsIcon icon={InformationCircleIcon} className="h-5 w-5 text-primary" />
                Detail Perubahan Karir
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                <TransitionRow
                  label="Lokasi Kerja"
                  before={item.before_work_location?.name}
                  after={item.after_work_location?.name}
                />
                <TransitionRow
                  label="Status Karyawan"
                  before={item.before_employee_status?.name}
                  after={item.after_employee_status?.name}
                />
                <TransitionRow
                  label="Jabatan / Posisi"
                  before={item.before_work_position?.name}
                  after={item.after_work_position?.name}
                />
                <TransitionRow
                  label="Departemen"
                  before={item.before_department?.name}
                  after={item.after_department?.name}
                />
                <TransitionRow
                  label="Tim Kerja"
                  before={item.before_team?.name}
                  after={item.after_team?.name}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Meta Info */}
        <div className="space-y-6">
          <ApprovalHistory
            approvals={item.approvals}
            currentUserId={user?.employee_id}
            userRoles={user?.roles}
            onActionSuccess={() => {
              mutate();
              queryClient.invalidateQueries({ queryKey: [CAREER_ENDPOINTS.PORTAL.MANAGEMENT.LIST] });
            }}
          />

          <Card className="overflow-hidden border-none pt-0 shadow-sm ring-1 ring-muted">
            <CardHeader className="bg-muted/30 py-4">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <HugeiconsIcon icon={Message01Icon} className="h-3.5 w-3.5" />
                Catatan Transisi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm leading-relaxed text-foreground italic font-medium">
                "{item.note || "Tidak ada catatan untuk transisi ini."}"
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none pt-0 shadow-sm ring-1 ring-muted bg-primary/2">
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
        onConfirm={() => { settleCareer(); }}
        title="Selesaikan Transisi Karir?"
        description="Tindakan ini akan memperbarui data utama karyawan (Jabatan, Departemen, dll) sesuai dengan rincian transisi ini. Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Selesaikan"
        variant="default"
        isLoading={isSettling}
      />
    </div>
  );
}

function TransitionRow({ label, before, after }: { label: string; before?: string | null; after?: string | null }) {
  const isChanged = before !== after;

  return (
    <div className="p-6 space-y-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_40px_1fr] items-center gap-4">
        <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
          <p className="font-bold text-sm text-foreground/80">{before || "-"}</p>
        </div>
        <div className="flex justify-center">
          <div className={`p-2 rounded-full ${isChanged ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground/30"}`}>
            <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
          </div>
        </div>
        <div className={`p-4 rounded-2xl border transition-all ${isChanged ? "bg-primary/3 border-primary/20 shadow-sm" : "bg-muted/30 border-border/50"}`}>
          <p className={`font-bold text-sm ${isChanged ? "text-primary" : "text-foreground/80"}`}>{after || "-"}</p>
        </div>
      </div>
    </div>
  );
}
