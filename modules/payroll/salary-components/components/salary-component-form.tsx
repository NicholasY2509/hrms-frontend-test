'use client';

import * as React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { SalaryComponent } from '../types';
import { salaryComponentSchema, SalaryComponentFormValues } from '../schemas';
import { useSalaryComponentMutation } from '../hooks';

interface SalaryComponentFormProps {
  initialData?: SalaryComponent;
  onSuccess: () => void;
  onCancel: () => void;
}

export function SalaryComponentForm({ initialData, onSuccess, onCancel }: SalaryComponentFormProps) {
  const { create, update, isCreating, isUpdating } = useSalaryComponentMutation();

  const { control, handleSubmit } = useForm<SalaryComponentFormValues>({
    resolver: zodResolver(salaryComponentSchema) as any,
    defaultValues: initialData ? {
      name: initialData.name,
      code: initialData.code,
      category: initialData.category,
      type: initialData.type,
      default_amount: initialData.default_amount,
      is_taxable: initialData.is_taxable,
      is_active: initialData.is_active,
    } : {
      name: '',
      code: '',
      category: 'allowance',
      type: 'fixed',
      default_amount: 0,
      is_taxable: true,
      is_active: true,
    },
  });

  const onSubmit: SubmitHandler<SalaryComponentFormValues> = async (data) => {
    if (initialData) {
      await update({ id: initialData.id, data });
    } else {
      await create(data);
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field className="col-span-2">
              <FieldLabel htmlFor={field.name} required>Nama Komponen</FieldLabel>
              <Input {...field} id={field.name} placeholder="Contoh: Tunjangan Transport" />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Controller
          name="code"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name} required>Kode</FieldLabel>
              <Input {...field} id={field.name} placeholder="Contoh: T_TRANS" />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Controller
          name="default_amount"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name} required>Nominal Default</FieldLabel>
              <Input {...field} type="number" id={field.name} />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Controller
          name="category"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name} required>Kategori</FieldLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id={field.name}>
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allowance">Allowance (Tunjangan)</SelectItem>
                  <SelectItem value="deduction">Deduction (Potongan)</SelectItem>
                  <SelectItem value="benefit">Benefit (Tunjangan Perusahaan)</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Controller
          name="type"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name} required>Tipe</FieldLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id={field.name}>
                  <SelectValue placeholder="Pilih Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed (Tetap)</SelectItem>
                  <SelectItem value="calculated">Calculated (Dihitung)</SelectItem>
                  <SelectItem value="one-time">One-time (Sekali bayar)</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </div>

      <div className="flex gap-8 border-y py-4">
        <Controller
          name="is_taxable"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-3">
              <Switch checked={field.value} onCheckedChange={field.onChange} id="is_taxable" />
              <div className="flex flex-col gap-0.5">
                <FieldLabel htmlFor="is_taxable">Kena Pajak</FieldLabel>
                <span className="text-xs text-muted-foreground">Aktifkan jika komponen ini adalah objek pajak.</span>
              </div>
            </div>
          )}
        />
        <Controller
          name="is_active"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-3">
              <Switch checked={field.value} onCheckedChange={field.onChange} id="is_active" />
              <div className="flex flex-col gap-0.5">
                <FieldLabel htmlFor="is_active">Aktif</FieldLabel>
                <span className="text-xs text-muted-foreground">Tampilkan komponen ini di payroll.</span>
              </div>
            </div>
          )}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
        <Button type="submit" disabled={isCreating || isUpdating}>
          {initialData ? 'Simpan Perubahan' : 'Tambah Komponen'}
        </Button>
      </div>
    </form>
  );
}
