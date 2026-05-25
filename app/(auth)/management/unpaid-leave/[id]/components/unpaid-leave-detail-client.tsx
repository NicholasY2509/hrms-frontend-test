"use client"

import { useParams, useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQueryClient } from "@tanstack/react-query"
import {
  ArrowLeft01Icon,
  Loading03Icon,
  Timer01Icon,
  CancelCircleIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useUnpaidLeaveManagementDetail } from "@/modules/unpaid-leave/hooks/use-unpaid-leave"
import { UNPAID_LEAVE_ENDPOINTS } from "@/modules/unpaid-leave/endpoints"
import { formatDate } from "@/lib/utils"
import { useAuth } from "@/modules/auth/hooks/use-auth"
import { ApprovalHistory } from "@/modules/approval/components/approval-history"
import { UnpaidLeaveNarrativeCard } from "@/modules/unpaid-leave/components/detail/unpaid-leave-narrative-card"

export function UnpaidLeaveDetailClient() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const leaveId = params.id as string

  const { item, isLoading, mutate } = useUnpaidLeaveManagementDetail(leaveId)
  const { user } = useAuth()

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase()
    if (
      s === "approved" ||
      s === "disetujui" ||
      s === "settled" ||
      s === "selesai"
    )
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
      <div className="animate-in space-y-6 pb-20 duration-500 fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-md bg-muted animate-pulse" />
            <div>
              <div className="h-8 w-64 bg-muted animate-pulse rounded-md mb-2" />
              <div className="h-4 w-32 bg-muted animate-pulse rounded-md" />
            </div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            <div className="h-[400px] w-full rounded-xl bg-muted animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="h-[200px] w-full rounded-xl bg-muted animate-pulse" />
            <div className="h-[150px] w-full rounded-xl bg-muted animate-pulse" />
          </div>
        </div>
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
            className="hover:bg-primary/5 hover:text-primary"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="h-6 w-6" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                Detail Pengajuan Izin
              </h1>
              {getStatusBadge(item.status)}
            </div>
            <p className="text-sm text-muted-foreground">
              ID Pengajuan: {item.id}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <UnpaidLeaveNarrativeCard item={item} />
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          <ApprovalHistory
            approvals={item.approvals}
            currentUserId={user?.employee_id}
            userRoles={user?.roles}
            onActionSuccess={() => {
              mutate()
              queryClient.invalidateQueries({
                queryKey: [UNPAID_LEAVE_ENDPOINTS.PORTAL.MANAGEMENT.LIST],
              })
            }}
          />

          <Card className="overflow-hidden border-none bg-primary/[0.02] pt-0 shadow-sm ring-1 ring-muted">
            <CardHeader className="bg-muted/30 py-4">
              <CardTitle className="flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                <HugeiconsIcon icon={Timer01Icon} className="h-3.5 w-3.5" />
                Informasi Tambahan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Diajukan Pada:</span>
                  <span className="font-semibold text-foreground">
                    {formatDate(item.confirmed_at)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    Diselesaikan Pada:
                  </span>
                  <span className="font-semibold text-foreground">
                    {formatDate(item.settled_at)}
                  </span>
                </div>
              </div>
            </CardContent>
            s
          </Card>
        </div>
      </div>
    </div>
  )
}
