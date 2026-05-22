"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EmployeeAttendanceRecord } from "@/modules/attendance/attendances/types"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar01Icon,
  Clock01Icon,
  ClockArrowUpFreeIcons,
  ClockArrowDown,
  Location01Icon,
  SmartPhone01Icon,
  ComputerIcon,
  Image01Icon,
  InformationCircleIcon,
  MapPinIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface DetailSheetProps {
  record: EmployeeAttendanceRecord | null
  isOpen: boolean
  onClose: () => void
}

export function DetailSheet({ record, isOpen, onClose }: DetailSheetProps) {
  if (!record) return null

  const baseUrl = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api"
  ).replace(/\/api$/, "")

  const getSpColorClass = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes("hadir"))
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
    if (s.includes("libur") || s.includes("off"))
      return "bg-zinc-500/10 text-zinc-600 border-zinc-500/20"
    if (s.includes("terlambat"))
      return "bg-amber-500/10 text-amber-600 border-amber-500/20"
    if (s.includes("cuti") || s.includes("izin"))
      return "bg-sky-500/10 text-sky-600 border-sky-500/20"
    return "bg-rose-500/10 text-rose-600 border-rose-500/20"
  }

  const parsedDate = new Date(record.attendance_at)
  const dayLong = format(parsedDate, "EEEE, dd MMMM yyyy", { locale: idLocale })

  const formatShiftTime = (dateTimeStr: string | null) => {
    if (!dateTimeStr) return ""
    try {
      const timePart = dateTimeStr.split(" ")[1]
      return timePart ? timePart.substring(0, 5) : ""
    } catch {
      return ""
    }
  }

  const shiftStart = formatShiftTime(record.shift_start)
  const shiftEnd = formatShiftTime(record.shift_end)

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="border-l border-border/50 bg-background/95 p-0 backdrop-blur-md sm:max-w-[540px]">
        <div className="h-1 w-full bg-primary" />

        <SheetHeader className="p-6 pb-0">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <SheetTitle className="text-xl font-bold tracking-tight">
                Detail Presensi Harian
              </SheetTitle>
              <div className="flex gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "border-dashed font-bold",
                    getSpColorClass(record.status)
                  )}
                >
                  {record.status}
                </Badge>
                {record.is_locked && (
                  <Badge variant="warning" className="border-dashed font-bold">
                    LOCKED
                  </Badge>
                )}
              </div>
            </div>
            <SheetDescription className="leading-normal font-medium text-muted-foreground/80">
              Informasi presensi masuk, presensi keluar, dokumentasi foto,
              koordinat GPS, serta riwayat scan lengkap.
            </SheetDescription>
          </div>
        </SheetHeader>

        <Separator className="mt-6 border-border/50" />

        <ScrollArea className="h-[calc(100vh-125px)]">
          <div className="space-y-7 p-6 pb-12">
            {/* Calendar & Day Summary banner */}
            <div className="flex items-start gap-4 rounded-xl border border-border/40 bg-muted/20 p-4">
              <div className="mt-0.5 shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
                <HugeiconsIcon icon={Calendar01Icon} className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-1.5 text-[10px] leading-none font-bold tracking-widest text-muted-foreground uppercase">
                  Tanggal Presensi
                </p>
                <p className="text-sm leading-snug font-extrabold wrap-break-word text-foreground">
                  {dayLong}
                </p>
                <p className="mt-1 text-[10px] font-semibold text-muted-foreground">
                  Masa Jam Kerja:{" "}
                  {shiftStart && shiftEnd
                    ? `${shiftStart} s/d ${shiftEnd}`
                    : "Jadwal Libur"}
                </p>
              </div>
            </div>

            {/* Shift & Working hours overview cards */}
            <div className="grid grid-cols-2 gap-3.5">
              {/* Check In Card */}
              <div className="relative flex flex-col gap-2 overflow-hidden rounded-xl border border-border/40 bg-emerald-500/5 p-4">
                <div className="absolute top-3 right-3 text-emerald-500/10">
                  <HugeiconsIcon
                    icon={ClockArrowUpFreeIcons}
                    className="h-10 w-10"
                  />
                </div>
                <span className="text-[9px] leading-none font-bold tracking-widest text-emerald-600 uppercase dark:text-emerald-400">
                  CHECK IN
                </span>
                <span className="mt-1 text-base font-extrabold text-foreground">
                  {record.check_in ? record.check_in.substring(0, 5) : "--:--"}
                </span>
                <span className="mt-0.5 text-[9px] font-semibold text-muted-foreground">
                  Batas Jadwal: {shiftStart || "--:--"}
                </span>
              </div>

              {/* Check Out Card */}
              <div className="relative flex flex-col gap-2 overflow-hidden rounded-xl border border-border/40 bg-rose-500/5 p-4">
                <div className="absolute top-3 right-3 text-rose-500/10">
                  <HugeiconsIcon icon={ClockArrowDown} className="h-10 w-10" />
                </div>
                <span className="text-[9px] leading-none font-bold tracking-widest text-rose-600 uppercase dark:text-rose-400">
                  CHECK OUT
                </span>
                <span className="mt-1 text-base font-extrabold text-foreground">
                  {record.check_out
                    ? record.check_out.substring(0, 5)
                    : "--:--"}
                </span>
                <span className="mt-0.5 text-[9px] font-semibold text-muted-foreground">
                  Batas Jadwal: {shiftEnd || "--:--"}
                </span>
              </div>
            </div>

            {/* Photos & Locations Grid */}
            {(record.incoming_photo || record.outgoing_photo) && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-muted-foreground/75 uppercase">
                  <HugeiconsIcon icon={Image01Icon} className="h-3.5 w-3.5" />
                  <span>Dokumentasi Foto Presensi</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* Incoming Photo */}
                  <div className="space-y-2">
                    <div className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-border/40 bg-muted">
                      {record.incoming_photo ? (
                        <img
                          src={record.incoming_photo}
                          alt="Foto Masuk"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                          <HugeiconsIcon
                            icon={Image01Icon}
                            className="h-6 w-6"
                          />
                          <span className="text-[10px] font-semibold">
                            Tidak ada foto
                          </span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 rounded bg-emerald-500 px-1.5 py-0.5 text-[8px] font-bold text-white shadow-sm">
                        MASUK
                      </div>
                    </div>
                  </div>

                  {/* Outgoing Photo */}
                  <div className="space-y-2">
                    <div className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-border/40 bg-muted">
                      {record.outgoing_photo ? (
                        <img
                          src={record.outgoing_photo}
                          alt="Foto Keluar"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                          <HugeiconsIcon
                            icon={Image01Icon}
                            className="h-6 w-6"
                          />
                          <span className="text-[10px] font-semibold">
                            Tidak ada foto
                          </span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 rounded bg-rose-500 px-1.5 py-0.5 text-[8px] font-bold text-white shadow-sm">
                        KELUAR
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Lock Banner if locked */}
            {record.is_locked && record.lock_title && (
              <div className="flex items-start gap-3 rounded-xl border border-dashed border-yellow-500/20 bg-yellow-500/5 p-4 text-xs leading-relaxed text-yellow-600 dark:text-yellow-500/90">
                <HugeiconsIcon
                  icon={InformationCircleIcon}
                  className="mt-0.5 h-4.5 w-4.5 shrink-0"
                />
                <div className="min-w-0">
                  <p className="mb-1 text-[13px] font-extrabold">
                    {record.lock_title}
                  </p>
                  <p className="font-medium text-muted-foreground/90">
                    {record.lock_message}
                  </p>
                </div>
              </div>
            )}

            {/* Scan History Log Timeline */}
            <div className="space-y-4 pt-1">
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-muted-foreground/75 uppercase">
                <HugeiconsIcon icon={Clock01Icon} className="h-3.5 w-3.5" />
                <span>Riwayat Detil Presensi (Scan Log)</span>
              </div>

              <div className="relative space-y-6 before:absolute before:inset-y-0 before:left-[19px] before:w-px before:bg-border/60">
                {record.all_scans && record.all_scans.length > 0 ? (
                  record.all_scans.map((scan, index) => (
                    <div key={index} className="relative pl-12">
                      {/* Timeline Icon */}
                      <div className="absolute top-0 left-0 z-10 mt-0.5 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm ring-4 ring-background">
                        {scan.is_mobile ? (
                          <HugeiconsIcon
                            icon={SmartPhone01Icon}
                            className="h-4.5 w-4.5 text-sky-500"
                          />
                        ) : (
                          <HugeiconsIcon
                            icon={ComputerIcon}
                            className="h-4.5 w-4.5 text-amber-500"
                          />
                        )}
                      </div>

                      {/* Log Card */}
                      <div className="flex flex-col gap-1.5 rounded-xl border border-border/45 bg-muted/10 p-4">
                        <div className="mb-1.5 flex items-center justify-between border-b border-border/20 pb-2">
                          <span className="text-sm font-extrabold text-foreground">
                            {scan.time.substring(0, 5)} WIB
                          </span>
                          <Badge
                            variant="outline"
                            className={cn(
                              "h-4 shrink-0 border-dashed px-2 py-0 text-[8px] font-bold uppercase",
                              scan.is_mobile
                                ? "border-sky-500/20 bg-sky-500/10 text-sky-600"
                                : "border-amber-500/20 bg-amber-500/10 text-amber-600"
                            )}
                          >
                            {scan.is_mobile ? "Mobile App" : "Mesin Sidik Jari"}
                          </Badge>
                        </div>

                        <div className="flex flex-col gap-1">
                          <p className="text-xs font-bold text-foreground">
                            {scan.machine_name || "Pemindai Presensi"}
                          </p>
                          {scan.location_name && (
                            <p className="text-[10px] font-semibold text-muted-foreground">
                              {scan.location_name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="pl-12 text-xs leading-none text-muted-foreground italic">
                    Belum ada riwayat pemindaian sidik jari/aplikasi.
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Scan Details with Geotag Coordinates & Google Maps Link */}
            {record.mobile_scans && record.mobile_scans.length > 0 && (
              <div className="space-y-4 pt-1">
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-muted-foreground/75 uppercase">
                  <HugeiconsIcon
                    icon={SmartPhone01Icon}
                    className="h-3.5 w-3.5"
                  />
                  <span>Geotagging Presensi (Aplikasi Mobile)</span>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {record.mobile_scans.map((mScan, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 rounded-xl border border-border/45 bg-muted/10 p-4"
                    >
                      {mScan.photo && (
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border/50 bg-muted">
                          <img
                            src={mScan.photo}
                            alt="Mobile Scan thumbnail"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex h-full min-h-[64px] min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <div className="mb-1.5 flex flex-wrap items-center gap-2">
                            <Badge
                              variant={
                                mScan.type === "in" ? "success" : "destructive"
                              }
                              className="h-4 px-1.5 text-[8px] font-extrabold uppercase"
                            >
                              {mScan.type === "in" ? "Masuk" : "Keluar"}
                            </Badge>
                            <span className="text-xs font-extrabold text-foreground">
                              {mScan.time.substring(0, 5)} WIB
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
                            <HugeiconsIcon
                              icon={Location01Icon}
                              className="h-3.5 w-3.5 shrink-0 text-primary"
                            />
                            <span className="truncate">
                              {mScan.latitude}, {mScan.longitude}
                            </span>
                          </div>
                        </div>

                        {mScan.latitude && mScan.longitude && (
                          <a
                            href={`https://www.google.com/maps?q=${mScan.latitude},${mScan.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2.5 inline-flex w-fit items-center gap-1 text-[9px] font-bold tracking-wider text-primary uppercase transition-colors hover:text-primary/80"
                          >
                            <HugeiconsIcon
                              icon={MapPinIcon}
                              className="h-3 w-3 shrink-0"
                            />
                            <span>Buka di Google Maps</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
