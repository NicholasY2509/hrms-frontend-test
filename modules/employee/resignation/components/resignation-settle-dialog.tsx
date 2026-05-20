'use client';

import * as React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { ResignationModel } from '../types';
import { useSettleResignation } from '../hooks/use-resignation';
import { DatePicker } from '@/components/ui/date-picker';

interface ResignationSettleDialogProps {
    item: ResignationModel;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function ResignationSettleDialog({ item, isOpen, onClose, onSuccess }: ResignationSettleDialogProps) {
    const [effectiveDate, setEffectiveDate] = React.useState<Date | undefined>(new Date());

    const { settleResignation, isLoading } = useSettleResignation(item.id, {
        onSuccess: () => {
            onClose();
            onSuccess?.();
        },
    });

    const handleSettle = async () => {
        if (!effectiveDate) return;
        const formattedDate = format(effectiveDate, 'yyyy-MM-dd');
        await settleResignation(formattedDate);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                        <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-6 w-6" />
                    </div>
                    <DialogTitle className="text-xl font-bold tracking-tight">Selesaikan Pengunduran Diri</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                        Konfirmasi tanggal efektif pengunduran diri untuk <span className="font-bold text-foreground">{item.employee.name}</span>. Tindakan ini akan memperbarui status karyawan secara permanen.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-6">
                    <div className="grid gap-2.5">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            Tanggal Efektif Akhir
                        </Label>
                        <DatePicker
                            value={effectiveDate}
                            onChange={setEffectiveDate}
                            disabled={isLoading}
                        />
                        <p className="text-[10px] text-muted-foreground italic mt-1 font-medium">
                            Permintaan awal karyawan: {format(new Date(item.effective_date), 'dd MMMM yyyy', { locale: localeId })}
                        </p>
                    </div>
                </div>
                <DialogFooter className="gap-3 sm:gap-0 border-t pt-6 mt-2">
                    <Button variant="ghost" onClick={onClose} disabled={isLoading} className="flex-1 sm:flex-none font-bold">
                        Batal
                    </Button>
                    <Button onClick={handleSettle} disabled={isLoading || !effectiveDate} className="gap-2 flex-1 sm:flex-none font-bold px-6">
                        {isLoading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                            <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-4 w-4 font-bold" />
                        )}
                        Konfirmasi & Selesaikan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
