'use client';

import * as React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Field,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import { DatePicker } from '@/components/ui/date-picker';
import { employeeSalarySchema, type EmployeeSalaryFormValues } from '../schemas/employee-salary-schema';
import { EmployeeSalary } from '../types';
import { useUpdateEmployeeSalary } from '../hooks/use-employee-salary-mutation';
import { format } from 'date-fns';
import { NumericFormat } from 'react-number-format';

interface EmployeeSalaryFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employeeSalary?: EmployeeSalary | null;
  onSuccess: () => void;
}

export function EmployeeSalaryFormDialog({
  isOpen,
  onClose,
  employeeSalary,
  onSuccess,
}: EmployeeSalaryFormDialogProps) {
  const { updateSalary, isLoading } = useUpdateEmployeeSalary();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeSalaryFormValues>({
    resolver: zodResolver(employeeSalarySchema) as any,
    defaultValues: {
      employee_id: 0,
      bpjs_base_amount: 0,
      actual_base_amount: 0,
      effective_date: format(new Date(), 'yyyy-MM-dd'),
      reason: '',
    },
  });

  React.useEffect(() => {
    if (employeeSalary) {
      reset({
        employee_id: employeeSalary.employee_id,
        bpjs_base_amount: employeeSalary.bpjs_base_amount,
        actual_base_amount: employeeSalary.actual_base_amount,
        effective_date: employeeSalary.effective_date,
        reason: '',
      });
    } else {
      reset({
        employee_id: 0,
        bpjs_base_amount: 0,
        actual_base_amount: 0,
        effective_date: format(new Date(), 'yyyy-MM-dd'),
        reason: '',
      });
    }
  }, [employeeSalary, reset, isOpen]);

  const onSubmit: SubmitHandler<EmployeeSalaryFormValues> = async (data) => {
    try {
      await updateSalary(data);
      onSuccess();
      onClose();
    } catch (error) {
      // Error is handled by the mutation hook (toast)
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Gaji Karyawan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="actual_base_amount"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="actual_base_amount" required>Gaji Pokok</FieldLabel>
                  <NumericFormat
                    customInput={Input}
                    id="actual_base_amount"
                    placeholder="Contoh: 5.000.000"
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="Rp "
                    allowNegative={false}
                    value={field.value || ''}
                    onValueChange={(values) => {
                      field.onChange(values.floatValue || 0);
                    }}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="bpjs_base_amount"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="bpjs_base_amount" required>Dasar BPJS</FieldLabel>
                  <NumericFormat
                    customInput={Input}
                    id="bpjs_base_amount"
                    placeholder="Contoh: 5.000.000"
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="Rp "
                    allowNegative={false}
                    value={field.value || ''}
                    onValueChange={(values) => {
                      field.onChange(values.floatValue || 0);
                    }}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>

          <Controller
            name="effective_date"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel required>Tanggal Efektif</FieldLabel>
                <DatePicker
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            name="reason"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="reason" required>Alasan Perubahan</FieldLabel>
                <Textarea 
                  {...field} 
                  id="reason" 
                  placeholder="Masukkan alasan penyesuaian gaji..." 
                  className="resize-none"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
