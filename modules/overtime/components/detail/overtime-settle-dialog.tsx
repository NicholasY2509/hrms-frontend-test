'use client';

import * as React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { NumericFormat } from 'react-number-format';
import { Overtime } from "../../types";
import { useSettleOvertime } from "../../hooks/use-overtime";

interface OvertimeSettleDialogProps {
    item: Overtime;
    trigger: React.ReactNode;
}

export function OvertimeSettleDialog({ item, trigger }: OvertimeSettleDialogProps) {
    const [open, setOpen] = React.useState(false);
    const [price, setPrice] = React.useState<string>(item.estimated_overtime_price?.toString() || '');
    const { settleOvertime, isLoading } = useSettleOvertime(item.id, {
        onSuccess: () => setOpen(false),
    });

    const handleSettle = async () => {
        if (!price) return;
        await settleOvertime({ real_overtime_price: price });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Settle Pengajuan Lembur</DialogTitle>
                    <DialogDescription>
                        Masukkan nominal real harga lembur untuk menyelesaikan pengajuan ini.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="price">Harga Real Lembur</Label>
                        <NumericFormat
                            customInput={Input}
                            id="price"
                            prefix='Rp '
                            value={price}
                            onValueChange={(values) => setPrice(values.value)}
                            thousandSeparator="."
                            decimalSeparator=","
                            placeholder="0"
                            allowNegative={false}
                            disabled={isLoading}
                        />
                        <p className="text-[10px] text-muted-foreground italic">
                            Estimasi awal: Rp {item.estimated_overtime_price?.toLocaleString('id-ID')}
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                        Batal
                    </Button>
                    <Button onClick={handleSettle} disabled={isLoading || !price} className="gap-2">
                        {isLoading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                            <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-4 w-4" />
                        )}
                        Konfirmasi Settle
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
