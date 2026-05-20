'use client';

import * as React from 'react';
import { useUnpaidLeaveTypeList } from '../hooks/use-unpaid-leave-type';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface UnpaidLeaveTypePickerProps {
    value?: number | string | null;
    onChange: (value: number | null) => void;
    placeholder?: string;
}

export function UnpaidLeaveTypePicker({
    value,
    onChange,
    placeholder = 'Pilih Tipe Izin',
}: UnpaidLeaveTypePickerProps) {
    const { items, isLoading } = useUnpaidLeaveTypeList();

    return (
        <Select
            value={value?.toString() || 'all'}
            onValueChange={(v) => onChange(v === 'all' ? null : Number(v))}
            disabled={isLoading}
        >
            <SelectTrigger className="h-9 bg-background">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Semua Tipe Izin</SelectItem>
                {items.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
