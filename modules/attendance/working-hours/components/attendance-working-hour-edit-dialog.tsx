'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { WorkingHourPicker } from './working-hour-picker';
import { WorkingHourModel } from '../types';
import { useUpdateAttendanceWorkingHour } from '../hooks/use-working-hours';
import { DatePicker } from '@/components/ui/date-picker';
import { format } from 'date-fns';
import { attendanceWorkingHourSchema, AttendanceWorkingHourFormValues } from '../schemas/attendance-working-hour.schema';

interface AttendanceWorkingHourEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: WorkingHourModel | null;
  onSuccess?: () => void;
}

export function AttendanceWorkingHourEditDialog({
  open,
  onOpenChange,
  data,
  onSuccess,
}: AttendanceWorkingHourEditDialogProps) {
  const { updateAttendanceWorkingHour, isLoading } = useUpdateAttendanceWorkingHour({
    onSuccess: () => {
      onOpenChange(false);
      onSuccess?.();
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AttendanceWorkingHourFormValues>({
    resolver: zodResolver(attendanceWorkingHourSchema),
  });

  React.useEffect(() => {
    if (data && open) {
      reset({
        working_hour_id: data.working_hour_id,
        attendance_at: new Date(data.date),
      });
    }
  }, [data, open, reset]);

  const onFormSubmit = async (values: AttendanceWorkingHourFormValues) => {
    if (!data) return;

    await updateAttendanceWorkingHour({
      id: data.id,
      data: {
        working_hour_id: values.working_hour_id,
        attendance_at: format(values.attendance_at, 'yyyy-MM-dd HH:mm:ss'),
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Edit Jadwal Kerja Karyawan</DialogTitle>
            <DialogDescription>
              Ubah jadwal kerja untuk {data?.employee?.name} pada tanggal ini.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Controller
              name="attendance_at"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel required>Tanggal</FieldLabel>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pilih Tanggal"
                  />
                  <FieldError errors={[errors.attendance_at?.message]} />
                </Field>
              )}
            />

            <Controller
              name="working_hour_id"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel required>Jadwal Kerja</FieldLabel>
                  <WorkingHourPicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pilih Jam Kerja"
                    showAllOption={false}
                  />
                  <FieldError errors={[errors.working_hour_id?.message]} />
                </Field>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
