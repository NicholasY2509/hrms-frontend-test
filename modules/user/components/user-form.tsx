'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field';
import { EmployeePicker } from '@/modules/employee/employee/components/employee-picker';
import { userSchema, UserFormValues } from '../schemas/user-schema';
import { UserModel } from '../types';

interface UserFormProps {
  initialData?: UserModel;
  onSubmit: (data: UserFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function UserForm({ initialData, onSubmit, isLoading }: UserFormProps) {
  const isEdit = !!initialData;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: initialData?.email || '',
      password: '',
      password_confirmation: '',
      employee_id: initialData?.employee_id || null,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name} required>Email</FieldLabel>
              <Input {...field} id={field.name} type="email" placeholder="contoh@email.com" aria-invalid={fieldState.invalid} />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} required={!isEdit}>Password</FieldLabel>
                <Input {...field} id={field.name} type="password" placeholder={isEdit ? "Isi untuk ubah password" : "********"} aria-invalid={fieldState.invalid} />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            name="password_confirmation"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} required={!isEdit}>Konfirmasi Password</FieldLabel>
                <Input {...field} id={field.name} type="password" placeholder="********" aria-invalid={fieldState.invalid} />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>

        <Controller
          name="employee_id"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Hubungkan ke Karyawan</FieldLabel>
              <EmployeePicker
                value={field.value || null}
                onChange={field.onChange}
                placeholder="Cari karyawan..."
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Mohon Tunggu...' : (isEdit ? 'Simpan Perubahan' : 'Buat Pengguna')}
        </Button>
      </div>
    </form>
  );
}
