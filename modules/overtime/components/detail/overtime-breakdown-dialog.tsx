
'use client';

import * as React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { InformationCircleIcon, Banknote } from '@hugeicons/core-free-icons';
import { Overtime } from '../../types';
import { OvertimeBreakdownContent } from './overtime-breakdown-content';

interface OvertimeBreakdownDialogProps {
    item: Overtime;
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export const OvertimeBreakdownDialog = React.forwardRef<
    HTMLButtonElement,
    OvertimeBreakdownDialogProps
>(({ item, trigger, open, onOpenChange, ...props }, ref) => {
    const type = (item.overtime_type as string || '').toUpperCase();
    if (type === 'DAC') return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild {...props}>
                {trigger || (
                    <Button
                        ref={ref}
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-primary"
                    >
                        <HugeiconsIcon icon={InformationCircleIcon} className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="p-6 bg-muted/30 pb-4">
                    <DialogTitle className="flex items-center gap-3 text-lg font-bold tracking-tight">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <HugeiconsIcon icon={Banknote} className="h-5 w-5 text-primary" />
                        </div>
                        Rincian Perhitungan Estimasi
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6 pt-2">
                    <div className="mb-4 p-3 bg-primary/5 rounded-xl border border-primary/10">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Perhitungan ini didasarkan pada <span className="font-bold text-primary">Tipe Lembur {type}</span> dengan total waktu <span className="font-bold text-primary">{item.total_time} jam</span>.
                        </p>
                    </div>
                    <OvertimeBreakdownContent item={item} />
                </div>
            </DialogContent>
        </Dialog>
    );
});
