"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { ApprovalRequest } from "@/modules/approval-workflow/actions/types"
import { getModuleConfig } from "./approval-inbox-constants"
import { ApprovalCategory } from "@/modules/approval-workflow/actions/hooks/use-approvals"
import { useRouter } from "next/navigation"
import { usePermission } from "@/hooks/use-permission"

interface ApprovalCardProps {
  task: ApprovalRequest
  activeTab: ApprovalCategory
  isActioning: boolean
  onApprove: (id: number) => void
  onReject: (id: number) => void
}

export function ApprovalCard({
  task,
  activeTab,
  isActioning,
  onApprove,
  onReject,
}: ApprovalCardProps) {
  const router = useRouter()
  const { hasRole } = usePermission()
  const config = getModuleConfig(task.approvable_type)
  const employee = task.approvable?.employee

  const isOvertime = task.approvable_type.includes("Overtime")
  const isLeave = task.approvable_type.includes("UnpaidLeave")

  const isIT = hasRole("IT")
  const canAction =
    (task.approvable_request_step_id !== null &&
      task.user_step_status === "pending") ||
    (isIT && task.status === "pending")

  const goToDetail = () => {
    const path = `${config.detailPath}/${task.approvable_id}`
    router.push(path)
  }

  const getBadgeVariant = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes("settled")) return "default" as const
    if (s.includes("approved")) return "success" as const
    if (s.includes("rejected")) return "destructive" as const
    if (s.includes("pending") || s.includes("waiting"))
      return "warning" as const
    return "outline" as const
  }

  return (
    <Card className="group flex h-full flex-col gap-0 overflow-hidden rounded-lg border-border/50 bg-card py-0 shadow-none transition-all duration-300 hover:border-border">
      {/* Module Stripe */}
      <div className={cn("h-1 w-full", config.accent)} />

      <CardContent className="flex flex-1 flex-col p-4">
        {/* Top Meta */}
        <div className="mb-4 flex items-center justify-between">
          <Badge
            variant="outline"
            className={cn(
              "h-5 border-border bg-transparent px-2 text-[9px] font-bold tracking-widest uppercase",
              config.color
            )}
          >
            {task.category || config.label}
          </Badge>
          {canAction && (
            <Button variant="link" size="sm" onClick={goToDetail}>
              Lihat Rincian
            </Button>
          )}
        </div>

        {/* Requester Profile */}
        <div className="mb-4 flex items-center gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={employee?.avatar_url} />
            <AvatarFallback className="text-xs text-muted-foreground uppercase">
              {employee?.full_name?.[0] || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="mb-1.5 truncate text-[13px] leading-none font-bold text-foreground">
              {employee?.full_name}
            </h3>
            <div className="flex items-center gap-1.5 truncate text-[10px] font-medium text-muted-foreground">
              <span className="truncate">
                {employee?.department?.name || "Departemen"}
              </span>
              <span className="text-muted-foreground/30">•</span>
              <span className="truncate">
                {employee?.position?.name || "Jabatan"}
              </span>
            </div>
          </div>
        </div>

        {/* Request Status Badge */}
        <div className="mb-5 flex">
          <Badge
            variant={getBadgeVariant(task.status)}
            className="h-6 border-dashed px-2.5 text-[10px] font-bold tracking-wide uppercase"
          >
            {task.status}
          </Badge>
        </div>

        {/* Core Data Bar */}
        <div className="mb-4 grid grid-cols-2 gap-3 border-y border-border/40 py-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold tracking-widest text-muted-foreground/60 uppercase">
              Diajukan
            </span>
            <span className="text-[11px] font-bold text-foreground tabular-nums">
              {format(new Date(task.created_at), "d MMM yyyy", { locale: id })}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold tracking-widest text-muted-foreground/60 uppercase">
              Detail
            </span>
            <div className="flex items-center gap-1">
              {isOvertime && task.approvable?.total_time && (
                <span className="text-[11px] font-bold text-amber-600">
                  {task.approvable.total_time} Jam
                </span>
              )}
              {isLeave && (
                <div className="flex flex-col">
                  <span className="text-[11px] leading-none font-bold text-blue-600">
                    {task.approvable?.total_days} Hari
                  </span>
                  {task.approvable?.start_date && task.approvable?.end_date && (
                    <span className="mt-1 text-[9px] font-medium text-muted-foreground">
                      {format(new Date(task.approvable.start_date), "d MMM", {
                        locale: id,
                      })}{" "}
                      -{" "}
                      {format(new Date(task.approvable.end_date), "d MMM", {
                        locale: id,
                      })}
                    </span>
                  )}
                </div>
              )}
              {!isOvertime && !isLeave && (
                <span className="text-[11px] font-bold text-slate-600">—</span>
              )}
            </div>
          </div>
        </div>

        {/* Notes (Conditional) */}
        <div className="flex-1">
          <p className="line-clamp-2 text-[10.5px] leading-relaxed text-muted-foreground/70 italic">
            "{task.approvable?.note ?? "-"}"
          </p>
        </div>

        {/* User Step Status Badge for non-pending tabs */}
        {activeTab !== "pending" &&
          task.user_step_status &&
          task.user_step_status !== "pending" && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[9px] font-bold tracking-widest text-muted-foreground/50 uppercase">
                Approval Anda:
              </span>
              <Badge
                variant={
                  task.user_step_status === "approved"
                    ? "success"
                    : "destructive"
                }
                className="h-4 px-1.5 text-[9px] font-bold uppercase"
              >
                {task.user_step_status}
              </Badge>
            </div>
          )}

        {/* Actions */}
        {canAction ? (
          <div className="mt-5 flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              disabled={isActioning}
              onClick={() =>
                task.approvable_request_step_id &&
                onReject(task.approvable_request_step_id)
              }
              className="flex-1"
            >
              Tolak
            </Button>
            <Button
              variant="success"
              size="sm"
              disabled={isActioning}
              onClick={() =>
                task.approvable_request_step_id &&
                onApprove(task.approvable_request_step_id)
              }
              className="flex-1"
            >
              Setujui
            </Button>
          </div>
        ) : (
          <div className="mt-5">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-full text-[10px] font-bold tracking-widest uppercase"
              onClick={goToDetail}
            >
              Lihat Rincian
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
