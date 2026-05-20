"use client";

import * as React from 'react';
import { Control, Controller } from 'react-hook-form';
import { format } from 'date-fns';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { AvatarPicker } from '@/modules/employee/employee/components/avatar-picker';

import { CreateEmployeeFormValues } from '../../schemas';

interface PersonalInfoSectionProps {
  control: Control<CreateEmployeeFormValues>;
}

export function PersonalInfoSection({ control }: PersonalInfoSectionProps) {
  return (
    <div className="flex flex-col lg:flex-row items-start gap-8">
      <div className="w-full lg:w-72 shrink-0">
        <Controller
          name="avatar"
          control={control}
          render={({ field, fieldState }) => (
            <Field className="flex flex-col items-center justify-center p-6 bg-muted/20 rounded-2xl border border-dashed border-border/50 h-full min-h-[320px]">
              <FieldLabel required className="mb-6">Pas Foto</FieldLabel>
              <AvatarPicker
                value={field.value}
                onChange={field.onChange}
              />
              <div className="mt-6 space-y-1 text-center">
                <p className="text-xs font-medium text-foreground">Format JPG, PNG (Maks 2MB)</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Gunakan foto formal dengan latar belakang polos untuk profil karyawan.
                </p>
              </div>
              <FieldError errors={[fieldState.error]} className="mt-2" />
            </Field>
          )}
        />
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
        <div className='flex flex-row items-center gap-2 w-full'>
          <Controller
            name="first_name"
            control={control}
            render={({ field, fieldState }) => (
              <Field className='w-full'>
                <FieldLabel required>Nama Depan</FieldLabel>
                <Input {...field} placeholder="Nama Depan" />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            name="last_name"
            control={control}
            render={({ field, fieldState }) => (
              <Field className='w-full'>
                <FieldLabel>Nama Belakang</FieldLabel>
                <Input {...field} value={field.value || ''} placeholder="Nama Belakang" />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>

        <Controller
          name="full_name"
          control={control}
          render={({ field, fieldState }) => (
            <Field className="">
              <FieldLabel>Nama Lengkap</FieldLabel>
              <Input {...field} value={field.value || ''} placeholder="Nama Lengkap" disabled />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="gender_id"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Jenis Kelamin</FieldLabel>
              <Select value={field.value?.toString()} onValueChange={(val) => field.onChange(Number(val))}>
                <SelectTrigger >
                  <SelectValue placeholder="Pilih Jenis Kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Laki-Laki</SelectItem>
                  <SelectItem value="2">Perempuan</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="marital_status_id"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Status Pernikahan</FieldLabel>
              <Select value={field.value?.toString()} onValueChange={(val) => field.onChange(Number(val))}>
                <SelectTrigger >
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Menikah</SelectItem>
                  <SelectItem value="2">Lajang</SelectItem>
                  <SelectItem value="3">Duda</SelectItem>
                  <SelectItem value="4">Janda</SelectItem>
                  <SelectItem value="5">Bercerai</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="place_birth"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Tempat Lahir</FieldLabel>
              <Input {...field} value={field.value || ''} placeholder="Kota" />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="date_birth"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Tanggal Lahir</FieldLabel>
              <DatePicker
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : null)}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="phone_number"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Nomor Telepon (Rumah)</FieldLabel>
              <Input {...field} value={field.value || ''} placeholder="021..." />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="handphone"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Nomor Handphone</FieldLabel>
              <Input {...field} value={field.value || ''} placeholder="0812..." />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </div>
    </div>
  );
}
