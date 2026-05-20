
'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserIcon, Tag01Icon } from '@hugeicons/core-free-icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Overtime } from '../../types';

interface OvertimeEmployeeCardProps {
    item: Overtime;
}

export function OvertimeEmployeeCard({ item }: OvertimeEmployeeCardProps) {
    return (
        <Card className="overflow-hidden border-none pt-0 shadow-sm ring-1 ring-muted">
            <CardHeader className="bg-muted/30 py-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <HugeiconsIcon icon={UserIcon} className="h-5 w-5 text-primary" />
                    Informasi Karyawan
                </CardTitle>
            </CardHeader>
            <CardContent className="">
                <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                        <HugeiconsIcon icon={UserIcon} className="h-10 w-10" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-foreground">{item.employee.full_name}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                <span className="font-semibold text-primary/70">NIK:</span> {item.employee.nik || '-'}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                <HugeiconsIcon icon={Tag01Icon} className="h-3.5 w-3.5" />
                                {typeof item.overtime_type === 'string' ? item.overtime_type : item.overtime_type?.name}
                                {(item.overtime_type === 'DAC' || (typeof item.overtime_type !== 'string' && item.overtime_type?.name === 'DAC')) && item.dac_type && ` (${item.dac_type})`}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
