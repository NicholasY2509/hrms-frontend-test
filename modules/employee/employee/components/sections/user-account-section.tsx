"use client";

import * as React from 'react';
import { Control, Controller } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';

import { CreateEmployeeFormValues } from '../../schemas';

interface UserAccountSectionProps {
  control: Control<CreateEmployeeFormValues>;
}

export function UserAccountSection({ control }: UserAccountSectionProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-4">
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel required>Username</FieldLabel>
              <Input {...field} placeholder="email@domain.com" />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel required>Password</FieldLabel>
              <Input {...field} type="password" placeholder="Password" />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="password_confirmation"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel required>Konfirmasi Password</FieldLabel>
              <Input {...field} type="password" placeholder="Konfirmasi Password" />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </div>
    </div>
  );
}
