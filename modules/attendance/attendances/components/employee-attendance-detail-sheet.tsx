"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmployeeAttendanceRecord } from "@/modules/attendance/attendances/types";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { HugeiconsIcon } from "@hugeicons/react";
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
  MapPinIcon
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

interface DetailSheetProps {
  record: EmployeeAttendanceRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DetailSheet({ record, isOpen, onClose }: DetailSheetProps) {
  if (!record) return null;

  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api").replace(/\/api$/, "");
  
  const getImageUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${baseUrl}/${path}`;
  };

  const getSpColorClass = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("hadir")) return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    if (s.includes("libur") || s.includes("off")) return "bg-zinc-500/10 text-zinc-600 border-zinc-500/20";
    if (s.includes("terlambat")) return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    if (s.includes("cuti") || s.includes("izin")) return "bg-sky-500/10 text-sky-600 border-sky-500/20";
    return "bg-rose-500/10 text-rose-600 border-rose-500/20";
  };

  const parsedDate = new Date(record.attendance_at);
  const dayLong = format(parsedDate, "EEEE, dd MMMM yyyy", { locale: idLocale });

  const formatShiftTime = (dateTimeStr: string | null) => {
    if (!dateTimeStr) return "";
    try {
      const timePart = dateTimeStr.split(" ")[1];
      return timePart ? timePart.substring(0, 5) : "";
    } catch {
      return "";
    }
  };

  const shiftStart = formatShiftTime(record.shift_start);
  const shiftEnd = formatShiftTime(record.shift_end);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[540px] p-0 border-l border-border/50 bg-background/95 backdrop-blur-md">
        <div className="h-1 w-full bg-primary" />

        <SheetHeader className="p-6 pb-0">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <SheetTitle className="text-xl font-bold tracking-tight">Detail Presensi Harian</SheetTitle>
              <div className="flex gap-2">
                <Badge variant="outline" className={cn("border-dashed font-bold", getSpColorClass(record.status))}>
                  {record.status}
                </Badge>
                {record.is_locked && (
                  <Badge variant="warning" className="border-dashed font-bold">
                    LOCKED
                  </Badge>
                )}
              </div>
            </div>
            <SheetDescription className="text-muted-foreground/80 font-medium leading-normal">
              Informasi presensi masuk, presensi keluar, dokumentasi foto, koordinat GPS, serta riwayat scan lengkap.
            </SheetDescription>
          </div>
        </SheetHeader>

        <Separator className="mt-6 border-border/50" />

        <ScrollArea className="h-[calc(100vh-125px)]">
          <div className="p-6 space-y-7 pb-12">
            
            {/* Calendar & Day Summary banner */}
            <div className="flex items-start gap-4 p-4 rounded-xl border border-border/40 bg-muted/20">
              <div className="mt-0.5 p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                <HugeiconsIcon icon={Calendar01Icon} className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1.5">Tanggal Presensi</p>
                <p className="font-extrabold text-sm text-foreground leading-snug wrap-break-word">{dayLong}</p>
                <p className="text-[10px] font-semibold text-muted-foreground mt-1">
                  Masa Jam Kerja: {shiftStart && shiftEnd ? `${shiftStart} s/d ${shiftEnd}` : "Jadwal Libur"}
                </p>
              </div>
            </div>

            {/* Shift & Working hours overview cards */}
            <div className="grid grid-cols-2 gap-3.5">
              {/* Check In Card */}
              <div className="p-4 rounded-xl border border-border/40 bg-emerald-500/5 flex flex-col gap-2 relative overflow-hidden">
                <div className="absolute right-3 top-3 text-emerald-500/10">
                  <HugeiconsIcon icon={ClockArrowUpFreeIcons} className="h-10 w-10" />
                </div>
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none">CHECK IN</span>
                <span className="font-extrabold text-base text-foreground mt-1">{record.check_in ? record.check_in.substring(0, 5) : "--:--"}</span>
                <span className="text-[9px] font-semibold text-muted-foreground mt-0.5">Batas Jadwal: {shiftStart || "--:--"}</span>
              </div>

              {/* Check Out Card */}
              <div className="p-4 rounded-xl border border-border/40 bg-rose-500/5 flex flex-col gap-2 relative overflow-hidden">
                <div className="absolute right-3 top-3 text-rose-500/10">
                  <HugeiconsIcon icon={ClockArrowDown} className="h-10 w-10" />
                </div>
                <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest leading-none">CHECK OUT</span>
                <span className="font-extrabold text-base text-foreground mt-1">{record.check_out ? record.check_out.substring(0, 5) : "--:--"}</span>
                <span className="text-[9px] font-semibold text-muted-foreground mt-0.5">Batas Jadwal: {shiftEnd || "--:--"}</span>
              </div>
            </div>

            {/* Photos & Locations Grid */}
            {(record.incoming_photo || record.outgoing_photo) && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/75">
                  <HugeiconsIcon icon={Image01Icon} className="h-3.5 w-3.5" />
                  <span>Dokumentasi Foto Presensi</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* Incoming Photo */}
                  <div className="space-y-2">
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted border border-border/40 flex items-center justify-center relative group">
                      {record.incoming_photo ? (
                        <img
                          src={getImageUrl(record.incoming_photo)!}
                          alt="Foto Masuk"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                          <HugeiconsIcon icon={Image01Icon} className="h-6 w-6" />
                          <span className="text-[10px] font-semibold">Tidak ada foto</span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-emerald-500 text-white text-[8px] font-bold rounded shadow-sm">
                        MASUK
                      </div>
                    </div>
                  </div>

                  {/* Outgoing Photo */}
                  <div className="space-y-2">
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted border border-border/40 flex items-center justify-center relative group">
                      {record.outgoing_photo ? (
                        <img
                          src={getImageUrl(record.outgoing_photo)!}
                          alt="Foto Keluar"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                          <HugeiconsIcon icon={Image01Icon} className="h-6 w-6" />
                          <span className="text-[10px] font-semibold">Tidak ada foto</span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-rose-500 text-white text-[8px] font-bold rounded shadow-sm">
                        KELUAR
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Lock Banner if locked */}
            {record.is_locked && record.lock_title && (
              <div className="flex items-start gap-3 p-4 rounded-xl border border-dashed border-yellow-500/20 bg-yellow-500/5 text-yellow-600 dark:text-yellow-500/90 text-xs leading-relaxed">
                <HugeiconsIcon icon={InformationCircleIcon} className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-extrabold text-[13px] mb-1">{record.lock_title}</p>
                  <p className="font-medium text-muted-foreground/90">{record.lock_message}</p>
                </div>
              </div>
            )}

            {/* Scan History Log Timeline */}
            <div className="space-y-4 pt-1">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/75">
                <HugeiconsIcon icon={Clock01Icon} className="h-3.5 w-3.5" />
                <span>Riwayat Detil Presensi (Scan Log)</span>
              </div>

              <div className="relative space-y-6 before:absolute before:inset-y-0 before:left-[19px] before:w-px before:bg-border/60">
                {record.all_scans && record.all_scans.length > 0 ? (
                  record.all_scans.map((scan, index) => (
                    <div key={index} className="relative pl-12">
                      {/* Timeline Icon */}
                      <div className="absolute left-0 top-0 mt-0.5 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-sm ring-4 ring-background z-10 text-muted-foreground">
                        {scan.is_mobile ? (
                          <HugeiconsIcon icon={SmartPhone01Icon} className="h-4.5 w-4.5 text-sky-500" />
                        ) : (
                          <HugeiconsIcon icon={ComputerIcon} className="h-4.5 w-4.5 text-amber-500" />
                        )}
                      </div>

                      {/* Log Card */}
                      <div className="flex flex-col gap-1.5 p-4 rounded-xl border border-border/45 bg-muted/10">
                        <div className="flex items-center justify-between border-b border-border/20 pb-2 mb-1.5">
                          <span className="font-extrabold text-sm text-foreground">{scan.time.substring(0, 5)} WIB</span>
                          <Badge variant="outline" className={cn(
                            "text-[8px] font-bold px-2 py-0 h-4 border-dashed uppercase shrink-0",
                            scan.is_mobile 
                              ? "bg-sky-500/10 text-sky-600 border-sky-500/20" 
                              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          )}>
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
                  <div className="pl-12 text-xs text-muted-foreground italic leading-none">
                    Belum ada riwayat pemindaian sidik jari/aplikasi.
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Scan Details with Geotag Coordinates & Google Maps Link */}
            {record.mobile_scans && record.mobile_scans.length > 0 && (
              <div className="space-y-4 pt-1">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/75">
                  <HugeiconsIcon icon={SmartPhone01Icon} className="h-3.5 w-3.5" />
                  <span>Geotagging Presensi (Aplikasi Mobile)</span>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {record.mobile_scans.map((mScan, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-border/45 bg-muted/10 flex items-start gap-4">
                      {mScan.photo && (
                        <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted border border-border/50 shrink-0">
                          <img
                            src={getImageUrl(mScan.photo)!}
                            alt="Mobile Scan thumbnail"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1 flex flex-col justify-between h-full min-h-[64px]">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <Badge variant={mScan.type === "in" ? "success" : "destructive"} className="text-[8px] font-extrabold uppercase h-4 px-1.5">
                              {mScan.type === "in" ? "Masuk" : "Keluar"}
                            </Badge>
                            <span className="font-extrabold text-xs text-foreground">{mScan.time.substring(0, 5)} WIB</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
                            <HugeiconsIcon icon={Location01Icon} className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="truncate">{mScan.latitude}, {mScan.longitude}</span>
                          </div>
                        </div>

                        {mScan.latitude && mScan.longitude && (
                          <a
                            href={`https://www.google.com/maps?q=${mScan.latitude},${mScan.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[9px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider mt-2.5 w-fit"
                          >
                            <HugeiconsIcon icon={MapPinIcon} className="h-3 w-3 shrink-0" />
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
  );
}
