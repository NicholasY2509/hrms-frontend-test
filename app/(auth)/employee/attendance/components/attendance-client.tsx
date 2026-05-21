"use client"

import * as React from "react"
import { useEmployeeAttendanceHistory } from "@/modules/attendance/attendances/hooks/use-attendance"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { DateRange } from "react-day-picker"
import { startOfMonth, format, isAfter, isBefore } from "date-fns"
import { PageHeader } from "@/components/layout/page-header"
import { AttendanceCard } from "@/modules/attendance/attendances/components/employee-attendance-card"
import { DetailSheet } from "@/modules/attendance/attendances/components/employee-attendance-detail-sheet"
import { EmployeeAttendanceRecord } from "@/modules/attendance/attendances/types"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar01Icon,
  CheckmarkCircle01Icon,
  CancelCircleIcon,
  ActivityIcon,
  Clock01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export function AttendanceClient() {
  // Initialize to start of this month until today
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date(),
  })

  const [selectedRecord, setSelectedRecord] =
    React.useState<EmployeeAttendanceRecord | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)

  // Formulate dates params
  const params = React.useMemo(() => {
    return {
      start_date: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "",
      end_date: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "",
    }
  }, [dateRange])

  const { records, summary, isLoading } = useEmployeeAttendanceHistory(params)

  const handleViewDetail = (record: EmployeeAttendanceRecord) => {
    setSelectedRecord(record)
    setIsDetailOpen(true)
  }

  const getSummaryColor = (name: string) => {
    const n = name.toLowerCase()
    if (n.includes("hadir")) {
      return {
        bg: "bg-emerald-500/5 border-emerald-500/10 dark:bg-emerald-500/10",
        text: "text-emerald-600 dark:text-emerald-400",
        bar: "bg-emerald-500",
        icon: CheckmarkCircle01Icon,
      }
    }
    if (n.includes("libur") || n.includes("off")) {
      return {
        bg: "bg-zinc-500/5 border-zinc-500/10 dark:bg-zinc-500/10",
        text: "text-zinc-500 dark:text-zinc-400",
        bar: "bg-zinc-500",
        icon: Calendar01Icon,
      }
    }
    if (n.includes("terlambat")) {
      return {
        bg: "bg-amber-500/5 border-amber-500/10 dark:bg-amber-500/10",
        text: "text-amber-500 dark:text-amber-400",
        bar: "bg-amber-500",
        icon: Clock01Icon,
      }
    }
    if (n.includes("cuti") || n.includes("izin") || n.includes("sakit")) {
      return {
        bg: "bg-sky-500/5 border-sky-500/10 dark:bg-sky-500/10",
        text: "text-sky-500 dark:text-sky-400",
        bar: "bg-sky-500",
        icon: ActivityIcon,
      }
    }
    return {
      bg: "bg-rose-500/5 border-rose-500/10 dark:bg-rose-500/10",
      text: "text-rose-500 dark:text-rose-400",
      bar: "bg-rose-500",
      icon: CancelCircleIcon,
    }
  }

  return (
    <div className="flex-1 space-y-6 pb-24">
      {/* Page Header */}
      <PageHeader
        title="Riwayat Kehadiran"
        description="Pantau, saring, dan analisa catatan presensi harian serta log scan Anda."
      />

      {/* Filter Section */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-border/40 bg-card/40 p-4 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1">
          <span className="text-xs leading-none font-bold tracking-widest text-muted-foreground uppercase">
            Filter Rentang Tanggal
          </span>
          <p className="mt-0.5 text-[10px] font-medium text-muted-foreground/85">
            Saring presensi masuk/keluar sesuai rentang waktu yang Anda inginkan
          </p>
        </div>
        <div className="w-full shrink-0 sm:w-[320px]">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            placeholder="Rentang Tanggal Presensi"
            className="h-10 w-full border-border/50 font-bold shadow-sm"
          />
        </div>
      </div>

      {/* Summary Section */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card
              key={i}
              className="flex flex-col gap-3 border border-border/40 bg-card/65 p-4"
            >
              <Skeleton className="h-4 w-1/3 rounded" />
              <Skeleton className="h-6 w-2/3 rounded-lg" />
              <Skeleton className="h-1.5 w-full rounded-full" />
            </Card>
          ))}
        </div>
      ) : (
        summary &&
        summary.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {summary.map((item, idx) => {
              const style = getSummaryColor(item.name)
              return (
                <Card
                  key={idx}
                  className={cn(
                    "relative flex flex-col gap-2.5 overflow-hidden border p-4 shadow-sm backdrop-blur-sm transition-all duration-300",
                    style.bg
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] leading-none font-extrabold tracking-widest text-muted-foreground/80 uppercase">
                      {item.name}
                    </span>
                    <HugeiconsIcon
                      icon={style.icon}
                      className={cn("h-4 w-4 shrink-0", style.text)}
                    />
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-1">
                    <span className="text-2xl leading-none font-extrabold tracking-tight text-foreground">
                      {item.count}
                    </span>
                    <span className="text-[10px] leading-none font-bold text-muted-foreground uppercase">
                      Hari
                    </span>
                  </div>

                  {item.percentage > 0 && (
                    <div className="mt-1.5 w-full space-y-1">
                      <div className="flex items-center justify-between text-[9px] font-bold text-muted-foreground">
                        <span>Rasio</span>
                        <span className={style.text}>{item.percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            style.bar
                          )}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        )
      )}

      {/* Main Records Section */}
      {isLoading ? (
        <div className="flex flex-col gap-2.5">
          {[...Array(6)].map((_, i) => (
            <Card
              key={i}
              className="flex items-center justify-between gap-4 border border-border/40 bg-card/65 p-3.5 pl-5"
            >
              <div className="flex w-24 shrink-0 flex-col gap-1">
                <Skeleton className="h-3 w-12 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
              <div className="flex flex-1 gap-5 border-l border-border/45 pl-5">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
              <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/25 pb-2">
            <h2 className="text-xs leading-none font-bold tracking-widest text-muted-foreground/75 uppercase">
              Catatan Log Presensi ({records.length})
            </h2>
          </div>

          {records.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {records.map((record) => (
                <AttendanceCard
                  key={record.id}
                  record={record}
                  onClick={handleViewDetail}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed bg-card/20 p-12 text-center">
              <HugeiconsIcon
                icon={Calendar01Icon}
                className="mb-3.5 h-8 w-8 text-muted-foreground/60"
              />
              <p className="text-sm font-extrabold text-foreground">
                Tidak Ada Riwayat Presensi
              </p>
              <p className="mt-1 max-w-[280px] text-xs leading-relaxed text-muted-foreground/80">
                Tidak ditemukan data presensi masuk atau keluar untuk rentang
                tanggal yang dipilih.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Detail Slide-out Sheet */}
      <DetailSheet
        record={selectedRecord}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false)
          setSelectedRecord(null)
        }}
      />
    </div>
  )
}
