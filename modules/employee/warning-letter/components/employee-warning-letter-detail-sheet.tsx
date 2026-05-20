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
import { useWarningLetterEmployeeDetail } from "@/modules/employee/warning-letter/hooks/use-warning-letter";
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
  DocumentValidationIcon
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

interface DetailSheetProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DetailSheet({ id: warningId, isOpen, onClose }: DetailSheetProps) {
  const { item, isLoading } = useWarningLetterEmployeeDetail(warningId);

  const getStatusIcon = (status: string | null) => {
    if (!status) return <HugeiconsIcon icon={Clock01Icon} className="h-4 w-4 text-amber-500" />;
    const s = status.toLowerCase();
    if (s.includes("settled") || s.includes("selesai"))
      return <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-4 w-4 text-primary" />;
    if (s.includes("approved") || s.includes("disetujui"))
      return <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-4 w-4 text-emerald-500" />;
    if (s.includes("rejected") || s.includes("ditolak"))
      return <HugeiconsIcon icon={CancelCircleIcon} className="h-4 w-4 text-rose-500" />;
    return <HugeiconsIcon icon={Clock01Icon} className="h-4 w-4 text-amber-500" />;
  };

  const getBadgeVariant = (status: string | null) => {
    if (!status) return "outline";
    const s = status.toLowerCase();
    if (s.includes("settled") || s.includes("selesai")) return "default";
    if (s.includes("approved") || s.includes("disetujui")) return "success";
    if (s.includes("rejected") || s.includes("ditolak")) return "destructive";
    if (s.includes("pending") || s.includes("waiting") || s.includes("menunggu")) return "warning";
    return "outline";
  };

  const getSpColorClass = (name: string) => {
    const s = name.toLowerCase();
    if (s.includes("2")) {
      return "bg-orange-500/10 text-orange-600 border-orange-500/20";
    }
    if (s.includes("3") || s.includes("terakhir") || s.includes("third") || s.includes("last")) {
      return "bg-red-500/10 text-red-600 border-red-500/20";
    }
    return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
  };

  const typeName = item?.warning_letter_type?.name || "Surat Peringatan";

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[540px] p-0 border-l border-border/50 bg-background/95 backdrop-blur-md">
        <div className="h-1 w-full bg-yellow-500" />

        <SheetHeader className="p-6 pb-0">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <SheetTitle className="text-xl font-bold tracking-tight">Detail Surat Peringatan</SheetTitle>
              {item && (
                <div className="flex gap-2">
                  <Badge variant="outline" className={cn("border-dashed font-bold", getSpColorClass(typeName))}>
                    {typeName}
                  </Badge>
                  <Badge variant={getBadgeVariant(item.status)} size="sm" className="border-dashed font-bold">
                    {item.status || "DRAFT"}
                  </Badge>
                </div>
              )}
            </div>
            <SheetDescription className="text-muted-foreground/80 font-medium leading-normal">
              Informasi lengkap mengenai surat peringatan resmi, masa berlaku, dan riwayat persetujuan.
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
                {/* Employee Info */}
                <div className="flex items-start gap-4 p-4 rounded-xl border border-border/40 bg-muted/20">
                  <div className="mt-0.5 p-2 bg-yellow-500/10 text-yellow-600 rounded-lg shrink-0">
                    <HugeiconsIcon icon={UserIcon} className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1.5">Penerima SP</p>
                    <p className="font-bold text-sm text-foreground leading-snug wrap-break-word">{item.employee.name}</p>
                    <p className="text-[10px] font-semibold text-muted-foreground mt-1">NIK: {item.employee.nik}</p>
                  </div>
                </div>

                {/* Document No Info */}
                <div className="flex items-start gap-4 p-4 rounded-xl border border-border/40 bg-muted/20">
                  <div className="mt-0.5 p-2 bg-yellow-500/10 text-yellow-600 rounded-lg shrink-0">
                    <HugeiconsIcon icon={DocumentValidationIcon} className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1.5">Nomor Dokumen</p>
                    <p className="font-bold text-sm text-foreground leading-snug wrap-break-word">{item.document_no}</p>
                    <p className="text-[10px] font-semibold text-muted-foreground mt-1">
                      Diterbitkan pada {item.warning_at ? format(new Date(item.warning_at), "dd MMMM yyyy", { locale: idLocale }) : "-"}
                    </p>
                  </div>
                </div>

                {/* Validity Period */}
                <div className="flex items-start gap-4 p-4 rounded-xl border border-border/40 bg-muted/20">
                  <div className="mt-0.5 p-2 bg-yellow-500/10 text-yellow-600 rounded-lg shrink-0">
                    <HugeiconsIcon icon={Calendar01Icon} className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1.5">Masa Berlaku SP</p>
                    <p className="font-bold text-sm text-foreground leading-snug wrap-break-word">
                      {item.start_date ? format(new Date(item.start_date), "dd MMM yyyy", { locale: idLocale }) : ""}
                      {item.end_date && (
                        <> - {format(new Date(item.end_date), "dd MMM yyyy", { locale: idLocale })}</>
                      )}
                    </p>
                    <p className="text-[10px] font-semibold text-muted-foreground mt-1">
                      Masa hukuman/peringatan resmi dari HRD
                    </p>
                  </div>
                </div>
              </div>

              {/* Reason Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/75">
                  <HugeiconsIcon icon={Message01Icon} className="h-3.5 w-3.5" />
                  <span>Alasan / Keterangan Pelanggaran</span>
                </div>
                <div className="p-4 bg-muted/20 rounded-xl border border-border/40 italic text-sm text-muted-foreground leading-relaxed wrap-break-word">
                  "{item.note ?? 'Tidak ada keterangan tambahan.'}"
                </div>
              </div>

              {/* Attachment Section */}
              {item.attachment_url && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/75">
                    <HugeiconsIcon icon={FileAttachmentIcon} className="h-3.5 w-3.5" />
                    <span>Lampiran Surat Resmi</span>
                  </div>
                  <a
                    href={item.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-muted/15 border border-border/40 rounded-xl hover:border-yellow-500/40 hover:bg-yellow-500/5 transition-all group"
                  >
                    <div className="p-2 bg-muted border border-border/40 rounded-lg group-hover:bg-yellow-500/10 group-hover:text-yellow-600">
                      <HugeiconsIcon icon={FileAttachmentIcon} className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-foreground leading-tight truncate">Unduh Dokumen SP</p>
                      <p className="text-[9px] font-semibold text-muted-foreground mt-0.5">Klik untuk melihat file lampiran resmi</p>
                    </div>
                  </a>
                </div>
              )}

              {/* Settlement Info if Settled */}
              {(item.confirmed_at || item.settled_at) && (
                <div className="space-y-3.5 p-4 rounded-xl border border-dashed border-border/60 bg-muted/5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Status Penyelesaian</p>
                  
                  {item.confirmed_at && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Tgl Konfirmasi:</span>
                      <span className="font-semibold text-foreground">
                        {format(new Date(item.confirmed_at), "dd MMM yyyy HH:mm", { locale: idLocale })}
                      </span>
                    </div>
                  )}
                  {item.settled_at && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Tgl Selesai / Settle:</span>
                      <span className="font-semibold text-primary">
                        {format(new Date(item.settled_at), "dd MMM yyyy HH:mm", { locale: idLocale })}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Approval History Section */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/75">
                  <HugeiconsIcon icon={Clock01Icon} className="h-3.5 w-3.5" />
                  <span>Riwayat Persetujuan & Penerbitan</span>
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
                            <span className="font-bold text-sm text-foreground wrap-break-word max-w-[70%]">{approval.approver_name || "System/HRD"}</span>
                            <span className="text-[9px] uppercase font-bold text-muted-foreground bg-muted border border-border/50 px-2 py-0.5 rounded-full shrink-0">
                              {approval.role || "HRD"}
                            </span>
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
                      Belum ada riwayat persetujuan/penerbitan yang tercatat.
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
