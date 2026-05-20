import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle01Icon,
  Calendar01Icon,
  Clock01Icon,
  ActivityIcon,
  CancelCircleIcon
} from "@hugeicons/core-free-icons";
import { EmployeeDashboardData } from "@/modules/system/types/dashboard";

interface AttendanceStatisticsChartProps {
  attendance_rate: number;
  attendance_summary: EmployeeDashboardData["attendance_summary"];
}

const getSummaryColor = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("hadir")) {
    return {
      bg: "bg-emerald-500/5 border-emerald-500/20",
      text: "text-emerald-500",
      bar: "bg-emerald-500",
      icon: CheckmarkCircle01Icon,
    };
  }
  if (n.includes("libur") || n.includes("off")) {
    return {
      bg: "bg-zinc-500/5 border-zinc-500/20",
      text: "text-zinc-400",
      bar: "bg-zinc-500",
      icon: Calendar01Icon,
    };
  }
  if (n.includes("terlambat")) {
    return {
      bg: "bg-amber-500/5 border-amber-500/30",
      text: "text-amber-500",
      bar: "bg-amber-500",
      icon: Clock01Icon,
    };
  }
  if (n.includes("cuti") || n.includes("izin") || n.includes("sakit")) {
    return {
      bg: "bg-sky-500/5 border-sky-500/30",
      text: "text-sky-500",
      bar: "bg-sky-500",
      icon: ActivityIcon,
    };
  }
  return {
    bg: "bg-rose-500/5 border-rose-500/20",
    text: "text-rose-500",
    bar: "bg-rose-500",
    icon: CancelCircleIcon,
  };
};

export function AttendanceStatisticsChart({
  attendance_rate,
  attendance_summary,
}: AttendanceStatisticsChartProps) {
  const radius = 55;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (attendance_rate / 100) * circumference;

  return (
    <Card className="border border-border/40 bg-card shadow-xs">
      <CardHeader className="pb-4 border-b border-border/25">
        <CardTitle className="text-sm font-semibold text-muted-foreground/90">
          Statistik Kehadiran Bulan Ini
        </CardTitle>
        <CardDescription className="text-xs font-medium text-muted-foreground/75 mt-1">
          Rangkuman log presensi and rasio kehadiran kerja Anda.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6">

          {/* Circular Gauge Box */}
          <div className="shrink-0 flex items-center justify-center p-6 rounded-2xl bg-muted/10 dark:bg-[#111113] border border-border/30 w-full md:w-[220px]">
            <div className="relative">
              <svg className="size-36 transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-muted/20"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-blue-600 transition-all duration-1000 ease-out"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center mt-1">
                <span className="font-bold text-2xl text-foreground tracking-tight leading-none">
                  {attendance_rate}%
                </span>
                <span className="text-[10px] font-medium text-muted-foreground mt-1">
                  Rasio Hadir
                </span>
              </div>
            </div>
          </div>

          {/* Progress Breakdown Grid */}
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            {attendance_summary.map((item, idx) => {
              const style = getSummaryColor(item.name);
              return (
                <div
                  key={idx}
                  className={cn(
                    "p-4 rounded-xl border flex flex-col gap-5 shadow-xs relative overflow-hidden bg-card/50 dark:bg-[#111113]",
                    style.bg
                  )}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-muted-foreground/80 leading-none">
                      {item.name}
                    </span>
                    <HugeiconsIcon icon={style.icon} className={cn("size-5 shrink-0 opacity-80", style.text)} />
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-3xl text-foreground tracking-tight leading-none">
                      {item.count}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground leading-none">
                      Hari
                    </span>
                  </div>

                  {item.percentage > 0 && (
                    <div className="w-full mt-auto space-y-1.5 pt-2">
                      <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all duration-500", style.bar)}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10.5px] font-medium text-muted-foreground/60">
                        <span>Rasio log</span>
                        <span className={style.text}>{item.percentage}%</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
