"use client";

import React from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Calendar01Icon,
    Briefcase01Icon,
    DocumentAttachmentIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { ResignationModel } from "../types";

interface ResignationDetailsCardProps {
    activeRequest: ResignationModel;
}

export function ResignationDetailsCard({ activeRequest }: ResignationDetailsCardProps) {
    return (
        <Card className="border border-border/40 shadow-sm overflow-hidden rounded-2xl py-0">
            <CardHeader className="bg-muted/30 border-b border-border/40 py-4">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                    <HugeiconsIcon icon={Briefcase01Icon} className="h-5 w-5 text-primary" />
                    Detail Pengajuan Resign
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                            Tanggal Pengajuan
                        </span>
                        <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
                            <HugeiconsIcon icon={Calendar01Icon} className="h-4 w-4 text-muted-foreground" />
                            {format(new Date(activeRequest.created_at), "dd MMMM yyyy", { locale: localeId })}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                            Tanggal Efektif Resign
                        </span>
                        <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
                            <HugeiconsIcon icon={Calendar01Icon} className="h-4 w-4 text-primary" />
                            {format(new Date(activeRequest.effective_date), "dd MMMM yyyy", { locale: localeId })}
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                        Alasan Pengunduran Diri
                    </span>
                    <div className="bg-muted/40 rounded-xl p-4 border-l-4 border-amber-500/60 shadow-inner">
                        <p className="text-sm text-foreground/80 italic leading-relaxed whitespace-pre-wrap">
                            "{activeRequest.reason}"
                        </p>
                    </div>
                </div>

                {activeRequest.attachment_url && (
                    <div className="space-y-2 pt-2">
                        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                            Dokumen Pendukung
                        </span>
                        <a
                            href={activeRequest.attachment_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3.5 bg-background border border-border/50 rounded-xl hover:border-primary/40 hover:bg-primary/5 transition-all group shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg group-hover:bg-rose-500/25 transition-colors">
                                    <HugeiconsIcon icon={DocumentAttachmentIcon} className="h-5 w-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-foreground/90 group-hover:text-primary transition-colors">
                                        Surat_Resignasi.pdf
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">Klik untuk membuka file dokumen</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 font-bold text-xs" asChild>
                                <span>Lihat</span>
                            </Button>
                        </a>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
