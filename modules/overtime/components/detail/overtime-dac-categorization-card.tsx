'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle01Icon, ReverseWithdrawalIcon } from '@hugeicons/core-free-icons';
import { Overtime } from '../../types';
import { useOvertimeManagementTypes, useUpdateOvertimeType } from '../../hooks/use-overtime';

interface OvertimeDacCategorizationCardProps {
    item: Overtime;
}

export function OvertimeDacCategorizationCard({ item }: OvertimeDacCategorizationCardProps) {
    const { items: dacTypes, isLoading: isLoadingTypes } = useOvertimeManagementTypes();
    const { updateOvertimeType, isLoading: isUpdating } = useUpdateOvertimeType(item.id);

    const [selectedTypeId, setSelectedTypeId] = React.useState<string | undefined>(
        item.overtime_type_id?.toString()
    );

    const handleUpdate = async () => {
        if (!selectedTypeId) return;
        await updateOvertimeType({ overtime_type_id: selectedTypeId });
    };

    const isDac = React.useMemo(() => {
        const t = item.type || (typeof item.overtime_type === 'string' ? item.overtime_type : item.overtime_type?.name) || '';
        return t.toUpperCase() === 'DAC';
    }, [item.type, item.overtime_type]);

    if (!isDac) return null;

    return (
        <Card className="overflow-hidden border-none pt-0 shadow-sm ring-1 ring-muted">
            <CardHeader className="bg-muted/30 py-4">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                    <HugeiconsIcon icon={ReverseWithdrawalIcon} className="h-4 w-4 text-primary" />
                    Kategori DAC
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="dac-type">Tipe DAC</Label>
                    <Select
                        value={selectedTypeId}
                        onValueChange={setSelectedTypeId}
                        disabled={isLoadingTypes || isUpdating}
                    >
                        <SelectTrigger id="dac-type" className="w-full">
                            <SelectValue placeholder="Pilih tipe DAC..." />
                        </SelectTrigger>
                        <SelectContent>
                            {dacTypes.map((type: any) => (
                                <SelectItem key={type.id} value={type.id.toString()}>
                                    <div className="flex flex-col">
                                        <span className="font-bold">Tipe {type.name}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    className="w-full gap-2"
                    onClick={handleUpdate}
                    disabled={!selectedTypeId || selectedTypeId === item.overtime_type_id?.toString() || isUpdating}
                >
                    {isUpdating ? (
                        <HugeiconsIcon icon={ReverseWithdrawalIcon} className="h-4 w-4 animate-spin" />
                    ) : (
                        <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-4 w-4" />
                    )}
                    {item.overtime_type_id ? 'Perbarui Kategori' : 'Simpan Kategori'}
                </Button>
            </CardContent>
        </Card>
    );
}
