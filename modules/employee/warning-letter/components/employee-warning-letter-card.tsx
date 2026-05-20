import * as React from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WarningLetterModel } from "@/modules/employee/warning-letter/types";

interface WarningLetterCardProps {
  warning: WarningLetterModel;
  onClick: (warning: WarningLetterModel) => void;
}

export function WarningLetterCard({ warning, onClick }: WarningLetterCardProps) {
  const employee = warning.employee;
  const typeName = warning.warning_letter_type?.name || "Surat Peringatan";
  
  // Determine color and border classes based on SP level
  const getSpStyle = (name: string) => {
    const s = name.toLowerCase();
    if (s.includes("2")) {
      return {
        badge: "bg-orange-500/10 text-orange-600 border-orange-500/20",
        stripe: "bg-orange-500",
      };
    }
    if (s.includes("3") || s.includes("terakhir") || s.includes("third") || s.includes("last")) {
      return {
        badge: "bg-red-500/10 text-red-600 border-red-500/20",
        stripe: "bg-red-500",
      };
    }
    return {
      badge: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      stripe: "bg-yellow-500",
    };
  };

  const spStyle = getSpStyle(typeName);

  const getStatusVariant = (statusString: string | null) => {
    if (!statusString) return "outline" as const;
    const s = statusString.toLowerCase();
    if (s.includes("settled") || s.includes("selesai")) return "default" as const;
    if (s.includes("approved") || s.includes("disetujui")) return "success" as const;
    if (s.includes("rejected") || s.includes("ditolak")) return "destructive" as const;
    if (s.includes("pending") || s.includes("waiting") || s.includes("menunggu")) return "warning" as const;
    return "outline" as const;
  };

  return (
    <Card className="group border-border/50 py-0 gap-0 hover:border-border transition-all duration-300 rounded-lg shadow-none overflow-hidden bg-card flex flex-col h-full">
      {/* Dynamic Module Stripe */}
      <div className={cn("h-1 w-full", spStyle.stripe)} />

      <CardContent className="p-4 flex flex-col flex-1">
        {/* Top Meta */}
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className={cn("text-[9px] font-bold h-5 px-2 bg-transparent uppercase tracking-widest", spStyle.badge)}>
            {typeName}
          </Badge>
          {warning.document_no && (
            <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-tighter">
              #{warning.document_no}
            </span>
          )}
        </div>

        {/* Requester Profile (Self) */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="text-xs text-muted-foreground uppercase">
              {employee?.name?.[0] || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="text-[13px] font-bold text-foreground truncate leading-none mb-1.5">
              {employee?.name}
            </h3>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium truncate">
              <span>NIK: {employee?.nik}</span>
            </div>
          </div>
        </div>

        {/* Request Status Badge */}
        <div className="mb-5 flex">
          <Badge
            variant={getStatusVariant(warning.status)}
            className="text-[10px] font-bold h-6 px-2.5 uppercase tracking-wide border-dashed"
          >
            {warning.status || "DRAFT"}
          </Badge>
        </div>

        {/* Core Data Bar */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-border/40 mb-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">Tgl Terbit</span>
            <span className="text-[11px] font-bold text-foreground tabular-nums">
              {warning.warning_at ? format(new Date(warning.warning_at), 'd MMM yyyy', { locale: idLocale }) : '-'}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">Masa Berlaku</span>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-blue-600 leading-none">
                {warning.start_date ? format(new Date(warning.start_date), 'd MMM', { locale: idLocale }) : ''} - {warning.end_date ? format(new Date(warning.end_date), 'd MMM yyyy', { locale: idLocale }) : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Reason / Notes */}
        <div className="flex-1">
          <p className="text-[10.5px] text-muted-foreground/70 leading-relaxed italic line-clamp-2">
            "{warning.note ?? 'Tidak ada catatan alasan.'}"
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-5">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-[10px] font-bold uppercase tracking-widest h-8"
            onClick={() => onClick(warning)}
          >
            Lihat Rincian
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
