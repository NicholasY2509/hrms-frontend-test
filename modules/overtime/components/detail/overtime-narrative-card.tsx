
'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Message01Icon,
    Banknote,
    Cash01Icon,
    FileAttachmentIcon,
    Clock01Icon
} from '@hugeicons/core-free-icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Overtime } from '../../types';
import { OvertimeBreakdownDialog } from './overtime-breakdown-dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDateTime, formatCurrency } from '@/lib/utils';

interface OvertimeNarrativeCardProps {
    item: Overtime;
}

export function OvertimeNarrativeCard({ item }: OvertimeNarrativeCardProps) {
    const [tooltipOpen, setTooltipOpen] = React.useState(false);
    const [dialogOpen, setDialogOpen] = React.useState(false);

    return (
        <Card className="overflow-hidden border-none pt-0 shadow-sm ring-1 ring-muted">
            <CardHeader className="bg-muted/30 py-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <HugeiconsIcon icon={Message01Icon} className="h-5 w-5 text-primary" />
                    Rincian & Catatan
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Formal Header */}
                <div className="space-y-1">
                    <p className="font-bold text-sm">Kepada Yth.</p>
                    <p className="text-sm">Kepala Department, Supervisor & HRD</p>
                    <p className="text-sm italic text-muted-foreground">ditempat.</p>
                </div>

                {/* Introduction */}
                <div className="space-y-4">
                    <p className="text-sm">Saya yang bertanda tangan dibawah ini :</p>
                    <div className="grid grid-cols-[180px_10px_1fr] gap-y-2 text-sm">
                        <span className="font-medium text-muted-foreground">Nama Lengkap</span>
                        <span className="text-muted-foreground">:</span>
                        <span className="font-bold uppercase">{item.employee.full_name}</span>

                        <span className="font-medium text-muted-foreground">NIK</span>
                        <span className="text-muted-foreground">:</span>
                        <span className="font-bold">{item.employee.nik || '-'}</span>
                    </div>
                </div>

                {/* Main Narrative */}
                <p className="text-sm leading-relaxed text-foreground/90">
                    Saya mengajukan lembur pada tanggal <span className="font-bold">{formatDateTime(item.start_time)}</span> s/d <span className="font-bold">{formatDateTime(item.finish_time)}</span> selama <span className="font-bold">{item.total_time} jam</span> dengan keterangan <span className="font-bold text-primary">{item.note || '-'}.</span> Terima kasih atas perhatiannya.
                </p>

                {/* Financial Information */}
                <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3 text-sm">
                        <div className="p-2 bg-primary/5 rounded-lg">
                            <HugeiconsIcon icon={Banknote} className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-muted-foreground">Estimasi Biaya Lembur:</span>
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-primary">
                                {item.estimated_overtime_price ? formatCurrency(item.estimated_overtime_price) : '-'}
                            </span>
                            <Tooltip open={tooltipOpen && !dialogOpen} onOpenChange={setTooltipOpen}>
                                <TooltipTrigger asChild>
                                    <OvertimeBreakdownDialog
                                        item={item}
                                        open={dialogOpen}
                                        onOpenChange={setDialogOpen}
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Rincian Perhitungan Estimasi</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="p-2 bg-green-600/5 rounded-lg">
                            <HugeiconsIcon icon={Cash01Icon} className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-muted-foreground">Realisasi Biaya Lembur:</span>
                        <span className="font-bold text-green-600">
                            {item.real_overtime_price ? formatCurrency(item.real_overtime_price) : '-'}
                        </span>
                    </div>
                </div>

                {/* Signature Line */}
                <div className="pt-6">
                    <p className="text-sm">Hormat saya,</p>
                    <p className="font-bold text-sm uppercase underline underline-offset-4">{item.employee.full_name}</p>
                </div>

                {item.attachment_urls && item.attachment_urls.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-dashed">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Lampiran Dokumen pendukung</p>
                        <div className="grid gap-3">
                            {item.attachment_urls.map((url, idx) => (
                                <a
                                    key={idx}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-4 bg-primary/5 border border-primary/10 rounded-2xl hover:bg-primary/10 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-white rounded-xl shadow-sm group-hover:scale-105 transition-transform">
                                            <HugeiconsIcon icon={FileAttachmentIcon} className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-bold">Lampiran {idx + 1}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Klik untuk melihat file</p>
                                        </div>
                                    </div>
                                    <HugeiconsIcon icon={Clock01Icon} className="h-5 w-5 text-primary opacity-50" />
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
