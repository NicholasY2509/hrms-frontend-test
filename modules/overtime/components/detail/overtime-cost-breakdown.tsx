
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HugeiconsIcon } from '@hugeicons/react';
import { Banknote } from '@hugeicons/core-free-icons';
import { Overtime } from '../../types';

interface OvertimeCostBreakdownProps {
    item: Overtime;
}

import { OvertimeBreakdownContent } from './overtime-breakdown-content';

interface OvertimeCostBreakdownProps {
    item: Overtime;
}

export function OvertimeCostBreakdown({ item }: OvertimeCostBreakdownProps) {
    const type = (item.type || (typeof item.overtime_type === 'string' ? item.overtime_type : item.overtime_type?.name) || '').toUpperCase();
    if (type === 'DAC') return null;

    return (
        <Card className="border-none shadow-sm ring-1 ring-muted overflow-hidden">
            <CardHeader className="bg-muted/30 py-3">
                <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <HugeiconsIcon icon={Banknote} className="h-4 w-4 text-primary" />
                    Perhitungan Estimasi
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <OvertimeBreakdownContent item={item} />
            </CardContent>
        </Card>
    );
}
