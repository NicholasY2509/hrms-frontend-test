'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { workLocationSchema, WorkLocationFormValues } from '../schemas';
import { WorkLocation } from '../types';
import { useCreateWorkLocation, useUpdateWorkLocation } from '../hooks/use-work-location-mutation';

interface WorkLocationFormProps {
  initialData?: WorkLocation | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function WorkLocationForm({ initialData, onSuccess, onCancel }: WorkLocationFormProps) {
  const isEdit = !!initialData;
  const { createWorkLocation, isLoading: isCreating } = useCreateWorkLocation({ onSuccess });
  const { updateWorkLocation, isLoading: isUpdating } = useUpdateWorkLocation(initialData?.id || '', { onSuccess });

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<WorkLocationFormValues>({
    resolver: zodResolver(workLocationSchema),
    defaultValues: {
      name: initialData?.name || '',
    },
  });

  const onSubmit = async (values: WorkLocationFormValues) => {
    if (isEdit) {
      await updateWorkLocation(values);
    } else {
      await createWorkLocation(values);
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name} required>
              Nama Lokasi Kerja
            </FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="Contoh: Kantor Pusat, Cabang Bekasi"
              aria-invalid={fieldState.invalid}
              disabled={isLoading}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Batal
          </Button>
        )}
        <Button type="submit" disabled={isLoading || (isEdit && !isDirty)}>
          {isLoading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Lokasi'}
        </Button>
      </div>
    </form>
  );
}
