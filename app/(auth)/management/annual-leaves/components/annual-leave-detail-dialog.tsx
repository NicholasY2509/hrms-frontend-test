"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AnnualLeave } from "@/modules/employee/annual-leave/types"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { ScrollArea } from "@/components/ui/scroll-area"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserIcon,
  Calendar01Icon,
  InformationCircleIcon,
  Clock01Icon,
} from "@hugeicons/core-free-icons"

interface AnnualLeaveDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: AnnualLeave | null
}

export function AnnualLeaveDetailDialog({
  open,
  onOpenChange,
  data,
}: AnnualLeaveDetailDialogProps) {
  if (!data) return null

  const isDeduction = data.status === "Potong"

  const renderBalance = (balanceObj: Record<string, number> | null) => {
    if (!balanceObj) return <span className="text-sm font-semibold mt-1">--</span>
    const entries = Object.entries(balanceObj)
    if (entries.length === 0) return <span className="text-sm font-semibold mt-1">0</span>

    return (
      <div className="flex flex-col gap-1.5 mt-2">
        {entries.map(([year, amount]) => (
          <div key={year} className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Tahun {year}</span>
            <span className="font-semibold">{amount} Hari</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[700px] dark:bg-zinc-950">
        <DialogHeader className="bg-primary/5 p-6 pb-4 dark:bg-primary/10">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <HugeiconsIcon icon={UserIcon} size={24} />
              </div>
              <div className="flex flex-col">
                <DialogTitle className="text-xl font-bold">
                  {data.employee.name}
                </DialogTitle>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    NIK: {data.employee.nik}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <HugeiconsIcon icon={Calendar01Icon} size={14} />
                    {format(new Date(data.annual_leave_at), "EEEE, dd MMMM yyyy", { locale: id })}
                  </div>
                </div>
              </div>
            </div>
            <Badge
              variant={isDeduction ? "destructive" : "default"}
              className="px-3 py-1 text-sm"
            >
              {data.status}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-8 p-6">
            {/* Overview Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <HugeiconsIcon icon={InformationCircleIcon} size={18} />
                Keterangan Mutasi
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/50 p-4">
                <span className="text-sm font-medium">{data.description}</span>
                <Badge variant="outline" className="font-mono text-sm px-3 py-1 bg-background">
                  {isDeduction ? "-" : "+"}{data.total} Hari
                </Badge>
              </div>
            </section>

            {/* Balance Cards */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <HugeiconsIcon icon={Clock01Icon} size={18} />
                Ringkasan Saldo Cuti
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1 rounded-xl border border-border/50 bg-muted/50 p-4">
                  <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Saldo Sebelum
                  </span>
                  {renderBalance(data.balance_before)}
                </div>
                <div className={`flex flex-col gap-1 rounded-xl border p-4 ${isDeduction ? 'border-rose-100 bg-rose-50/50 dark:border-rose-500/20 dark:bg-rose-500/10' : 'border-emerald-100 bg-emerald-50/50 dark:border-emerald-500/20 dark:bg-emerald-500/10'}`}>
                  <span className={`text-[10px] font-bold tracking-wider uppercase ${isDeduction ? 'text-rose-600/70 dark:text-rose-400/70' : 'text-emerald-600/70 dark:text-emerald-400/70'}`}>
                    Saldo Sesudah
                  </span>
                  {renderBalance(data.balance_after)}
                </div>
              </div>
            </section>

            {/* Deduction Details Table */}
            {data.deduction_details && data.deduction_details.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <HugeiconsIcon icon={Clock01Icon} size={18} />
                  Riwayat Mutasi (Bucket Tahun)
                </div>
                <div className="overflow-hidden rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                          Tahun Ember (Bucket)
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                          Jumlah Hari
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.deduction_details.map((detail, index) => (
                        <tr
                          key={index}
                          className="border-b border-border/50 transition-colors last:border-0 hover:bg-muted/30"
                        >
                          <td className="px-4 py-3 font-medium">Cuti Tahun {detail.year}</td>
                          <td className={`px-4 py-3 text-right font-semibold ${isDeduction ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                            {isDeduction ? "-" : "+"}{detail.amount} Hari
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
