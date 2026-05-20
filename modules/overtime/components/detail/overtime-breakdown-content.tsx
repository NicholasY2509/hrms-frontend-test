
'use client';

import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HugeiconsIcon } from '@hugeicons/react';
import { Banknote } from '@hugeicons/core-free-icons';
import { Overtime } from '../../types';
import { formatCurrency } from '@/lib/utils';

interface OvertimeBreakdownContentProps {
    item: Overtime;
    showTotal?: boolean;
}

export function OvertimeBreakdownContent({ item, showTotal = true }: OvertimeBreakdownContentProps) {
    const getBreakdown = () => {
        if (!item.total_time) return [];

        let totalHoursRaw = 0;
        if (item.total_time.includes(':')) {
            const timeParts = item.total_time.split(':');
            const hours = parseInt(timeParts[0]) || 0;
            const minutes = timeParts.length > 1 ? parseInt(timeParts[1]) : 0;
            totalHoursRaw = hours + (minutes / 60);
        } else {
            totalHoursRaw = parseFloat(item.total_time) || 0;
        }

        if (isNaN(totalHoursRaw) || totalHoursRaw <= 0) return [];

        const steps = [];
        let totalMultiplier = 0;
        const type = (item.overtime_type as string || '').toUpperCase();

        if (type === 'UMUM' || type === 'REGULER') {
            const cappedHours = Math.min(Math.ceil(totalHoursRaw), 4);
            for (let i = 1; i <= cappedHours; i++) {
                let m = 0;
                if (i <= 2) m = 1.0;
                else m = 1.5;

                steps.push({ hour: i, multiplier: m });
                totalMultiplier += m;
            }
        } else if (type === 'NATIONAL' || type === 'HOLIDAY') {
            const cappedHours = Math.min(Math.ceil(totalHoursRaw), 8);
            for (let i = 1; i <= cappedHours; i++) {
                let m = 0;
                if (i <= 2) m = 1.0;
                else if (i <= 4) m = 1.5;
                else m = 2.0;

                steps.push({ hour: i, multiplier: m });
                totalMultiplier += m;
            }
        }

        const hourlyWage = item.estimated_overtime_price ? item.estimated_overtime_price / totalMultiplier : 0;

        return steps.map(step => ({
            ...step,
            hourlyWage,
            total: step.multiplier * hourlyWage
        }));
    };

    const breakdown = getBreakdown();
    if (breakdown.length === 0) return null;

    return (
        <div className="overflow-hidden rounded-xl border border-muted/50 bg-background">
            <Table>
                <TableHeader className="bg-muted/10">
                    <TableRow className="hover:bg-transparent border-muted/50">
                        <TableHead className="text-[10px] uppercase font-bold text-muted-foreground h-10 pl-6">Jam Ke</TableHead>
                        <TableHead className="text-[10px] uppercase font-bold text-muted-foreground h-10 text-center">Multiplier</TableHead>
                        <TableHead className="text-[10px] uppercase font-bold text-muted-foreground h-10 text-right">Upah / Jam</TableHead>
                        <TableHead className="text-[10px] uppercase font-bold text-muted-foreground h-10 text-right pr-6">Subtotal</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {breakdown.map((row, idx) => (
                        <TableRow key={idx} className="hover:bg-muted/5 border-muted/50 last:border-none">
                            <TableCell className="text-[11px] font-medium py-3 pl-6">Jam ke-{row.hour}</TableCell>
                            <TableCell className="text-[11px] text-center font-bold text-primary py-3">{row.multiplier.toFixed(1)}x</TableCell>
                            <TableCell className="text-[11px] text-right text-muted-foreground py-3">{formatCurrency(row.hourlyWage)}</TableCell>
                            <TableCell className="text-[11px] text-right font-bold py-3 pr-6">{formatCurrency(row.total)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {showTotal && (
                <div className="p-4 bg-primary/3 border-t border-muted/50 flex justify-between items-center px-6">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Estimasi</span>
                    <div className="text-right">
                        <span className="text-sm font-black text-primary">{formatCurrency(item.estimated_overtime_price || 0)}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
