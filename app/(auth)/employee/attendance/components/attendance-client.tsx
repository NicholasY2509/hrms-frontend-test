"use client";

import * as React from "react";
import { useEmployeeAttendanceHistory } from "@/modules/attendance/attendances/hooks/use-attendance";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { startOfMonth, format, isAfter, isBefore } from "date-fns";
import { PageHeader } from "@/components/layout/page-header";
import { AttendanceCard } from "@/modules/attendance/attendances/components/employee-attendance-card";
import { DetailSheet } from "@/modules/attendance/attendances/components/employee-attendance-detail-sheet";
import { EmployeeAttendanceRecord } from "@/modules/attendance/attendances/types";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  CheckmarkCircle01Icon,
  CancelCircleIcon,
  ActivityIcon,
  Clock01Icon
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

export function AttendanceClient() {
  // Initialize to start of this month until today
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  const [selectedRecord, setSelectedRecord] = React.useState<EmployeeAttendanceRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  // Formulate dates params
  const params = React.useMemo(() => {
    return {
      start_date: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "",
      end_date: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "",
    };
  }, [dateRange]);

  const { records, summary, isLoading } = useEmployeeAttendanceHistory(params);

  const handleViewDetail = (record: EmployeeAttendanceRecord) => {
    setSelectedRecord(record);
    setIsDetailOpen(true);
  };

  const getSummaryColor = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("hadir")) {
      return {
        bg: "bg-emerald-500/5 border-emerald-500/10 dark:bg-emerald-500/10",
        text: "text-emerald-600 dark:text-emerald-400",
        bar: "bg-emerald-500",
        icon: CheckmarkCircle01Icon,
      };
    }
    if (n.includes("libur") || n.includes("off")) {
      return {
        bg: "bg-zinc-500/5 border-zinc-500/10 dark:bg-zinc-500/10",
        text: "text-zinc-500 dark:text-zinc-400",
        bar: "bg-zinc-500",
        icon: Calendar01Icon,
      };
    }
    if (n.includes("terlambat")) {
      return {
        bg: "bg-amber-500/5 border-amber-500/10 dark:bg-amber-500/10",
        text: "text-amber-500 dark:text-amber-400",
        bar: "bg-amber-500",
        icon: Clock01Icon,
      };
    }
    if (n.includes("cuti") || n.includes("izin") || n.includes("sakit")) {
      return {
        bg: "bg-sky-500/5 border-sky-500/10 dark:bg-sky-500/10",
        text: "text-sky-500 dark:text-sky-400",
        bar: "bg-sky-500",
        icon: ActivityIcon,
      };
    }
    return {
      bg: "bg-rose-500/5 border-rose-500/10 dark:bg-rose-500/10",
      text: "text-rose-500 dark:text-rose-400",
      bar: "bg-rose-500",
      icon: CancelCircleIcon,
    };
  };

  return (
    <div className="flex-1 space-y-6 pb-24">
      {/* Page Header */}
      <PageHeader
        title="Riwayat Kehadiran"
        description="Pantau, saring, dan analisa catatan presensi harian serta log scan Anda."
      />

      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm shadow-sm">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none">
            Filter Rentang Tanggal
          </span>
          <p className="text-[10px] text-muted-foreground/85 font-medium mt-0.5">
            Saring presensi masuk/keluar sesuai rentang waktu yang Anda inginkan
          </p>
        </div>
        <div className="w-full sm:w-[320px] shrink-0">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            placeholder="Rentang Tanggal Presensi"
            className="w-full h-10 font-bold border-border/50 shadow-sm"
          />
        </div>
      </div>

      {/* Summary Section */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4 border border-border/40 bg-card/65 flex flex-col gap-3">
              <Skeleton className="h-4 w-1/3 rounded" />
              <Skeleton className="h-6 w-2/3 rounded-lg" />
              <Skeleton className="h-1.5 w-full rounded-full" />
            </Card>
          ))}
        </div>
      ) : (
        summary && summary.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {summary.map((item, idx) => {
              const style = getSummaryColor(item.name);
              return (
                <Card
                  key={idx}
                  className={cn(
                    "p-4 border backdrop-blur-sm shadow-sm relative overflow-hidden transition-all duration-300 flex flex-col gap-2.5",
                    style.bg
                  )}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/80 leading-none">
                      {item.name}
                    </span>
                    <HugeiconsIcon icon={style.icon} className={cn("h-4 w-4 shrink-0", style.text)} />
                  </div>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="font-extrabold text-2xl text-foreground tracking-tight leading-none">
                      {item.count}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase leading-none">
                      Hari
                    </span>
                  </div>

                  {item.percentage > 0 && (
                    <div className="w-full mt-1.5 space-y-1">
                      <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground">
                        <span>Rasio</span>
                        <span className={style.text}>{item.percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all duration-500", style.bar)}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )
      )}

      {/* Main Records Section */}
      {isLoading ? (
        <div className="flex flex-col gap-2.5">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-3.5 pl-5 border border-border/40 bg-card/65 flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1 w-24 shrink-0">
                <Skeleton className="h-3 w-12 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
              <div className="flex-1 flex gap-5 border-l border-border/45 pl-5">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full shrink-0" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/25 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/75 leading-none">
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
            <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-xl bg-card/20 min-h-[220px]">
              <HugeiconsIcon icon={Calendar01Icon} className="h-8 w-8 text-muted-foreground/60 mb-3.5" />
              <p className="font-extrabold text-sm text-foreground">Tidak Ada Riwayat Presensi</p>
              <p className="text-xs text-muted-foreground/80 mt-1 max-w-[280px] leading-relaxed">
                Tidak ditemukan data presensi masuk atau keluar untuk rentang tanggal yang dipilih.
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
          setIsDetailOpen(false);
          setSelectedRecord(null);
        }}
      />
    </div>
  );
}
