"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserIcon,
  Calendar01Icon,
  Clock01Icon,
  ClockArrowUpFreeIcons,
  ClockArrowDown,
  Location01Icon,
  SmartPhone01Icon,
  Image01Icon,
  InformationCircleIcon,
  ComputerIcon,
} from "@hugeicons/core-free-icons"
import { AttendanceModel } from "../types"
import { AttendanceStatusPicker } from "../../shared/components/attendance-status-picker"
import { useUpdateAttendanceStatus } from "../hooks/use-attendance"
import { Button } from "@/components/ui/button"
import { usePermission } from "@/hooks/use-permission"

interface AttendanceDetailDialogProps {
  attendance: AttendanceModel | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AttendanceDetailDialog({
  attendance,
  open,
  onOpenChange,
}: AttendanceDetailDialogProps) {
  if (!attendance) return null
  const [attendanceStatusId, setAttendanceStatusId] = React.useState<
    number | null
  >(attendance.attendance_status_id)
  const { hasPermission } = usePermission();

  const { updateAttendanceStatus, isLoading: isUpdating } =
    useUpdateAttendanceStatus({
      onSuccess: () => {
        onOpenChange(false)
      },
    })

  const baseUrl = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
  ).replace(/\/api$/, "")
  const getImageUrl = (path: string | null) => {
    if (!path) return null
    if (path.startsWith("http")) return path
    return `${baseUrl}/${path}`
  }

  const getStatusVariant = (status: string) => {
    const s = status.toLowerCase()
    if (s === "hadir") return "success"
    if (s === "absen") return "destructive"
    if (s === "terlambat") return "warning"
    if (s === "off") return "secondary"
    if (s === "cuti") return "info"
    if (s === "izin") return "outline"
    return "secondary"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[700px] dark:bg-zinc-950">
        <DialogHeader className="bg-primary/5 p-6 pb-4 dark:bg-primary/10">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <HugeiconsIcon icon={UserIcon} size={24} />
              </div>
              <div className="flex flex-col">
                <DialogTitle className="text-xl font-bold">
                  {attendance.employee.name}
                </DialogTitle>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    NIK: {attendance.employee.nik}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <HugeiconsIcon icon={Calendar01Icon} size={14} />
                    {format(
                      new Date(attendance.attendance_at),
                      "EEEE, dd MMMM yyyy",
                      {
                        locale: id,
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Badge
              variant={getStatusVariant(attendance.status)}
              className="px-3 py-1 text-sm"
            >
              {attendance.status}
            </Badge>
          </div>
        </DialogHeader>

        {hasPermission("attendance.update_status") && (
          <div className="mt-4 flex w-full flex-row items-center gap-3 border-b border-border px-6 pb-4">
            <div className="flex-1">
              <AttendanceStatusPicker
                value={attendanceStatusId}
                onChange={(val) => setAttendanceStatusId(val)}
                disabled={isUpdating}
              />
            </div>
            <Button
              onClick={() =>
                updateAttendanceStatus({
                  attendance_id: attendance.id,
                  attendance_status_id: attendanceStatusId!,
                })
              }
              disabled={isUpdating}
              className="w-auto shrink-0"
            >
              {isUpdating ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        )}

        <ScrollArea className="max-h-[75vh]">
          <div className="space-y-8 p-6">
            {/* Overview Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <HugeiconsIcon icon={InformationCircleIcon} size={18} />
                Ringkasan Kehadiran
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="flex flex-col gap-1 rounded-xl border border-border/50 bg-muted/50 p-3">
                  <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Shift
                  </span>
                  <span className="text-sm font-semibold">
                    {attendance.working_hour.name}
                  </span>
                </div>
                <div className="flex flex-col gap-1 rounded-xl border border-border/50 bg-muted/50 p-3">
                  <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Jam Kerja
                  </span>
                  <span className="text-sm font-semibold">
                    {attendance.working_hour.clock_in} -{" "}
                    {attendance.working_hour.clock_out}
                  </span>
                </div>
                <div className="flex flex-col gap-1 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                  <span className="text-[10px] font-bold tracking-wider text-emerald-600/70 uppercase dark:text-emerald-400/70">
                    Check In
                  </span>
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon
                      icon={ClockArrowUpFreeIcons}
                      size={14}
                      className="text-emerald-500"
                    />
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                      {attendance.check_in || "--:--"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 rounded-xl border border-rose-100 bg-rose-50/50 p-3 dark:border-rose-500/20 dark:bg-rose-500/10">
                  <span className="text-[10px] font-bold tracking-wider text-rose-600/70 uppercase dark:text-rose-400/70">
                    Check Out
                  </span>
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon
                      icon={ClockArrowDown}
                      size={14}
                      className="text-rose-500"
                    />
                    <span className="text-sm font-bold text-rose-700 dark:text-rose-300">
                      {attendance.check_out || "--:--"}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Photos & Locations */}
            {(attendance.incoming_photo || attendance.outgoing_photo) && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <HugeiconsIcon icon={Image01Icon} size={18} />
                  Dokumentasi Foto & Lokasi
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Incoming */}
                  <div className="space-y-3">
                    <div className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
                      {attendance.incoming_photo ? (
                        <img
                          src={getImageUrl(attendance.incoming_photo)!}
                          alt="Incoming"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <HugeiconsIcon icon={Image01Icon} size={32} />
                          <span className="text-xs">Tidak ada foto masuk</span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 rounded-md bg-emerald-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                        MASUK
                      </div>
                    </div>
                    {attendance.incoming_location && (
                      <div className="flex items-start gap-2 rounded-lg border border-border/50 bg-muted/30 p-2 px-3">
                        <HugeiconsIcon
                          icon={Location01Icon}
                          size={16}
                          className="mt-0.5 text-primary"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold">
                            {attendance.incoming_location.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            Lokasi Presensi Masuk
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Outgoing */}
                  <div className="space-y-3">
                    <div className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
                      {attendance.outgoing_photo ? (
                        <img
                          src={getImageUrl(attendance.outgoing_photo)!}
                          alt="Outgoing"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <HugeiconsIcon icon={Image01Icon} size={32} />
                          <span className="text-xs">Tidak ada foto keluar</span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 rounded-md bg-rose-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                        KELUAR
                      </div>
                    </div>
                    {attendance.outgoing_location && (
                      <div className="flex items-start gap-2 rounded-lg border border-border/50 bg-muted/30 p-2 px-3">
                        <HugeiconsIcon
                          icon={Location01Icon}
                          size={16}
                          className="mt-0.5 text-primary"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold">
                            {attendance.outgoing_location.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            Lokasi Presensi Keluar
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Scan Timeline */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <HugeiconsIcon icon={Clock01Icon} size={18} />
                Riwayat Pemindaian (Scan)
              </div>
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Waktu
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Metode
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Mesin / Lokasi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.all_scans && attendance.all_scans.length > 0 ? (
                      attendance.all_scans.map((scan, index) => (
                        <tr
                          key={index}
                          className="border-b border-border/50 transition-colors last:border-0 hover:bg-muted/30"
                        >
                          <td className="px-4 py-3 font-medium">{scan.time}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              {scan.is_mobile ? (
                                <Badge
                                  variant="outline"
                                  className="gap-1 border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400"
                                >
                                  <HugeiconsIcon
                                    icon={SmartPhone01Icon}
                                    size={12}
                                  />
                                  Mobile
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="gap-1 border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400"
                                >
                                  <HugeiconsIcon
                                    icon={ComputerIcon}
                                    size={12}
                                  />
                                  Mesin
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="text-xs font-medium">
                                {scan.machine_name || "Manual"}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {scan.location_name || "-"}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-8 text-center text-xs text-muted-foreground italic"
                        >
                          Tidak ada riwayat scan ditemukan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Mobile Scan Details */}
            {attendance.mobile_scans && attendance.mobile_scans.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <HugeiconsIcon icon={SmartPhone01Icon} size={18} />
                  Detail Pemindaian Mobile
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {attendance.mobile_scans.map((mScan, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <Badge
                          variant={
                            mScan.type === "in" ? "success" : "destructive"
                          }
                          className="text-[10px] font-bold uppercase"
                        >
                          {mScan.type === "in" ? "Masuk" : "Keluar"}
                        </Badge>
                        <span className="text-sm font-bold text-primary">
                          {mScan.time}
                        </span>
                      </div>

                      {mScan.photo && (
                        <div className="mb-3 aspect-square w-full overflow-hidden rounded-lg border border-border/50 bg-muted">
                          <img
                            src={getImageUrl(mScan.photo)!}
                            alt={`Mobile Scan ${idx}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <HugeiconsIcon
                            icon={Location01Icon}
                            size={14}
                            className="text-primary/70"
                          />
                          <span className="truncate">
                            {mScan.latitude}, {mScan.longitude}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
