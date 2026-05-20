import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Sun, Calendar01Icon } from "@hugeicons/core-free-icons";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface HolidayItem {
  id: string;
  name: string;
  date: string;
  description?: string | null;
  parsedDate: Date;
}

interface HolidaysCalendarWidgetProps {
  formattedHolidays: HolidayItem[];
}

export function HolidaysCalendarWidget({ formattedHolidays }: HolidaysCalendarWidgetProps) {
  return (
    <Card className="border border-border/40 bg-card shadow-xs">
      <CardHeader className="pb-3 border-b border-border/25">
        <CardTitle className="text-sm font-semibold text-muted-foreground/80 flex items-center gap-2">
          <HugeiconsIcon icon={Sun} className="size-4.5 text-primary" />
          Hari Libur & Kalender
        </CardTitle>
        <CardDescription className="text-[10.5px] font-medium text-muted-foreground/75 mt-0.5">
          Jadwal hari libur nasional mendatang
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        {formattedHolidays.length > 0 ? (
          <div className="space-y-3.5">
            {formattedHolidays.map((holiday, idx) => {
              const isSunday = holiday.name.toLowerCase().includes("minggu");
              const dayNum = format(holiday.parsedDate, "d");
              const monthStr = format(holiday.parsedDate, "MMM");
              const dayName = format(holiday.parsedDate, "EEEE", { locale: idLocale });

              return (
                <div
                  key={holiday.id}
                  className={cn(
                    "flex items-center gap-3.5 p-2.5 rounded-xl border border-border/40 hover:border-primary/10 transition-colors bg-linear-to-b from-card to-muted/10 shadow-3xs",
                    idx === 0 && "border-primary/20 ring-1 ring-primary/5 bg-primary/5/10"
                  )}
                >
                  {/* Mini Calendar Block */}
                  <div className="size-11 rounded-lg border border-border/35 overflow-hidden bg-background shrink-0 flex flex-col shadow-2xs">
                    <div className={cn(
                      "text-[9px] font-bold text-center py-0.5 text-white leading-none shrink-0",
                      isSunday ? "bg-rose-500" : "bg-primary"
                    )}>
                      {monthStr}
                    </div>
                    <div className="flex-1 flex items-center justify-center font-bold text-sm text-foreground leading-none">
                      {dayNum}
                    </div>
                  </div>

                  {/* Holiday Detail */}
                  <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <div className="flex justify-between items-baseline gap-1.5">
                      <span className="text-[9px] font-medium text-muted-foreground leading-none">
                        {dayName}
                      </span>
                      {idx === 0 && (
                        <Badge variant="warning" size="sm" className="font-semibold text-[8px] py-0 px-1 border-dashed">
                          Terdekat
                        </Badge>
                      )}
                    </div>
                    <strong className="text-xs font-semibold text-foreground tracking-tight leading-tight truncate">
                      {holiday.name}
                    </strong>
                    {holiday.description && (
                      <span className="text-[10px] text-muted-foreground truncate font-medium">
                        {holiday.description}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-border/45 rounded-xl bg-card/25 min-h-[160px]">
            <HugeiconsIcon icon={Calendar01Icon} className="size-7 text-muted-foreground/60 mb-2.5" />
            <p className="font-bold text-xs text-foreground">Tidak Ada Hari Libur</p>
            <p className="text-[10px] text-muted-foreground/80 mt-1 max-w-[190px] leading-relaxed">
              Tidak terdaftar data hari libur nasional atau khusus dalam waktu dekat.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
