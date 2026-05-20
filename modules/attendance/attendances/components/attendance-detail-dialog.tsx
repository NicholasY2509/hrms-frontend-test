'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { HugeiconsIcon } from '@hugeicons/react';
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
} from '@hugeicons/core-free-icons';
import { AttendanceModel } from '../types';

interface AttendanceDetailDialogProps {
  attendance: AttendanceModel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AttendanceDetailDialog({
  attendance,
  open,
  onOpenChange,
}: AttendanceDetailDialogProps) {
  if (!attendance) return null;

  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '');
  const getImageUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${baseUrl}/${path}`;
  };

  const getStatusVariant = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'hadir') return 'success';
    if (s === 'absen') return 'destructive';
    if (s === 'terlambat') return 'warning';
    if (s === 'off') return 'secondary';
    if (s === 'cuti') return 'info';
    if (s === 'izin') return 'outline';
    return 'secondary';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden gap-0 dark:bg-zinc-950">
        <DialogHeader className="p-6 pb-4 bg-primary/5 dark:bg-primary/10">
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <HugeiconsIcon icon={UserIcon} size={24} />
              </div>
              <div className="flex flex-col">
                <DialogTitle className="text-xl font-bold">
                  {attendance.employee.name}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground font-medium">
                    NIK: {attendance.employee.nik}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <HugeiconsIcon icon={Calendar01Icon} size={14} />
                    {format(new Date(attendance.attendance_at), 'EEEE, dd MMMM yyyy', {
                      locale: id,
                    })}
                  </div>
                </div>
              </div>
            </div>
            <Badge variant={getStatusVariant(attendance.status)} className="px-3 py-1 text-sm">
              {attendance.status}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh]">
          <div className="p-6 space-y-8">
            {/* Overview Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <HugeiconsIcon icon={InformationCircleIcon} size={18} />
                Ringkasan Kehadiran
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 rounded-xl bg-muted/50 border border-border/50 flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Shift
                  </span>
                  <span className="text-sm font-semibold">{attendance.working_hour.name}</span>
                </div>
                <div className="p-3 rounded-xl bg-muted/50 border border-border/50 flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Jam Kerja
                  </span>
                  <span className="text-sm font-semibold">
                    {attendance.working_hour.clock_in} - {attendance.working_hour.clock_out}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-600/70 dark:text-emerald-400/70 tracking-wider">
                    Check In
                  </span>
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={ClockArrowUpFreeIcons} size={14} className="text-emerald-500" />
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                      {attendance.check_in || '--:--'}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20 flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-rose-600/70 dark:text-rose-400/70 tracking-wider">
                    Check Out
                  </span>
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={ClockArrowDown} size={14} className="text-rose-500" />
                    <span className="text-sm font-bold text-rose-700 dark:text-rose-300">
                      {attendance.check_out || '--:--'}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Incoming */}
                  <div className="space-y-3">
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted border border-border flex items-center justify-center relative group">
                      {attendance.incoming_photo ? (
                        <img
                          src={getImageUrl(attendance.incoming_photo)!}
                          alt="Incoming"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <HugeiconsIcon icon={Image01Icon} size={32} />
                          <span className="text-xs">Tidak ada foto masuk</span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-md shadow-sm">
                        MASUK
                      </div>
                    </div>
                    {attendance.incoming_location && (
                      <div className="flex items-start gap-2 p-2 px-3 rounded-lg bg-muted/30 border border-border/50">
                        <HugeiconsIcon icon={Location01Icon} size={16} className="text-primary mt-0.5" />
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold">{attendance.incoming_location.name}</span>
                          <span className="text-[10px] text-muted-foreground">Lokasi Presensi Masuk</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Outgoing */}
                  <div className="space-y-3">
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted border border-border flex items-center justify-center relative group">
                      {attendance.outgoing_photo ? (
                        <img
                          src={getImageUrl(attendance.outgoing_photo)!}
                          alt="Outgoing"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <HugeiconsIcon icon={Image01Icon} size={32} />
                          <span className="text-xs">Tidak ada foto keluar</span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 px-2 py-1 bg-rose-500 text-white text-[10px] font-bold rounded-md shadow-sm">
                        KELUAR
                      </div>
                    </div>
                    {attendance.outgoing_location && (
                      <div className="flex items-start gap-2 p-2 px-3 rounded-lg bg-muted/30 border border-border/50">
                        <HugeiconsIcon icon={Location01Icon} size={16} className="text-primary mt-0.5" />
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold">{attendance.outgoing_location.name}</span>
                          <span className="text-[10px] text-muted-foreground">Lokasi Presensi Keluar</span>
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
              <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider">Waktu</th>
                      <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider">Metode</th>
                      <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider">Mesin / Lokasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.all_scans && attendance.all_scans.length > 0 ? (
                      attendance.all_scans.map((scan, index) => (
                        <tr key={index} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 font-medium">{scan.time}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              {scan.is_mobile ? (
                                <Badge variant="outline" className="gap-1 bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">
                                  <HugeiconsIcon icon={SmartPhone01Icon} size={12} />
                                  Mobile
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="gap-1 bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
                                  <HugeiconsIcon icon={ComputerIcon} size={12} />
                                  Mesin
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="text-xs font-medium">{scan.machine_name || 'Manual'}</span>
                              <span className="text-[10px] text-muted-foreground">{scan.location_name || '-'}</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground italic text-xs">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {attendance.mobile_scans.map((mScan, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant={mScan.type === 'in' ? 'success' : 'destructive'} className="text-[10px] uppercase font-bold">
                          {mScan.type === 'in' ? 'Masuk' : 'Keluar'}
                        </Badge>
                        <span className="text-sm font-bold text-primary">{mScan.time}</span>
                      </div>

                      {mScan.photo && (
                        <div className="aspect-square w-full rounded-lg overflow-hidden bg-muted mb-3 border border-border/50">
                          <img
                            src={getImageUrl(mScan.photo)!}
                            alt={`Mobile Scan ${idx}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <HugeiconsIcon icon={Location01Icon} size={14} className="text-primary/70" />
                          <span className="truncate">{mScan.latitude}, {mScan.longitude}</span>
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
  );
}
