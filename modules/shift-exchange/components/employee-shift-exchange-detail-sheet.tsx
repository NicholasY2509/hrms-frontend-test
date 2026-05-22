"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useShiftExchangeDetail } from "@/modules/shift-exchange/hooks/use-shift-exchange"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar01Icon,
  UserIcon,
  Timer01Icon,
  Message01Icon,
  CheckmarkCircle01Icon,
  CancelCircleIcon,
  Clock01Icon,
} from "@hugeicons/core-free-icons"

interface DetailSheetProps {
  id: number
  isOpen: boolean
  onClose: () => void
}

export function ShiftExchangeDetailSheet({
  id: shiftExchangeId,
  isOpen,
  onClose,
}: DetailSheetProps) {
  const { item, isLoading } = useShiftExchangeDetail(shiftExchangeId)

  const getStatusIcon = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes("settled"))
      return (
        <HugeiconsIcon
          icon={CheckmarkCircle01Icon}
          className="h-4 w-4 text-primary"
        />
      )
    if (s.includes("approved"))
      return (
        <HugeiconsIcon
          icon={CheckmarkCircle01Icon}
          className="h-4 w-4 text-emerald-500"
        />
      )
    if (s.includes("rejected"))
      return (
        <HugeiconsIcon
          icon={CancelCircleIcon}
          className="h-4 w-4 text-rose-500"
        />
      )
    return (
      <HugeiconsIcon icon={Clock01Icon} className="h-4 w-4 text-amber-500" />
    )
  }

  const getBadgeVariant = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes("settled")) return "default"
    if (s.includes("approved")) return "success"
    if (s.includes("rejected")) return "destructive"
    if (s.includes("pending") || s.includes("waiting")) return "warning"
    return "outline"
  }

  const formatTimeOnly = (dateTimeStr: string | undefined) => {
    if (!dateTimeStr) return ""
    const match = dateTimeStr.match(/(\d{2}):(\d{2})/)
    return match ? `${match[1]}:${match[2]}` : dateTimeStr
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="border-l border-border/50 bg-background/95 p-0 backdrop-blur-md sm:max-w-[540px]">
        <div className="h-1 w-full bg-amber-500" />

        <SheetHeader className="p-6 pb-0">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <SheetTitle className="text-xl font-bold tracking-tight">
                Detail Tukar Shift
              </SheetTitle>
              {item && (
                <div className="flex">
                  <Badge
                    variant={getBadgeVariant(item.status)}
                    size="sm"
                    className="border-dashed font-bold"
                  >
                    {item.status}
                  </Badge>
                </div>
              )}
            </div>
            <SheetDescription className="leading-normal font-medium text-muted-foreground/80">
              Informasi lengkap mengenai penukaran shift dan riwayat
              persetujuan.
            </SheetDescription>
          </div>
        </SheetHeader>

        <Separator className="mt-6 border-border/50" />

        {isLoading ? (
          <div className="space-y-6 p-6">
            <div className="h-8 w-2/3 animate-pulse rounded-lg bg-muted" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="h-16 animate-pulse rounded-xl bg-muted" />
              <div className="h-16 animate-pulse rounded-xl bg-muted" />
            </div>
            <div className="h-24 w-full animate-pulse rounded-xl bg-muted" />
            <div className="h-40 w-full animate-pulse rounded-xl bg-muted" />
          </div>
        ) : item ? (
          <ScrollArea className="h-[calc(100vh-125px)]">
            <div className="space-y-6 p-6 pb-12">
              {/* Core Details Grid */}
              <div className="grid grid-cols-1 gap-3.5">
                <div className="flex items-start gap-4 rounded-xl border border-border/40 bg-muted/20 p-4">
                  <div className="mt-0.5 shrink-0 rounded-lg bg-amber-500/10 p-2 text-amber-600">
                    <HugeiconsIcon icon={UserIcon} className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="mb-1.5 text-[10px] leading-none font-bold tracking-widest text-muted-foreground uppercase">
                      Pengaju
                    </p>
                    <p className="text-sm leading-snug font-bold wrap-break-word text-foreground">
                      {item.employee.name}
                    </p>
                    <p className="mt-1 text-[10px] font-semibold text-muted-foreground">
                      NIK: {item.employee.nik}
                    </p>
                  </div>
                </div>

                {item.exchange_with_employee && (
                  <div className="flex items-start gap-4 rounded-xl border border-border/40 bg-muted/20 p-4">
                    <div className="mt-0.5 shrink-0 rounded-lg bg-amber-500/10 p-2 text-amber-600">
                      <HugeiconsIcon icon={UserIcon} className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="mb-1.5 text-[10px] leading-none font-bold tracking-widest text-muted-foreground uppercase">
                        Karyawan Tujuan
                      </p>
                      <p className="text-sm leading-snug font-bold wrap-break-word text-foreground">
                        {item.exchange_with_employee.name}
                      </p>
                      <p className="mt-1 text-[10px] font-semibold text-muted-foreground">
                        NIK: {item.exchange_with_employee.nik}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4 rounded-xl border border-border/40 bg-muted/20 p-4">
                  <div className="mt-0.5 shrink-0 rounded-lg bg-amber-500/10 p-2 text-amber-600">
                    <HugeiconsIcon
                      icon={Calendar01Icon}
                      className="h-4.5 w-4.5"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="mb-1.5 text-[10px] leading-none font-bold tracking-widest text-muted-foreground uppercase">
                      Tanggal Penukaran
                    </p>
                    <p className="text-sm leading-snug font-bold wrap-break-word text-foreground">
                      {format(new Date(item.date), "dd MMMM yyyy", {
                        locale: idLocale,
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border border-border/40 bg-muted/20 p-4">
                  <div className="mt-0.5 shrink-0 rounded-lg bg-amber-500/10 p-2 text-amber-600">
                    <HugeiconsIcon icon={Timer01Icon} className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="mb-1.5 text-[10px] leading-none font-bold tracking-widest text-muted-foreground uppercase">
                      Shift Asal
                    </p>
                    <p className="text-sm leading-snug font-bold wrap-break-word text-foreground">
                      {item.original_working_hour.name}
                    </p>
                    <p className="mt-1 text-[10px] font-semibold text-muted-foreground">
                      Pukul{" "}
                      {formatTimeOnly(item.original_working_hour.clock_in)} -{" "}
                      {formatTimeOnly(item.original_working_hour.clock_out)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border border-border/40 bg-muted/20 p-4">
                  <div className="mt-0.5 shrink-0 rounded-lg bg-amber-500/10 p-2 text-amber-600">
                    <HugeiconsIcon icon={Timer01Icon} className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="mb-1.5 text-[10px] leading-none font-bold tracking-widest text-muted-foreground uppercase">
                      Shift Tujuan
                    </p>
                    <p className="text-sm leading-snug font-bold wrap-break-word text-amber-600">
                      {item.requested_working_hour.name}
                    </p>
                    <p className="mt-1 text-[10px] font-semibold text-muted-foreground">
                      Pukul{" "}
                      {formatTimeOnly(item.requested_working_hour.clock_in)} -{" "}
                      {formatTimeOnly(item.requested_working_hour.clock_out)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Note Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-muted-foreground/75 uppercase">
                  <HugeiconsIcon icon={Message01Icon} className="h-3.5 w-3.5" />
                  <span>Alasan Tukar Shift</span>
                </div>
                <div className="rounded-xl border border-border/40 bg-muted/20 p-4 text-sm leading-relaxed wrap-break-word text-muted-foreground italic">
                  "{item.reason ?? "Tidak ada catatan."}"
                </div>
              </div>

              {/* Approval History Section */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-muted-foreground/75 uppercase">
                  <HugeiconsIcon icon={Clock01Icon} className="h-3.5 w-3.5" />
                  <span>Riwayat Persetujuan</span>
                </div>

                <div className="relative space-y-6 before:absolute before:inset-y-0 before:left-[19px] before:w-px before:bg-border/60">
                  {item.approvals && item.approvals.length > 0 ? (
                    item.approvals.map((approval: any, index: number) => (
                      <div key={index} className="relative pl-12">
                        <div className="absolute top-0 left-0 z-10 mt-0.5 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-sm ring-4 ring-background">
                          {getStatusIcon(approval.status)}
                        </div>
                        <div className="flex flex-col gap-1.5 rounded-xl border border-border/45 bg-muted/10 p-4">
                          <div className="mb-1 flex flex-wrap items-start justify-between gap-2 border-b border-border/20 pb-2">
                            <span className="max-w-[70%] text-sm font-bold wrap-break-word text-foreground">
                              {approval.approver_name}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                            <Badge
                              variant={getBadgeVariant(approval.status)}
                              size="sm"
                              className="border-dashed font-bold"
                            >
                              {approval.status}
                            </Badge>
                            <span className="text-muted-foreground/40">•</span>
                            <span className="text-[10px] font-semibold text-muted-foreground/80">
                              {format(
                                new Date(approval.updated_at),
                                "dd MMM yyyy HH:mm",
                                { locale: idLocale }
                              )}
                            </span>
                          </div>
                          {approval.note && (
                            <p className="mt-1 rounded-lg border-l-2 border-primary/20 bg-background p-3 text-xs leading-relaxed text-muted-foreground italic">
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
          <div className="p-6 text-center font-semibold text-muted-foreground">
            Data tidak ditemukan.
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
