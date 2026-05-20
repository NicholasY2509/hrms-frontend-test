
'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Timer01Icon } from '@hugeicons/core-free-icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Overtime } from '../../types';

interface OvertimeAdditionalInfoCardProps {
    item: Overtime;
}

export function OvertimeAdditionalInfoCard({ item }: OvertimeAdditionalInfoCardProps) {
    const formatDate = (dateStr: string) => {
        try {
            return format(new Date(dateStr), 'dd MMMM yyyy', { locale: id });
        } catch (e) {
            return dateStr;
        }
    };

    const formatDateTime = (dateStr: string) => {
        try {
            return format(new Date(dateStr), 'dd MMM yyyy HH:mm', { locale: id });
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <Card className="overflow-hidden border-none pt-0 shadow-sm ring-1 ring-muted bg-primary/[0.02]">
            <CardHeader className="bg-muted/30 py-4">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <HugeiconsIcon icon={Timer01Icon} className="h-3.5 w-3.5" />
                    Informasi Tambahan
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Diajukan Pada:</span>
                        <span className="font-semibold text-foreground">{item.created_at ? formatDateTime(item.created_at) : '-'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Diselesaikan Pada:</span>
                        <span className="font-semibold text-foreground">{item.settled_at ? formatDate(item.settled_at) : '-'}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
