'use client';

import * as React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading03Icon, SaveIcon } from '@hugeicons/core-free-icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field';
import { ApprovalStepType } from '../types';
import { useCreateStepType, useUpdateStepType } from '../hooks/use-step-types-mutation';
import { stepTypeSchema, StepTypeFormValues } from '../schemas/step-type-schema';

interface StepTypeFormDialogProps {
  type: ApprovalStepType | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function StepTypeFormDialog({
  type,
  isOpen,
  onClose,
  onSuccess,
}: StepTypeFormDialogProps) {
  const { createStepType } = useCreateStepType();
  const { updateStepType } = useUpdateStepType();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<StepTypeFormValues>({
    resolver: zodResolver(stepTypeSchema),
    defaultValues: {
      name: '',
      slug: '',
      needs_target: false,
      description: '',
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      if (type) {
        reset({
          name: type.name,
          slug: type.slug,
          needs_target: type.needs_target,
          description: type.description || '',
        });
      } else {
        reset({
          name: '',
          slug: '',
          needs_target: false,
          description: '',
        });
      }
    }
  }, [type, isOpen, reset]);

  const onSubmit: SubmitHandler<StepTypeFormValues> = async (data) => {
    if (type?.id) {
      await updateStepType({ id: type.id, values: data });
    } else {
      await createStepType(data);
    }
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{type ? 'Ubah Tipe Tahapan' : 'Buat Tipe Tahapan'}</DialogTitle>
            <DialogDescription>
              {type
                ? 'Perbarui rincian tipe tahapan persetujuan.'
                : 'Tentukan tipe tahapan persetujuan baru untuk sistem.'}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} required>Nama</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="misal: Atasan Langsung"
                    disabled={isSubmitting}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="slug"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} required>Slug</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="misal: supervisor"
                    disabled={isSubmitting || !!type}
                    aria-invalid={fieldState.invalid}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Pengidentifikasi unik yang digunakan oleh backend. Tidak dapat diubah setelah dibuat.
                  </p>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="needs_target"
              control={control}
              render={({ field }) => (
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FieldLabel htmlFor={field.name}>Butuh Target</FieldLabel>
                    <p className="text-xs text-muted-foreground">
                      Apakah tahap ini memerlukan pemilihan pengguna atau grup tertentu?
                    </p>
                  </div>
                  <Switch
                    id={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </div>
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Deskripsi</FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder="Jelaskan cara kerja tipe tahapan ini..."
                    disabled={isSubmitting}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <HugeiconsIcon icon={Loading03Icon} className="h-4 w-4 animate-spin" />
              ) : (
                <HugeiconsIcon icon={SaveIcon} className="h-4 w-4" />
              )}
              {type ? 'Perbarui Tipe' : 'Buat Tipe'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
