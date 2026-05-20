import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, Calendar01Icon, Warning } from "@hugeicons/core-free-icons";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { EmployeeDashboardData } from "@/modules/system/types/dashboard";

interface TodayAttendanceCardProps {
  attendance: EmployeeDashboardData["attendance"];
}

export function TodayAttendanceCard({ attendance }: TodayAttendanceCardProps) {
  // Helper to format shift/scan times
  const formatTime = (dateTimeStr: string | null) => {
    if (!dateTimeStr) return "";
    try {
      if (dateTimeStr.includes(" ")) {
        return dateTimeStr.split(" ")[1].substring(0, 5);
      }
      return dateTimeStr.substring(0, 5);
    } catch {
      return "";
    }
  };

  const shiftStart = formatTime(attendance.shift_start);
  const shiftEnd = formatTime(attendance.shift_end);
  const checkInTime = attendance.check_in ? attendance.check_in.substring(0, 5) : null;
  const checkOutTime = attendance.check_out ? attendance.check_out.substring(0, 5) : null;

  return (
    <Card className="border border-border/40 bg-card shadow-xs relative overflow-hidden flex flex-col justify-between">
      {/* Stripe Indicator based on state */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1.5",
        attendance.is_clocked_in ? "bg-emerald-500" : checkInTime ? "bg-amber-500" : "bg-zinc-400"
      )} />

      <CardHeader className="pb-2.5 pl-6">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-sm font-semibold text-muted-foreground/80">
              Presensi Hari Ini
            </CardTitle>
            <CardDescription className="text-[10.5px] font-medium text-muted-foreground/75 mt-0.5">
              {format(new Date(), "EEEE, dd MMMM yyyy", { locale: idLocale })}
            </CardDescription>
          </div>
          <Badge variant={attendance.is_clocked_in ? "success" : checkInTime ? "warning" : "outline"} className="font-semibold text-[10px] h-5 py-0 px-2">
            {attendance.is_clocked_in ? "Sedang Bekerja" : checkInTime ? "Sudah Keluar" : "Belum Absen"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pl-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Clock In */}
          <div className="p-3 rounded-lg bg-muted/40 border border-border/30 flex items-center gap-3">
            <div className="size-8.5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={Clock01Icon} className="size-4.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-muted-foreground">
                Scan Masuk
              </span>
              <strong className="text-sm font-bold text-foreground leading-none">
                {checkInTime || "--:--"}
              </strong>
            </div>
          </div>

          {/* Clock Out */}
          <div className="p-3 rounded-lg bg-muted/40 border border-border/30 flex items-center gap-3">
            <div className="size-8.5 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={Clock01Icon} className="size-4.5 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-muted-foreground">
                Scan Keluar
              </span>
              <strong className="text-sm font-bold text-foreground leading-none">
                {checkOutTime || "--:--"}
              </strong>
            </div>
          </div>
        </div>

        {/* Shift Schedule Info */}
        <div className="flex justify-between items-center text-xs border-t border-border/30 pt-3">
          <span className="text-muted-foreground font-medium flex items-center gap-1.5">
            <HugeiconsIcon icon={Calendar01Icon} className="size-3.5 text-muted-foreground/75" />
            Jadwal Kerja:
          </span>
          <strong className="text-foreground font-bold">
            {shiftStart && shiftEnd ? `${shiftStart} - ${shiftEnd}` : "Libur"}
          </strong>
        </div>

        {/* Lock Alert if present */}
        {attendance.is_locked && (
          <div className="rounded-lg border border-dashed border-amber-500/35 bg-amber-500/5 p-2 text-[10px] text-amber-600 dark:text-amber-400 flex items-start gap-1.5 mt-2">
            <HugeiconsIcon icon={Warning} className="size-3.5 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">{attendance.lock_title || "Absensi Terkunci"}</span>
              <p className="text-muted-foreground font-medium leading-relaxed">
                {attendance.lock_message}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
