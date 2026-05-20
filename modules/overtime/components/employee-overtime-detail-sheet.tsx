"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useOvertimeEmployeeDetail } from "@/modules/overtime/hooks/use-overtime";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  UserIcon,
  Timer01Icon,
  FileAttachmentIcon,
  Message01Icon,
  CheckmarkCircle01Icon,
  CancelCircleIcon,
  Clock01Icon,
  Coins01Icon
} from "@hugeicons/core-free-icons";

interface DetailSheetProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DetailSheet({ id: overtimeId, isOpen, onClose }: DetailSheetProps) {
  const { item, isLoading } = useOvertimeEmployeeDetail(overtimeId);

  const getStatusIcon = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("settled"))
      return <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-4 w-4 text-primary" />;
    if (s.includes("approved"))
      return <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-4 w-4 text-emerald-500" />;
    if (s.includes("rejected"))
      return <HugeiconsIcon icon={CancelCircleIcon} className="h-4 w-4 text-rose-500" />;
    return <HugeiconsIcon icon={Clock01Icon} className="h-4 w-4 text-amber-500" />;
  };

  const getBadgeVariant = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("settled")) return "default";
    if (s.includes("approved")) return "success";
    if (s.includes("rejected")) return "destructive";
    if (s.includes("pending") || s.includes("waiting")) return "warning";
    return "outline";
  };

  const formatRupiah = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "-";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(value);
  };

  const getTypeName = (type: string | undefined) => {
    if (!type) return "-";
    switch (type) {
      case "UMUM": return "Reguler";
      case "DAC": return "DAC";
      case "NATIONAL": return "Hari Libur";
      default: return type;
    }
  };

  const formatTimeOnly = (dateTimeStr: string | undefined) => {
    if (!dateTimeStr) return "";
    const match = dateTimeStr.match(/(\d{2}):(\d{2})/);
    return match ? `${match[1]}:${match[2]}` : dateTimeStr;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[540px] p-0 border-l border-border/50 bg-background/95 backdrop-blur-md">
        <div className="h-1 w-full bg-amber-500" />

        <SheetHeader className="p-6 pb-0">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <SheetTitle className="text-xl font-bold tracking-tight">Detail Pengajuan Lembur</SheetTitle>
              {item && (
                <div className="flex">
                  <Badge variant={getBadgeVariant(item.status)} size="sm" className="border-dashed font-bold">
                    {item.status}
                  </Badge>
                </div>
              )}
            </div>
            <SheetDescription className="text-muted-foreground/80 font-medium leading-normal">
              Informasi lengkap mengenai lembur, kompensasi, dan riwayat persetujuan.
            </SheetDescription>
          </div>
        </SheetHeader>

        <Separator className="mt-6 border-border/50" />

        {isLoading ? (
          <div className="p-6 space-y-6">
            <div className="h-8 w-2/3 bg-muted animate-pulse rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-16 bg-muted animate-pulse rounded-xl" />
              <div className="h-16 bg-muted animate-pulse rounded-xl" />
            </div>
            <div className="h-24 w-full bg-muted animate-pulse rounded-xl" />
            <div className="h-40 w-full bg-muted animate-pulse rounded-xl" />
          </div>
        ) : item ? (
          <ScrollArea className="h-[calc(100vh-125px)]">
            <div className="p-6 space-y-6 pb-12">

              {/* Core Details Grid */}
              <div className="grid grid-cols-1 gap-3.5">
                <div className="flex items-start gap-4 p-4 rounded-xl border border-border/40 bg-muted/20">
                  <div className="mt-0.5 p-2 bg-amber-500/10 text-amber-600 rounded-lg shrink-0">
                    <HugeiconsIcon icon={UserIcon} className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1.5">Karyawan</p>
                    <p className="font-bold text-sm text-foreground leading-snug wrap-break-word">{item.employee.name}</p>
                    <p className="text-[10px] font-semibold text-muted-foreground mt-1">NIK: {item.employee.nik}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl border border-border/40 bg-muted/20">
                  <div className="mt-0.5 p-2 bg-amber-500/10 text-amber-600 rounded-lg shrink-0">
                    <HugeiconsIcon icon={Calendar01Icon} className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1.5">Tanggal Lembur</p>
                    <p className="font-bold text-sm text-foreground leading-snug wrap-break-word">
                      {format(new Date(item.date), "dd MMMM yyyy", { locale: idLocale })}
                    </p>
                    <p className="text-[10px] font-semibold text-muted-foreground mt-1">
                      Lembur {getTypeName(item.type)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl border border-border/40 bg-muted/20">
                  <div className="mt-0.5 p-2 bg-amber-500/10 text-amber-600 rounded-lg shrink-0">
                    <HugeiconsIcon icon={Timer01Icon} className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1.5">Total Waktu</p>
                    <p className="font-bold text-sm text-foreground leading-snug wrap-break-word">{item.total_time} Jam Kerja</p>
                    <p className="text-[10px] font-semibold text-muted-foreground mt-1">
                      Pukul {formatTimeOnly(item.start_time)} - {formatTimeOnly(item.finish_time)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl border border-border/40 bg-muted/20">
                  <div className="mt-0.5 p-2 bg-amber-500/10 text-amber-600 rounded-lg shrink-0">
                    <HugeiconsIcon icon={Coins01Icon} className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1.5">Kompensasi</p>
                    {item.real_overtime_price ? (
                      <>
                        <p className="font-bold text-sm text-success leading-snug">{formatRupiah(item.real_overtime_price)}</p>
                        <p className="text-[10px] font-semibold text-muted-foreground mt-1">Sudah diselesaikan</p>
                      </>
                    ) : (
                      <>
                        <p className="font-bold text-sm text-amber-600 leading-snug wrap-break-word">
                          {item.estimated_overtime_price ? formatRupiah(item.estimated_overtime_price) : "Menunggu Settle"}
                        </p>
                        <p className="text-[10px] font-semibold text-muted-foreground mt-1">Estimasi Kompensasi</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Note Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/75">
                  <HugeiconsIcon icon={Message01Icon} className="h-3.5 w-3.5" />
                  <span>Catatan Pengajuan</span>
                </div>
                <div className="p-4 bg-muted/20 rounded-xl border border-border/40 italic text-sm text-muted-foreground leading-relaxed wrap-break-word">
                  "{item.note ?? 'Tidak ada catatan.'}"
                </div>
              </div>

              {/* Attachments Section */}
              {item.attachment_urls && item.attachment_urls.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/75">
                    <HugeiconsIcon icon={FileAttachmentIcon} className="h-3.5 w-3.5" />
                    <span>Lampiran Dokumen</span>
                  </div>
                  <div className="grid gap-3">
                    {item.attachment_urls.map((url: string, index: number) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-muted/15 border border-border/40 rounded-xl hover:border-amber-500/40 hover:bg-amber-500/5 transition-all group"
                      >
                        <div className="p-2 bg-muted border border-border/40 rounded-lg group-hover:bg-amber-500/10 group-hover:text-amber-600">
                          <HugeiconsIcon icon={FileAttachmentIcon} className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-foreground leading-tight truncate">Dokumen Lampiran {index + 1}</p>
                          <p className="text-[9px] font-semibold text-muted-foreground mt-0.5">Klik untuk melihat file</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Approval History Section */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/75">
                  <HugeiconsIcon icon={Clock01Icon} className="h-3.5 w-3.5" />
                  <span>Riwayat Persetujuan</span>
                </div>

                <div className="relative space-y-6 before:absolute before:inset-y-0 before:left-[19px] before:w-px before:bg-border/60">
                  {item.approvals && item.approvals.length > 0 ? (
                    item.approvals.map((approval: any, index: number) => (
                      <div key={index} className="relative pl-12">
                        <div className="absolute left-0 top-0 mt-0.5 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-sm ring-4 ring-background z-10">
                          {getStatusIcon(approval.status)}
                        </div>
                        <div className="flex flex-col gap-1.5 p-4 rounded-xl border border-border/45 bg-muted/10">
                          <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border/20 pb-2 mb-1">
                            <span className="font-bold text-sm text-foreground wrap-break-word max-w-[70%]">{approval.approver_name}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                            <Badge variant={getBadgeVariant(approval.status)} size="sm" className="border-dashed font-bold">
                              {approval.status}
                            </Badge>
                            <span className="text-muted-foreground/40">•</span>
                            <span className="text-[10px] font-semibold text-muted-foreground/80">
                              {format(new Date(approval.updated_at), "dd MMM yyyy HH:mm", { locale: idLocale })}
                            </span>
                          </div>
                          {approval.note && (
                            <p className="mt-1 text-xs text-muted-foreground p-3 bg-background rounded-lg border-l-2 border-primary/20 italic leading-relaxed">
                              "{approval.note}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="pl-12 text-xs text-muted-foreground italic">
                      Belum ada riwayat persetujuan.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="p-6 text-center text-muted-foreground font-semibold">
            Data tidak ditemukan.
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
