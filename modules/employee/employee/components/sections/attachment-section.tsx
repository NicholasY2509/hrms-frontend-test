"use client";

import * as React from 'react';
import { Control, Controller } from 'react-hook-form';

import { FileUpload } from '@/components/ui/file-upload';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';

import { CreateEmployeeFormValues } from '../../schemas';

interface AttachmentSectionProps {
  control: Control<CreateEmployeeFormValues>;
}

export function AttachmentSection({ control }: AttachmentSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-4">
      <Controller
        name="ktp"
        control={control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel required>Kartu Tanda Penduduk (KTP)</FieldLabel>
            <FileUpload
              value={field.value}
              onChange={field.onChange}
              label="Upload KTP"
              description="Format JPG, PNG, atau PDF (Maks 5MB)"
              accept="image/*,.pdf"
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        name="kartu_keluarga"
        control={control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel required>Kartu Keluarga (KK)</FieldLabel>
            <FileUpload
              value={field.value}
              onChange={field.onChange}
              label="Upload Kartu Keluarga"
              description="Format JPG, PNG, atau PDF (Maks 5MB)"
              accept="image/*,.pdf"
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        name="ijazah"
        control={control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel required>Ijazah Terakhir</FieldLabel>
            <FileUpload
              value={field.value}
              onChange={field.onChange}
              label="Upload Ijazah"
              description="Format JPG, PNG, atau PDF (Maks 5MB)"
              accept="image/*,.pdf"
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        name="file_pendukung"
        control={control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel required>File Pendukung (CV/Sertifikat)</FieldLabel>
            <FileUpload
              value={field.value}
              onChange={field.onChange}
              label="Upload File Pendukung"
              description="Format JPG, PNG, atau PDF (Maks 5MB)"
              accept="image/*,.pdf"
              multiple={true}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
    </div>
  );
}
