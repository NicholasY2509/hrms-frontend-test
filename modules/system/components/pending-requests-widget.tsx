import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  DoorIcon,
  Clock01Icon,
  Document,
  Calendar01Icon,
  Warning
} from "@hugeicons/core-free-icons";
import { format, parseISO } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { EmployeeDashboardData } from "@/modules/system/types/dashboard";

interface PendingRequestsWidgetProps {
  pending_requests: EmployeeDashboardData["pending_requests"];
}

export function PendingRequestsWidget({ pending_requests }: PendingRequestsWidgetProps) {
  return (
    <Card className="border border-border/40 bg-card shadow-xs">
      <CardHeader className="pb-4 border-b border-border/25">
        <CardTitle className="text-sm font-semibold text-muted-foreground/90 flex items-center gap-2.5">
          <HugeiconsIcon icon={Mail01Icon} className="size-5 text-blue-500" />
          Permintaan Menunggu
        </CardTitle>
        <CardDescription className="text-xs font-medium text-muted-foreground/75 mt-1">
          Pengajuan yang sedang diproses oleh atasan & HRD
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 px-4 group-data-[size=sm]/card:px-4">
        {pending_requests.length > 0 ? (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {pending_requests.map((req) => {
              const isLeave = req.type.includes("leave") || req.type.includes("cuti");
              const isOvertime = req.type.includes("overtime") || req.type.includes("lembur");
              
              const iconStyle = isLeave 
                ? "bg-sky-500/10 text-sky-500 border-sky-500/20" 
                : isOvertime 
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20" 
                  : "bg-primary/5 text-primary border-primary/20";
                  
              const containerBorder = isLeave
                ? "border-sky-500/20"
                : isOvertime
                  ? "border-amber-500/20"
                  : "border-border/40";

              return (
                <div
                  key={req.id}
                  className={cn(
                    "p-4 rounded-xl flex flex-col gap-4 shadow-xs bg-card dark:bg-[#111113] border",
                    containerBorder
                  )}
                >
                  {/* Header Row */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className={cn(
                        "size-10 rounded-xl flex items-center justify-center shrink-0 border",
                        iconStyle
                      )}>
                        <HugeiconsIcon
                          icon={isLeave ? DoorIcon : isOvertime ? Clock01Icon : Document}
                          className="size-5 shrink-0"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-semibold text-muted-foreground leading-none">
                          {isLeave ? "Cuti & Izin" : isOvertime ? "Lembur" : "Pengajuan"}
                        </span>
                        <strong className="text-sm font-bold text-foreground tracking-tight leading-tight">
                          {req.title}
                        </strong>
                      </div>
                    </div>
                    <Badge variant="outline" className="font-semibold text-[10.5px] border-dashed text-muted-foreground bg-muted/30 dark:bg-[#1A1A1D] py-0.5 px-2 h-5.5 shrink-0">
                      #{req.id}
                    </Badge>
                  </div>

                  {/* Date details */}
                  <div className="text-xs text-muted-foreground font-semibold flex items-center gap-2 bg-muted/30 dark:bg-[#1A1A1D] p-2.5 rounded-lg border border-border/30">
                    <HugeiconsIcon icon={Calendar01Icon} className="size-4 text-muted-foreground/80 shrink-0" />
                    <span>{req.date_info}</span>
                  </div>

                  {/* Pending Approver Status */}
                  <div className="flex flex-col gap-1.5 p-3 rounded-lg border border-dashed border-amber-500/30 bg-amber-500/5">
                    <div className="flex items-center gap-2 text-amber-500">
                      <HugeiconsIcon icon={Warning} className="size-4 shrink-0" />
                      <span className="text-[10px] font-semibold leading-none mt-0.5">Status Alur</span>
                    </div>
                    <span className="text-sm text-foreground font-medium pl-6">
                      {req.status}
                    </span>
                  </div>

                  {/* Note block */}
                  {req.note && (
                    <div className="text-xs text-muted-foreground italic pl-3 border-l-2 border-border/40 mt-1">
                      &ldquo;{req.note}&rdquo;
                    </div>
                  )}

                  {/* Footer Timestamp */}
                  <div className="text-[10px] text-muted-foreground/70 font-medium text-right mt-1">
                    Diajukan: {format(parseISO(req.created_at.replace(" ", "T")), "dd MMM yyyy HH:mm", { locale: idLocale })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-10 text-center border border-dashed border-border/45 rounded-xl bg-card/25 min-h-[200px]">
            <HugeiconsIcon icon={Document} className="size-8 text-muted-foreground/50 mb-3" />
            <p className="font-bold text-sm text-foreground">Semua Pengajuan Selesai</p>
            <p className="text-xs text-muted-foreground/80 mt-1.5 max-w-[220px] leading-relaxed">
              Tidak ditemukan adanya pengajuan cuti, izin, atau lembur yang berstatus pending.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
