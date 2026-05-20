"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon } from "@hugeicons/core-free-icons";

export function ResignationInfoCard() {
    return (
        <Card className="border border-amber-500/25 bg-linear-to-br from-amber-500/10 via-background to-muted/20 shadow-sm rounded-2xl overflow-hidden py-0">
            <CardHeader className="bg-amber-500/5 border-b border-amber-500/10 p-5">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-amber-800 dark:text-amber-500">
                    <HugeiconsIcon icon={AlertCircleIcon} className="h-5 w-5" />
                    Panduan Penting Pengajuan Resign
                </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
                <div className="space-y-2">
                    <h4 className="text-xs font-bold text-foreground/90 uppercase tracking-widest">Sifat Pengajuan</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Pengajuan pengunduran diri adalah keputusan formal yang bersifat mengikat setelah disetujui. Proses
                        offboarding di sistem akan dimulai segera setelah persetujuan atasan dan HRD diperoleh.
                    </p>
                </div>

                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-foreground/90 uppercase tracking-widest">Alur Transisi Karyawan</h4>
                    <div className="space-y-3">
                        <div className="flex gap-2.5">
                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-700 font-bold text-[10px]">
                                1
                            </div>
                            <p className="text-xs text-muted-foreground leading-normal font-medium">
                                <span className="font-bold text-foreground">Pengisian Formulir:</span> Tentukan tanggal efektif
                                minimal 30 hari kedepan dan lampirkan surat resign resmi.
                            </p>
                        </div>
                        <div className="flex gap-2.5">
                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-700 font-bold text-[10px]">
                                2
                            </div>
                            <p className="text-xs text-muted-foreground leading-normal font-medium">
                                <span className="font-bold text-foreground">Persetujuan & Diskusi:</span> Diskusi transisi
                                bersama atasan langsung dan HRD.
                            </p>
                        </div>
                        <div className="flex gap-2.5">
                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-700 font-bold text-[10px]">
                                3
                            </div>
                            <p className="text-xs text-muted-foreground leading-normal font-medium">
                                <span className="font-bold text-foreground">Transfer Pekerjaan (Handover):</span> Rampungkan
                                serah terima pekerjaan dan tugas-tugas aktif kepada tim.
                            </p>
                        </div>
                        <div className="flex gap-2.5">
                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-700 font-bold text-[10px]">
                                4
                            </div>
                            <p className="text-xs text-muted-foreground leading-normal font-medium">
                                <span className="font-bold text-foreground">Clearance Aset & COE:</span> Kembalikan aset
                                kantor, lakukan exit interview, dan peroleh Surat Pengalaman Kerja (COE).
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-3 bg-background/60 border border-border/30 rounded-xl text-center italic text-muted-foreground text-[10px] leading-relaxed">
                    "Sangat disarankan untuk berkomunikasi langsung dengan atasan Anda terlebih dahulu sebelum memformalkan
                    keputusan ini di sistem."
                </div>
            </CardContent>
        </Card>
    );
}
