"use client";

import React from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Clock01Icon,
    CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ResignationModel } from "../types";

interface ResignationTimelineProps {
    activeRequest: ResignationModel;
}

export function ResignationTimeline({ activeRequest }: ResignationTimelineProps) {
    // Define stages
    const getStageStatus = (stage: 1 | 2 | 3 | 4) => {
        const status = activeRequest.status?.toLowerCase() || "";
        const hasConfirmed = !!activeRequest.confirmed_at;
        const hasSettled = !!activeRequest.settled_at;

        if (stage === 1) return "completed";
        if (stage === 2) {
            if (hasConfirmed || hasSettled || status.includes("approved") || status.includes("settled"))
                return "completed";
            return "in-progress";
        }
        if (stage === 3) {
            if (hasSettled || status.includes("settled")) return "completed";
            if (hasConfirmed || status.includes("approved")) return "in-progress";
            return "pending";
        }
        if (stage === 4) {
            if (hasSettled || status.includes("settled")) return "completed";
            return "pending";
        }
        return "pending";
    };

    return (
        <Card className="border border-border/40 shadow-sm overflow-hidden rounded-2xl py-0">
            <CardHeader className="bg-muted/30 border-b border-border/40 py-4">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                    <HugeiconsIcon icon={Clock01Icon} className="h-5 w-5 text-primary" />
                    Timeline Proses Offboarding
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="relative border-l-2 border-muted pl-6 space-y-8 py-2">
                    {/* Step 1 */}
                    <div className="relative">
                        <div
                            className={cn(
                                "absolute -left-[35px] top-0 flex h-6.5 w-6.5 items-center justify-center rounded-full border bg-background shadow-sm ring-4 ring-background z-10",
                                "border-emerald-500 text-emerald-500"
                            )}
                        >
                            <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-4 w-4" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-foreground">Pengajuan Resign Dikirim</h4>
                                <Badge variant="success" size="sm" className="text-[9px]">
                                    Selesai
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Permohonan pengunduran diri Anda telah berhasil didaftarkan di sistem.
                            </p>
                            <span className="text-[10px] text-muted-foreground font-semibold block pt-0.5">
                                {format(new Date(activeRequest.created_at), "dd MMM yyyy", { locale: localeId })}
                            </span>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative">
                        <div
                            className={cn(
                                "absolute -left-[35px] top-0 flex h-6.5 w-6.5 items-center justify-center rounded-full border bg-background shadow-sm ring-4 ring-background z-10",
                                getStageStatus(2) === "completed"
                                    ? "border-emerald-500 text-emerald-500"
                                    : getStageStatus(2) === "in-progress"
                                        ? "border-amber-500 text-amber-500 animate-pulse"
                                        : "border-muted text-muted-foreground"
                            )}
                        >
                            {getStageStatus(2) === "completed" ? (
                                <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-4 w-4" />
                            ) : (
                                <div className="h-2 w-2 rounded-full bg-current" />
                            )}
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-foreground">Persetujuan Atasan & Manajemen</h4>
                                {getStageStatus(2) === "completed" && (
                                    <Badge variant="success" size="sm" className="text-[9px]">
                                        Selesai
                                    </Badge>
                                )}
                                {getStageStatus(2) === "in-progress" && (
                                    <Badge variant="warning" size="sm" className="text-[9px] animate-pulse">
                                        Proses
                                    </Badge>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Peninjauan dan validasi rencana pengunduran diri oleh atasan langsung dan tim HRD.
                            </p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative">
                        <div
                            className={cn(
                                "absolute -left-[35px] top-0 flex h-6.5 w-6.5 items-center justify-center rounded-full border bg-background shadow-sm ring-4 ring-background z-10",
                                getStageStatus(3) === "completed"
                                    ? "border-emerald-500 text-emerald-500"
                                    : getStageStatus(3) === "in-progress"
                                        ? "border-amber-500 text-amber-500 animate-pulse"
                                        : "border-muted text-muted-foreground"
                            )}
                        >
                            {getStageStatus(3) === "completed" ? (
                                <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-4 w-4" />
                            ) : (
                                <div className="h-2 w-2 rounded-full bg-current" />
                            )}
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-foreground">Penyelesaian Transisi & Aset</h4>
                                {getStageStatus(3) === "completed" && (
                                    <Badge variant="success" size="sm" className="text-[9px]">
                                        Selesai
                                    </Badge>
                                )}
                                {getStageStatus(3) === "in-progress" && (
                                    <Badge variant="warning" size="sm" className="text-[9px] animate-pulse">
                                        Proses
                                    </Badge>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Masa serah terima pekerjaan (handover) kepada rekan tim, pengembalian inventaris aset,
                                dan exit interview.
                            </p>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="relative">
                        <div
                            className={cn(
                                "absolute -left-[35px] top-0 flex h-6.5 w-6.5 items-center justify-center rounded-full border bg-background shadow-sm ring-4 ring-background z-10",
                                getStageStatus(4) === "completed" ? "border-emerald-500 text-emerald-500" : "border-muted"
                            )}
                        >
                            {getStageStatus(4) === "completed" ? (
                                <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-4 w-4" />
                            ) : (
                                <div className="h-2 w-2 rounded-full bg-current" />
                            )}
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-foreground">Offboarding Selesai & COE</h4>
                                {getStageStatus(4) === "completed" && (
                                    <Badge variant="success" size="sm" className="text-[9px]">
                                        Selesai
                                    </Badge>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Status kepegawaian dinonaktifkan secara resmi di sistem dan penerbitan Surat Keterangan
                                Kerja (COE).
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/40 bg-primary/5 rounded-xl p-3.5 border border-dashed border-primary/25">
                    <p className="text-[11px] text-muted-foreground leading-relaxed text-center font-medium">
                        💡 Jika ada pertanyaan atau kebutuhan pembatalan pengajuan resign, harap hubungi departemen HRD
                        secara langsung.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
