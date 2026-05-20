import * as React from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Overtime } from "@/modules/overtime/types";

interface OvertimeCardProps {
  overtime: Overtime;
  onClick: (overtime: Overtime) => void;
}

export function OvertimeCard({ overtime, onClick }: OvertimeCardProps) {
  const employee = overtime.employee;

  const getTypeName = (type: string) => {
    switch (type) {
      case "UMUM": return "Reguler";
      case "DAC": return "DAC";
      case "NATIONAL": return "Hari Libur";
      default: return type;
    }
  };

  const formatTimeOnly = (dateTimeStr: string) => {
    if (!dateTimeStr) return "";
    const match = dateTimeStr.match(/(\d{2}):(\d{2})/);
    return match ? `${match[1]}:${match[2]}` : dateTimeStr;
  };

  const getBadgeVariant = (statusString: string) => {
    const s = statusString.toLowerCase();
    if (s.includes("settled")) return "default" as const;
    if (s.includes("approved")) return "success" as const;
    if (s.includes("rejected")) return "destructive" as const;
    if (s.includes("pending") || s.includes("waiting")) return "warning" as const;
    return "outline" as const;
  };

  return (
    <Card className="group border-border/50 py-0 gap-0 hover:border-border transition-all duration-300 rounded-lg shadow-none overflow-hidden bg-card flex flex-col h-full">
      {/* Module Stripe */}
      <div className="h-1 w-full bg-amber-500" />

      <CardContent className="p-4 flex flex-col flex-1">
        {/* Top Meta */}
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="text-[9px] font-bold h-5 px-2 bg-transparent border-border uppercase tracking-widest text-amber-600">
            Lembur {getTypeName(overtime.type)}
          </Badge>
          {overtime.document_no && (
            <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-tighter">
              {overtime.document_no}
            </span>
          )}
        </div>

        {/* Requester Profile */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={employee?.photo_url || employee?.profileUrl || undefined} />
            <AvatarFallback className="text-xs text-muted-foreground uppercase">
              {employee?.name?.[0] || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="text-[13px] font-bold text-foreground truncate leading-none mb-1.5">
              {employee?.name}
            </h3>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium truncate">
              <span className="truncate">{employee?.department?.name || 'Departemen'}</span>
              <span className="text-muted-foreground/30">•</span>
              <span className="truncate">{employee?.position?.name || 'Jabatan'}</span>
            </div>
          </div>
        </div>

        {/* Request Status Badge */}
        <div className="mb-5 flex">
          <Badge
            variant={getBadgeVariant(overtime.status)}
            className="text-[10px] font-bold h-6 px-2.5 uppercase tracking-wide border-dashed"
          >
            {overtime.status}
          </Badge>
        </div>

        {/* Core Data Bar */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-border/40 mb-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">Diajukan</span>
            <span className="text-[11px] font-bold text-foreground tabular-nums">
              {format(new Date(overtime.created_at || new Date()), 'd MMM yyyy', { locale: idLocale })}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">Detail</span>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-amber-600 leading-none">
                {overtime.total_time} Jam
              </span>
              <span className="text-[9px] text-muted-foreground font-medium mt-1 whitespace-nowrap">
                {format(new Date(overtime.date), 'd MMM', { locale: idLocale })} • {formatTimeOnly(overtime.start_time)} - {formatTimeOnly(overtime.finish_time)}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="flex-1">
          <p className="text-[10.5px] text-muted-foreground/70 leading-relaxed italic line-clamp-2">
            "{overtime.note ?? '-'}"
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-5">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-[10px] font-bold uppercase tracking-widest h-8"
            onClick={() => onClick(overtime)}
          >
            Lihat Rincian
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
