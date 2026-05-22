"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  Loading03Icon,
  CancelCircleIcon,
  Calendar01Icon,
  Clock01Icon,
  UserGroupIcon,
  File01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useQueryClient } from "@tanstack/react-query"
import { useManagementShiftExchangeDetail } from "@/modules/shift-exchange/hooks/use-shift-exchange"
import { SHIFT_EXCHANGE_ENDPOINTS } from "@/modules/shift-exchange/endpoints"
import { useAuth } from "@/modules/auth/hooks/use-auth"
import { ApprovalHistory } from "@/modules/approval/components/approval-history"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ShiftExchangeDetailClient() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const shiftExchangeId = Number(params.id)

  const { item, isLoading, mutate } =
    useManagementShiftExchangeDetail(shiftExchangeId)
  const { user } = useAuth()

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || ""
    if (s.includes("settle"))
      return (
        <Badge variant="default" className="px-3 py-1 text-xs">
          {status}
        </Badge>
      )
    if (s.includes("approve") || s.includes("success"))
      return (
        <Badge variant="success" className="px-3 py-1 text-xs">
          {status}
        </Badge>
      )
    if (s.includes("reject") || s.includes("cancel"))
      return (
        <Badge variant="destructive" className="px-3 py-1 text-xs">
          {status}
        </Badge>
      )
    if (s.includes("pending"))
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
                Detail Tukar Shift
              </h1>
              {getStatusBadge(item.status)}
            </div>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              ID: {item.id} • Tanggal Pengajuan:{" "}
              <span className="font-bold text-foreground">
                {format(new Date(item.created_at), "dd MMM yyyy", {
                  locale: id,
                })}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="border-b bg-muted/20 px-6 py-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <HugeiconsIcon
                  icon={File01Icon}
                  size={18}
                  className="text-primary"
                />
                Informasi Pertukaran
              </h3>
            </div>
            <div className="space-y-8 p-6">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <HugeiconsIcon icon={UserGroupIcon} size={14} /> Pemohon
                  </p>
                  {item.employee ? (
                    <div className="flex items-center gap-3">
                      <Avatar size="lg">
                        <AvatarImage
                          src={
                            item.employee.photo_url ||
                            item.employee.profileUrl ||
                            undefined
                          }
                        />
                        <AvatarFallback>
                          {item.employee.name?.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                          {item.employee.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.employee.nik}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </div>
                {item.exchange_with_employee && (
                  <div>
                    <p className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <HugeiconsIcon icon={UserGroupIcon} size={14} /> Target
                      Tukar
                    </p>
                    <div className="flex items-center gap-3">
                      <Avatar size="lg">
                        <AvatarImage
                          src={
                            item.exchange_with_employee.photo_url ||
                            item.exchange_with_employee.profileUrl ||
                            undefined
                          }
                        />
                        <AvatarFallback>
                          {item.exchange_with_employee.name?.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                          {item.exchange_with_employee.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.exchange_with_employee.nik}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-lg border bg-muted/10 p-5">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="mb-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <HugeiconsIcon icon={Calendar01Icon} size={14} /> Tanggal
                      Pertukaran
                    </p>
                    <p className="text-lg font-semibold">
                      {format(new Date(item.date), "EEEE, dd MMMM yyyy", {
                        locale: id,
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <HugeiconsIcon icon={Clock01Icon} size={14} /> Jam Kerja
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col rounded-md border bg-background px-3 py-1.5 shadow-sm">
                        <span className="font-medium">
                          {item.original_working_hour?.name || "-"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.original_working_hour?.clock_in || "-"} -{" "}
                          {item.original_working_hour?.clock_out || "-"}
                        </span>
                      </div>
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        size={16}
                        className="text-muted-foreground"
                      />
                      <div className="flex flex-col rounded-md border border-primary bg-primary/5 px-3 py-1.5 shadow-sm">
                        <span className="font-medium text-primary">
                          {item.requested_working_hour?.name || "-"}
                        </span>
                        <span className="text-xs text-primary/80">
                          {item.requested_working_hour?.clock_in || "-"} -{" "}
                          {item.requested_working_hour?.clock_out || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm text-muted-foreground">Alasan</p>
                <div className="rounded-lg border bg-background p-4 text-sm leading-relaxed">
                  {item.reason || (
                    <span className="text-muted-foreground italic">
                      Tidak ada alasan
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <ApprovalHistory
            approvals={item.approvals || []}
            currentUserId={user?.employee_id}
            userRoles={user?.roles}
            onActionSuccess={() => {
              mutate()
              queryClient.invalidateQueries({
                queryKey: [SHIFT_EXCHANGE_ENDPOINTS.PORTAL.MANAGEMENT.LIST],
              })
            }}
          />
        </div>
      </div>
    </div>
  )
}
