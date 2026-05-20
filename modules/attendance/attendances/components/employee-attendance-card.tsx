"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmployeeAttendanceRecord } from "@/modules/attendance/attendances/types";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ClockArrowUpFreeIcons,
  ClockArrowDown,
  LockIcon,
  SmartPhone01Icon,
  ComputerIcon,
  InformationCircleIcon
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

interface AttendanceCardProps {
  record: EmployeeAttendanceRecord;
  onClick: (record: EmployeeAttendanceRecord) => void;
}

export function AttendanceCard({ record, onClick }: AttendanceCardProps) {
  const getStatusConfig = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("hadir")) {
      return {
        badge: "success",
        stripe: "bg-emerald-500",
      };
    }
    if (s.includes("libur") || s.includes("off")) {
      return {
        badge: "secondary",
        stripe: "bg-zinc-400",
      };
    }
    if (s.includes("terlambat")) {
      return {
        badge: "warning",
        stripe: "bg-amber-500",
      };
    }
    if (s.includes("cuti") || s.includes("izin")) {
      return {
        badge: "outline",
        stripe: "bg-sky-500",
      };
    }
    return {
      badge: "destructive",
      stripe: "bg-rose-500",
    };
  };

  const config = getStatusConfig(record.status);
  const parsedDate = new Date(record.attendance_at);
  const dayName = format(parsedDate, "EEEE", { locale: idLocale });
  const dateFormatted = format(parsedDate, "dd MMM yyyy", { locale: idLocale });

  const formatShiftTime = (dateTimeStr: string | null) => {
    if (!dateTimeStr) return "";
    try {
      const timePart = dateTimeStr.split(" ")[1];
      if (!timePart) return "";
      return timePart.substring(0, 5);
    } catch {
      return "";
    }
  };

  const shiftStart = formatShiftTime(record.shift_start);
  const shiftEnd = formatShiftTime(record.shift_end);

  const hasMobileScan = record.all_scans?.some(scan => scan.is_mobile) ?? false;
  const hasMachineScan = record.all_scans?.some(scan => !scan.is_mobile) ?? false;

  return (
    <Card
      onClick={() => onClick(record)}
      className="relative overflow-hidden border border-border/40 bg-card hover:bg-muted/30 transition-all duration-200 group hover:shadow-sm cursor-pointer select-none py-0"
    >
      {/* Left Accent Stripe */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1 transition-all duration-200 group-hover:w-1.5", config.stripe)} />

      <div className="p-3.5 pl-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        {/* Left Side: Date Block */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80 leading-none">
              {dayName}
            </span>
            <span className="font-extrabold text-sm text-foreground tracking-tight">
              {dateFormatted}
            </span>
          </div>
        </div>

        {/* Center Side: Combined Times (Compact Single Row) */}
        <div className="flex-1 flex flex-wrap items-center gap-x-5 gap-y-2 border-t sm:border-t-0 sm:border-l border-border/45 pt-3 sm:pt-0 sm:pl-5">
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon icon={ClockArrowUpFreeIcons} className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span className="text-xs text-muted-foreground">
              Masuk: <strong className="text-foreground font-extrabold">{record.check_in ? record.check_in.substring(0, 5) : "--:--"}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <HugeiconsIcon icon={ClockArrowDown} className="h-3.5 w-3.5 text-rose-500 shrink-0" />
            <span className="text-xs text-muted-foreground">
              Keluar: <strong className="text-foreground font-extrabold">{record.check_out ? record.check_out.substring(0, 5) : "--:--"}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold uppercase text-muted-foreground/60 tracking-wider">Shift:</span>
            <span className="text-xs font-semibold text-muted-foreground">
              {shiftStart && shiftEnd ? `${shiftStart} - ${shiftEnd}` : "Libur"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
            {hasMobileScan && (
              <Badge variant="outline" className="gap-1 bg-background/50 text-[9px] text-muted-foreground border-border/45 py-0 px-1.5 h-4.5 font-medium shrink-0">
                <HugeiconsIcon icon={SmartPhone01Icon} className="h-2.5 w-2.5 text-sky-500" />
                Mobile
              </Badge>
            )}
            {hasMachineScan && (
              <Badge variant="outline" className="gap-1 bg-background/50 text-[9px] text-muted-foreground border-border/45 py-0 px-1.5 h-4.5 font-medium shrink-0">
                <HugeiconsIcon icon={ComputerIcon} className="h-2.5 w-2.5 text-amber-500" />
                Mesin
              </Badge>
            )}
          </div>
        </div>

        {/* Right Side: Status and Lock Badges */}
        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
          {record.is_locked && (
            <Badge variant="outline" className="border-dashed flex items-center gap-1 text-[8px] font-bold text-muted-foreground/80 px-1.5 py-0 h-4.5 bg-background/50">
              <HugeiconsIcon icon={LockIcon} className="h-2.5 w-2.5" />
              Locked
            </Badge>
          )}
          <Badge variant={config.badge as any} size="sm" className="font-extrabold text-[9px] uppercase border-dashed h-5 px-2">
            {record.status}
          </Badge>
        </div>
      </div>

      {/* Mini lock warning if locked */}
      {record.is_locked && record.lock_title && (
        <div className="px-4 py-1.5 bg-yellow-500/5 border-t border-yellow-500/10 text-[9px] text-yellow-600 dark:text-yellow-500/80 flex items-center gap-1.5">
          <HugeiconsIcon icon={InformationCircleIcon} className="h-3 w-3 shrink-0" />
          <span className="font-extrabold">{record.lock_title}:</span>
          <span className="text-muted-foreground/90 font-semibold">{record.lock_message}</span>
        </div>
      )}
    </Card>
  );
}
