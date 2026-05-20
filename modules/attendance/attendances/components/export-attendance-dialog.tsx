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
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { DatePicker } from '@/components/ui/date-picker';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { EmployeePicker } from '@/modules/employee/employee/components/employee-picker';
import { DepartmentPicker } from '@/modules/organization/department/components/department-picker';
import { TeamPicker } from '@/modules/organization/teams/components/team-picker';
import { WorkLocationPicker } from '@/modules/organization/work-location/components/work-location-picker';
import { exportAttendanceSchema, ExportAttendanceFormValues } from '../schemas/export-attendance.schema';
import { useExportAttendance } from '../hooks/use-attendance';
import { AttendanceStatusPicker } from '../../shared/components/attendance-status-picker';

interface ExportAttendanceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ExportAttendanceDialog({ open, onOpenChange }: ExportAttendanceDialogProps) {
    const [formKey, setFormKey] = React.useState(0);

    const { control, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm<ExportAttendanceFormValues>({
        resolver: zodResolver(exportAttendanceSchema),
        defaultValues: {
            start_date: '',
            end_date: '',
            report_type: undefined,
            employee_id: null,
            team_id: null,
            department_id: null,
            work_location_id: null,
            attendance_status_id: null,
            format: 'excel',
        }
    });

    const reportType = watch('report_type');

    const { exportAttendance } = useExportAttendance({
        onSuccess: () => {
            onOpenChange(false);
        }
    });

    const onSubmit = async (values: ExportAttendanceFormValues) => {
        await exportAttendance(values);
    };

    const handleReset = () => {
        reset({
            start_date: '',
            end_date: '',
            report_type: undefined,
            employee_id: null,
            team_id: null,
            department_id: null,
            work_location_id: null,
            attendance_status_id: null,
            format: 'pdf',
        });
        setFormKey(prev => prev + 1);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Export Laporan Kehadiran</DialogTitle>
                </DialogHeader>

                <form key={formKey} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 py-4">
                    <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <h4 className="text-sm font-semibold">Periode Laporan</h4>
                            <p className="text-xs text-muted-foreground">Pilih rentang tanggal data yang ingin diexport.</p>
                        </div>
                        <div className='flex flex-row gap-4 w-full'>
                            <Controller
                                name="start_date"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className='w-full'>
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
                                    <Field data-invalid={fieldState.invalid} className='w-full'>
                                        <FieldLabel htmlFor={field.name} required>Tanggal Selesai</FieldLabel>
                                        <DatePicker
                                            value={field.value ? new Date(field.value) : undefined}
                                            onChange={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                                        />
                                        <FieldError errors={[fieldState.error]} />
                                    </Field>
                                )}
                            />
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <h4 className="text-sm font-semibold">Konfigurasi Laporan</h4>
                            <p className="text-xs text-muted-foreground">Tentukan tipe laporan dan format file output.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Controller
                                name="report_type"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className='w-full'>
                                        <FieldLabel htmlFor={field.name} required>Tipe Laporan</FieldLabel>
                                        <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                                            <SelectTrigger id={field.name}>
                                                <SelectValue placeholder="Pilih Tipe Laporan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="daily_report">Laporan Harian</SelectItem>
                                                <SelectItem value="personal_report">Laporan Personal</SelectItem>
                                                <SelectItem value="team_report">Laporan Tim</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FieldError errors={[fieldState.error]} />
                                    </Field>
                                )}
                            />

                            <Controller
                                name="format"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name} required>Format File</FieldLabel>
                                        <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                                            <SelectTrigger id={field.name}>
                                                <SelectValue placeholder="Pilih Format" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="txt">Text (.txt)</SelectItem>
                                                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                                                <SelectItem value="csv">CSV (.csv)</SelectItem>
                                                <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FieldError errors={[fieldState.error]} />
                                    </Field>
                                )}
                            />
                        </div>
                    </div>

                    {reportType && (
                        <>
                            <Separator />
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex flex-col gap-1">
                                    <h4 className="text-sm font-semibold">Filter Data</h4>
                                    <p className="text-xs text-muted-foreground">Opsional: Batasi data berdasarkan kriteria tertentu.</p>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                    {(reportType === 'personal_report') && (
                                        <Controller
                                            name="employee_id"
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid} className='w-full col-span-2'>
                                                    <FieldLabel htmlFor={field.name}>Karyawan</FieldLabel>
                                                    <EmployeePicker
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        placeholder='Pilih Karyawan'
                                                    />
                                                    <FieldError errors={[fieldState.error]} />
                                                </Field>
                                            )}
                                        />
                                    )}

                                    {(reportType === 'team_report' || reportType === 'daily_report') && (
                                        <Controller
                                            name="team_id"
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid} className='w-full'>
                                                    <FieldLabel htmlFor={field.name}>Tim</FieldLabel>
                                                    <TeamPicker
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        placeholder='Pilih Team'
                                                    />
                                                    <FieldError errors={[fieldState.error]} />
                                                </Field>
                                            )}
                                        />
                                    )}

                                    {(reportType !== 'personal_report') && (
                                        <>
                                            {reportType !== 'team_report' && (
                                                <Controller
                                                    name="department_id"
                                                    control={control}
                                                    render={({ field, fieldState }) => (
                                                        <Field data-invalid={fieldState.invalid} className='w-full'>
                                                            <FieldLabel htmlFor={field.name}>Departemen</FieldLabel>
                                                            <DepartmentPicker
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                placeholder='Pilih Departemen'
                                                            />
                                                            <FieldError errors={[fieldState.error]} />
                                                        </Field>
                                                    )}
                                                />
                                            )}
                                            <Controller
                                                name="work_location_id"
                                                control={control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid} className='w-full'>
                                                        <FieldLabel htmlFor={field.name}>Lokasi Kerja</FieldLabel>
                                                        <WorkLocationPicker
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            placeholder='Pilih Lokasi Kerja'
                                                        />
                                                        <FieldError errors={[fieldState.error]} />
                                                    </Field>
                                                )}
                                            />
                                            {reportType !== 'team_report' && (
                                                <Controller
                                                    name="attendance_status_id"
                                                    control={control}
                                                    render={({ field, fieldState }) => (
                                                        <Field data-invalid={fieldState.invalid} className='w-full'>
                                                            <FieldLabel htmlFor={field.name}>Status Kehadiran</FieldLabel>
                                                            <AttendanceStatusPicker
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                placeholder='Pilih Status'
                                                            />
                                                            <FieldError errors={[fieldState.error]} />
                                                        </Field>
                                                    )}
                                                />
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    <DialogFooter className="pt-2 gap-2">
                        <div className="flex-1 flex gap-2">
                            <Button type="button" variant="outline" onClick={handleReset} disabled={isSubmitting}>
                                Reset
                            </Button>
                        </div>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Batal</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Memproses...' : 'Mulai Export'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
