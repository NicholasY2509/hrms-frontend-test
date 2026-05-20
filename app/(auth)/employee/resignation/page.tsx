"use client";

import React, { useMemo } from "react";
import { useMyResignationList } from "@/modules/employee/resignation/hooks/use-resignation";
import { PageHeader } from "@/components/layout/page-header";
import { PageError } from "@/components/layout/page-error";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Warning } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

// Extracted Subcomponents
import { ResignationDetailsCard } from "@/modules/employee/resignation/components/resignation-details-card";
import { ResignationTimeline } from "@/modules/employee/resignation/components/resignation-timeline";
import { ResignationInfoCard } from "@/modules/employee/resignation/components/resignation-info-card";
import { ResignationFormCard } from "@/modules/employee/resignation/components/resignation-form-card";
import { ResignationSkeleton } from "@/modules/employee/resignation/components/resignation-skeleton";

export default function ResignationPage() {
    const { items, isLoading, isError, mutate } = useMyResignationList();

    // Find the latest resignation request that is not rejected or cancelled
    const activeRequest = useMemo(() => {
        if (!items || items.length === 0) return null;
        const latest = items[0];
        if (latest.status === "Rejected" || latest.status === "Cancelled") {
            return null; // they can submit a new one
        }
        return latest;
    }, [items]);

    // Gather previous rejected requests for warning alerts
    const rejectedRequests = useMemo(() => {
        if (!items) return [];
        return items.filter((r) => r.status === "Rejected");
    }, [items]);

    if (isLoading) {
        return <ResignationSkeleton />;
    }

    if (isError) {
        return <PageError />;
    }

    // Helper to style status badges
    const getStatusLabelAndColor = (status: string | null) => {
        if (!status) return { label: "Draft", color: "bg-slate-500/10 text-slate-500 border-slate-500/20" };
        const s = status.toLowerCase();
        if (s.includes("settled"))
            return { label: "Selesai (Settled)", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" };
        if (s.includes("approved"))
            return { label: "Disetujui", color: "bg-teal-500/10 text-teal-600 border-teal-500/20" };
        if (s.includes("rejected"))
            return { label: "Ditolak", color: "bg-rose-500/10 text-rose-600 border-rose-500/20" };
        if (s.includes("cancelled"))
            return { label: "Dibatalkan", color: "bg-slate-500/10 text-slate-500 border-slate-500/20" };
        return { label: status, color: "bg-amber-500/10 text-amber-600 border-amber-500/20" };
    };

    if (activeRequest) {
        const { label: statusLabel, color: statusColor } = getStatusLabelAndColor(activeRequest.status);

        return (
            <div className="space-y-6">
                <PageHeader
                    title="Alur Offboarding"
                    description="Pantau tahapan administrasi dan persetujuan pengunduran diri Anda."
                >
                    <Badge className={cn("px-4 py-1.5 text-xs font-bold rounded-full border shadow-sm", statusColor)}>
                        {statusLabel}
                    </Badge>
                </PageHeader>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Details & Approvals */}
                    <div className="col-span-12 lg:col-span-7 space-y-6">
                        <ResignationDetailsCard activeRequest={activeRequest} />
                    </div>

                    {/* Right Column: Timeline Tracker */}
                    <div className="col-span-12 lg:col-span-5 space-y-6">
                        <ResignationTimeline activeRequest={activeRequest} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Pengajuan Resign"
                description="Formulir pengunduran diri resmi karyawan. Harap baca informasi penting sebelum mengisi."
            />

            {rejectedRequests.length > 0 && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-700 rounded-2xl flex gap-3 shadow-sm">
                    <HugeiconsIcon icon={Warning} className="h-5 w-5 shrink-0 mt-0.5" />
                    <div className="text-left space-y-1">
                        <h5 className="text-sm font-bold">Catatan Pengajuan Sebelumnya</h5>
                        <p className="text-xs text-rose-600 leading-relaxed font-medium">
                            Pengajuan pengunduran diri Anda sebelumnya telah ditolak. Harap pastikan Anda telah
                            mendiskusikan kembali rencana transisi ini dengan atasan dan HRD sebelum mengirimkan pengajuan
                            baru.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Side: Information Card */}
                <div className="col-span-12 lg:col-span-5 space-y-6">
                    <ResignationInfoCard />
                </div>

                {/* Right Side: Form Card */}
                <div className="col-span-12 lg:col-span-7">
                    <ResignationFormCard onSuccess={mutate} />
                </div>
            </div>
        </div>
    );
}