'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field';
import { DatePicker } from '@/components/ui/date-picker';
import { format } from 'date-fns';
import { calculateAttendanceSchema, CalculateAttendanceFormValues } from '../schemas/calculate-attendance.schema';
import { useCalculateAttendance } from '../hooks/use-attendance';

interface CalculateAttendanceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CalculateAttendanceDialog({ open, onOpenChange }: CalculateAttendanceDialogProps) {
    const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm<CalculateAttendanceFormValues>({
        resolver: zodResolver(calculateAttendanceSchema),
        defaultValues: {
            start_date: '',
            end_date: '',
        }
    });

    const { calculateAttendance } = useCalculateAttendance({
        onSuccess: () => {
            onOpenChange(false);
            reset();
        }
    });

    const onSubmit = async (values: CalculateAttendanceFormValues) => {
        await calculateAttendance(values);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Hitung Kehadiran</DialogTitle>
                    <DialogDescription>
                        Proses ini akan menghitung ulang data kehadiran karyawan berdasarkan log scan untuk rentang tanggal yang dipilih.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <FieldGroup className="grid grid-cols-2 gap-4">
                        <Controller
                            name="start_date"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name} required>Tanggal Mulai</FieldLabel>
                                    <DatePicker
                                        value={field.value ? new Date(field.value) : undefined}
                                        onChange={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                                    />
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />
                        <Controller
                            name="end_date"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name} required>Tanggal Selesai</FieldLabel>
                                    <DatePicker
                                        value={field.value ? new Date(field.value) : undefined}
                                        onChange={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                                    />
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Memproses...' : 'Mulai Kalkulasi'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
