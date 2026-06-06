"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  Loading03Icon,
  CheckmarkCircle01Icon,
  CancelCircleIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useQueryClient } from "@tanstack/react-query"
import { useOvertimeManagementDetail } from "@/modules/overtime/hooks/use-overtime"
import { OVERTIME_ENDPOINTS } from "@/modules/overtime/endpoints"
import { useAuth } from "@/modules/auth/hooks/use-auth"
import { OvertimeNarrativeCard } from "@/modules/overtime/components/detail/overtime-narrative-card"
import { OvertimeAdditionalInfoCard } from "@/modules/overtime/components/detail/overtime-additional-info-card"
import { ApprovalHistory } from "@/modules/approval/components/approval-history"
import { OvertimeDacCategorizationCard } from "@/modules/overtime/components/detail/overtime-dac-categorization-card"
import dynamic from "next/dynamic"

const OvertimeSettleDialog = dynamic(() => import("@/modules/overtime/components/detail/overtime-settle-dialog").then(mod => mod.OvertimeSettleDialog), { ssr: false })

export function OvertimeDetailClient() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const overtimeId = params.id as string

  const { item, isLoading, mutate } = useOvertimeManagementDetail(overtimeId)
  const { user } = useAuth()

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase()
    if (s === "settled" || s === "diselesaikan")
      return (
        <Badge variant="default" className="px-3 py-1 text-xs">
          {status}
        </Badge>
      )
    if (s === "approved" || s === "disetujui")
      return (
        <Badge variant="success" className="px-3 py-1 text-xs">
          {status}
        </Badge>
      )
    if (s === "rejected" || s === "ditolak")
      return (
        <Badge variant="destructive" className="px-3 py-1 text-xs">
          {status}
        </Badge>
      )
    if (s === "pending" || s === "menunggu")
      return (
        <Badge variant="warning" className="px-3 py-1 text-xs">
          {status}
        </Badge>
      )
    return (
      <Badge variant="secondary" className="px-3 py-1 text-xs">
        {status}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-32">
        <HugeiconsIcon
          icon={Loading03Icon}
          className="h-10 w-10 animate-spin text-primary"
        />
        <p className="animate-pulse font-medium text-muted-foreground">
          Memuat rincian pengajuan...
        </p>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-32">
        <div className="rounded-full bg-muted/30 p-6">
          <HugeiconsIcon
            icon={CancelCircleIcon}
            className="h-16 w-16 text-muted-foreground/40"
          />
        </div>
        <div className="space-y-2 text-center">
          <h3 className="text-xl font-bold">Data Tidak Ditemukan</h3>
          <p className="mx-auto max-w-xs text-muted-foreground">
            Pengajuan yang Anda cari mungkin telah dihapus atau Anda tidak
            memiliki akses.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="gap-2"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" /> Kembali
        </Button>
      </div>
    )
  }

  return (
    <div className="animate-in space-y-6 pb-20 duration-500 fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="transition-colors hover:bg-primary/5 hover:text-primary"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="h-6 w-6" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                Detail Pengajuan Lembur
              </h1>
              {getStatusBadge(item.status)}
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              ID: {item.id} • No. Dokumen:{" "}
              <span className="font-bold text-foreground">
                {item.document_no || "-"}
              </span>
            </p>
          </div>
        </div>
        {(item.status === "Approved" || item.status === "Settled") && (
          <OvertimeSettleDialog
            item={item}
            trigger={
              <Button
                disabled={item.status === "Settled"}
                className="flex flex-row items-center gap-2"
              >
                <HugeiconsIcon
                  icon={CheckmarkCircle01Icon}
                  className="h-4 w-4"
                />{" "}
                {item.status === "Settled" ? "Telah Disettle" : "Settle"}
              </Button>
            }
          />
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <OvertimeNarrativeCard item={item} />
        </div>

        <div className="space-y-6">
          <ApprovalHistory
            approvals={item.approvals}
            currentUserId={user?.employee_id}
            userRoles={user?.roles}
            onActionSuccess={() => {
              mutate()
              queryClient.invalidateQueries({
                queryKey: [OVERTIME_ENDPOINTS.PORTAL.MANAGEMENT.LIST],
              })
            }}
          />
          <OvertimeDacCategorizationCard item={item} />
          <OvertimeAdditionalInfoCard item={item} />
        </div>
      </div>
    </div>
  )
}
