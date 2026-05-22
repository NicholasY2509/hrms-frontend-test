import * as React from "react"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ShiftExchange } from "@/modules/shift-exchange/types"

interface ShiftExchangeCardProps {
  shiftExchange: ShiftExchange
  onClick: (shiftExchange: ShiftExchange) => void
}

export function ShiftExchangeCard({
  shiftExchange,
  onClick,
}: ShiftExchangeCardProps) {
  const employee = shiftExchange.employee
  const targetEmployee = shiftExchange.exchange_with_employee

  const getBadgeVariant = (statusString: string) => {
    const s = statusString.toLowerCase()
    if (s.includes("settled")) return "default" as const
    if (s.includes("approved")) return "success" as const
    if (s.includes("rejected")) return "destructive" as const
    if (s.includes("pending") || s.includes("waiting"))
      return "warning" as const
    return "outline" as const
  }

  const formatTimeOnly = (dateTimeStr: string) => {
    if (!dateTimeStr) return ""
    const match = dateTimeStr.match(/(\d{2}):(\d{2})/)
    return match ? `${match[1]}:${match[2]}` : dateTimeStr
  }

  return (
    <Card className="group flex h-full flex-col gap-0 overflow-hidden rounded-lg border-border/50 bg-card py-0 shadow-none transition-all duration-300 hover:border-border">
      {/* Module Stripe */}
      <div className="h-1 w-full bg-amber-500" />

      <CardContent className="flex flex-1 flex-col p-4">
        {/* Top Meta */}
        <div className="mb-4 flex items-center justify-between">
          <Badge
            variant="outline"
            className="h-5 border-border bg-transparent px-2 text-[9px] font-bold tracking-widest text-amber-600 uppercase"
          >
            Tukar Shift
          </Badge>
          <span className="text-[9px] font-bold tracking-tighter text-muted-foreground/30 uppercase">
            {format(
              new Date(shiftExchange.created_at || new Date()),
              "d MMM yyyy",
              { locale: idLocale }
            )}
          </span>
        </div>

        {/* Target Profile or Self Assignment indicator */}
        <div className="mb-4 flex items-center gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage
              src={
                targetEmployee?.photo_url ||
                targetEmployee?.profileUrl ||
                undefined
              }
            />
            <AvatarFallback className="text-xs text-muted-foreground uppercase">
              {targetEmployee?.name?.[0] || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="mb-1.5 truncate text-[13px] leading-none font-bold text-foreground">
              Tujuan: {targetEmployee ? targetEmployee.name : "Tanpa Target"}
            </h3>
            {targetEmployee && (
              <div className="flex items-center gap-1.5 truncate text-[10px] font-medium text-muted-foreground">
                <span className="truncate">
                  {targetEmployee?.department?.name || "Departemen"}
                </span>
                <span className="text-muted-foreground/30">•</span>
                <span className="truncate">
                  {targetEmployee?.position?.name || "Jabatan"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Request Status Badge */}
        <div className="mb-5 flex">
          <Badge
            variant={getBadgeVariant(shiftExchange.status)}
            className="h-6 border-dashed px-2.5 text-[10px] font-bold tracking-wide uppercase"
          >
            {shiftExchange.status}
          </Badge>
        </div>

        {/* Core Data Bar */}
        <div className="mb-4 grid grid-cols-2 gap-3 border-y border-border/40 py-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold tracking-widest text-muted-foreground/60 uppercase">
              Shift Asal
            </span>
            <div className="mt-1 flex flex-col">
              <span className="text-[11px] leading-none font-bold text-foreground tabular-nums">
                {shiftExchange.original_working_hour.name}
              </span>
              <span className="mt-1 text-[9px] font-medium whitespace-nowrap text-muted-foreground">
                {format(new Date(shiftExchange.date), "d MMM", {
                  locale: idLocale,
                })}{" "}
                • {formatTimeOnly(shiftExchange.original_working_hour.clock_in)}{" "}
                -{" "}
                {formatTimeOnly(shiftExchange.original_working_hour.clock_out)}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold tracking-widest text-muted-foreground/60 uppercase">
              Shift Tujuan
            </span>
            <div className="mt-1 flex flex-col">
              <span className="text-[11px] leading-none font-bold text-amber-600">
                {shiftExchange.requested_working_hour.name}
              </span>
              <span className="mt-1 text-[9px] font-medium whitespace-nowrap text-muted-foreground">
                {format(new Date(shiftExchange.date), "d MMM", {
                  locale: idLocale,
                })}{" "}
                •{" "}
                {formatTimeOnly(shiftExchange.requested_working_hour.clock_in)}{" "}
                -{" "}
                {formatTimeOnly(shiftExchange.requested_working_hour.clock_out)}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="flex-1">
          <p className="line-clamp-2 text-[10.5px] leading-relaxed text-muted-foreground/70 italic">
            "{shiftExchange.reason ?? "-"}"
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-5">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-full text-[10px] font-bold tracking-widest uppercase"
            onClick={() => onClick(shiftExchange)}
          >
            Lihat Rincian
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
