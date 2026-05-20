"use client";

import * as React from 'react';
import { Control, Controller } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';

import { CreateEmployeeFormValues } from '../../schemas';

interface IdentityAddressSectionProps {
  control: Control<CreateEmployeeFormValues>;
}

export function IdentityAddressSection({ control }: IdentityAddressSectionProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-4">
        <Controller
          name="id_card_number"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel required>Nomor KTP</FieldLabel>
              <Input {...field} value={field.value ?? ''} placeholder="Nomor KTP" />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="religion_id"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel required>Agama</FieldLabel>
              <Select value={field.value?.toString()} onValueChange={(val) => field.onChange(Number(val))}>
                <SelectTrigger >
                  <SelectValue placeholder="Pilih Agama" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Islam</SelectItem>
                  <SelectItem value="2">Kristen</SelectItem>
                  <SelectItem value="7">Katolik</SelectItem>
                  <SelectItem value="3">Hindu</SelectItem>
                  <SelectItem value="4">Buddha</SelectItem>
                  <SelectItem value="5">Konghucu</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="blood_group_id"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel required>Golongan Darah</FieldLabel>
              <Select value={field.value?.toString()} onValueChange={(val) => field.onChange(Number(val))}>
                <SelectTrigger >
                  <SelectValue placeholder="Pilih Golongan Darah" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">0</SelectItem>
                  <SelectItem value="2">A</SelectItem>
                  <SelectItem value="3">B</SelectItem>
                  <SelectItem value="4">AB</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </div>

      <Separator className="bg-border/50" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8">
        <Controller
          name="current_address"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel required>Alamat Domisili</FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ''}
                placeholder="Alamat Lengkap"
                className="min-h-[120px] resize-none rounded-xl bg-background/50 focus:bg-background transition-colors p-4"
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="residence_address"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel required>Alamat sesuai KTP</FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ''}
                placeholder="Alamat Lengkap"
                className="min-h-[120px] resize-none rounded-xl bg-background/50 focus:bg-background transition-colors p-4"
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </div>
    </div>
  );
}
