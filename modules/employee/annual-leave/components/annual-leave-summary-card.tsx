import * as React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAnnualLeaveEmployeeSummary } from "../hooks/use-annual-leave"
import { Skeleton } from "@/components/ui/skeleton"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  Time02Icon
} from "@hugeicons/core-free-icons"

interface AnnualLeaveSummaryCardProps {
  employeeId: number | string
  year?: string
}

export function AnnualLeaveSummaryCard({ employeeId, year }: AnnualLeaveSummaryCardProps) {
  const [selectedYear, setSelectedYear] = React.useState<number>(year ? Number(year) : new Date().getFullYear())
  const currentYear = selectedYear
  const lastYear = currentYear - 1

  const { summary, isLoading } = useAnnualLeaveEmployeeSummary(employeeId, { year: currentYear })

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <div className="pb-4 border-b mb-6 flex items-center justify-between w-full">
          <h3 className="text-base font-semibold flex items-center justify-between w-full">
            <span className="flex items-center gap-2">
              <HugeiconsIcon icon={Time02Icon} className="w-5 h-5 text-primary" />
              Ringkasan Saldo Cuti
            </span>
            <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(Number(v))}>
              <SelectTrigger className="w-[120px] h-8 text-xs font-normal">
                <SelectValue placeholder="Pilih Tahun" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(5)].map((_, i) => {
                  const y = new Date().getFullYear() - i + 1;
                  return <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                })}
              </SelectContent>
            </Select>
          </h3>
        </div>
        <div className="pt-2">
          <div className="flex flex-col items-stretch gap-4">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!summary) return null

  const bb = summary.balance_before
  const ba = summary.balance_after

  return (
    <div className="flex flex-col">
      <div className="pb-4 border-b mb-6 flex items-center justify-between w-full">
        <h3 className="text-base font-semibold flex items-center justify-between w-full">
          <span className="flex items-center gap-2">
            Ringkasan Saldo Cuti
          </span>
          <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(Number(v))}>
            <SelectTrigger className="w-[120px] h-8 text-xs font-normal">
              <SelectValue placeholder="Pilih Tahun" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(10)].map((_, i) => {
                const y = new Date().getFullYear() - i + 1;
                return <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
              })}
            </SelectContent>
          </Select>
        </h3>
      </div>
      <div className="pt-2">
        <div className="flex flex-col items-stretch gap-4">

          {/* Box 1: Saldo Awal */}
          <div className="w-full bg-muted/20 border rounded-lg p-4">
            <h4 className="font-semibold text-sm text-foreground/90 mb-3">Saldo Awal <span className="font-normal text-muted-foreground ml-1">({currentYear})</span></h4>
            {bb ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Sisa Tahun {lastYear}</span>
                  <span className="font-mono text-foreground font-medium">{bb[lastYear] ?? 0}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Hak Cuti {currentYear}</span>
                  <span className="font-mono text-foreground font-medium">{bb[currentYear] ?? 0}</span>
                </div>
                <div className="pt-2 mt-2 border-t flex justify-between items-center">
                  <span className="text-xs font-semibold text-foreground/80">Total</span>
                  <span className="font-mono text-sm font-bold text-foreground">
                    {Number(bb[lastYear] ?? 0) + Number(bb[currentYear] ?? 0)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[60px] flex items-center justify-center">
                <span className="text-xs italic text-muted-foreground">Belum ada mutasi</span>
              </div>
            )}
          </div>

          {/* Box 2: Mutasi Berjalan */}
          <div className="w-full bg-muted/20 border rounded-lg p-4">
            <h4 className="font-semibold text-sm text-foreground/90 mb-3">Mutasi Berjalan</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Penambahan</span>
                <span className="font-mono text-emerald-600 font-medium">+{summary.total_tambah}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Pemakaian</span>
                <span className="font-mono text-rose-600 font-medium">-{summary.total_potong}</span>
              </div>
              <div className="pt-2 mt-2 border-t flex justify-between items-center">
                <span className="text-xs font-semibold text-foreground/80">Net</span>
                <span className={`font-mono text-sm font-bold ${summary.total_tambah - summary.total_potong > 0 ? 'text-emerald-600' : summary.total_tambah - summary.total_potong < 0 ? 'text-rose-600' : 'text-foreground'}`}>
                  {summary.total_tambah - summary.total_potong > 0 ? '+' : ''}{summary.total_tambah - summary.total_potong}
                </span>
              </div>
            </div>
          </div>

          {/* Box 3: Saldo Akhir */}
          <div className="w-full bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-semibold text-sm text-foreground/90 mb-3">Saldo Saat Ini</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Sisa Tahun {lastYear}</span>
                <span className="font-mono text-foreground font-medium">{ba?.annual_leave_2 ?? 0}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Sisa Tahun {currentYear}</span>
                <span className="font-mono text-foreground font-medium">{ba?.annual_leave_3 ?? 0}</span>
              </div>
              <div className="pt-2 mt-2 border-t border-primary/20 flex justify-between items-center">
                <span className="text-xs font-semibold text-primary">Total Sisa</span>
                <span className="font-mono text-lg font-bold text-primary leading-none">
                  {Number(ba?.annual_leave_2 ?? 0) + Number(ba?.annual_leave_3 ?? 0)}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
