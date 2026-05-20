'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import { useCreateRequestType, useUpdateRequestType } from '../hooks/use-request-types-mutation';
import { RequestTypeFormValues, requestTypeSchema } from '../schemas/request-type-schema';
import { ApprovalRequestType } from '../types';

interface RequestTypeFormDialogProps {
  requestType: ApprovalRequestType | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RequestTypeFormDialog({
  requestType,
  isOpen,
  onClose,
}: RequestTypeFormDialogProps) {
  const { createRequestType } = useCreateRequestType();
  const { updateRequestType } = useUpdateRequestType();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<RequestTypeFormValues>({
    resolver: zodResolver(requestTypeSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      is_active: true,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      if (requestType) {
        reset({
          name: requestType.name,
          slug: requestType.slug,
          description: requestType.description || '',
          is_active: typeof requestType.is_active === 'string'
            ? requestType.is_active === '1' || requestType.is_active === 'true'
            : requestType.is_active,
        });
      } else {
        reset({
          name: '',
          slug: '',
          description: '',
          is_active: true,
        });
      }
    }
  }, [isOpen, requestType, reset]);

  const onSubmit = async (data: RequestTypeFormValues) => {
    try {
      if (requestType) {
        await updateRequestType({ id: requestType.id, data });
      } else {
        await createRequestType(data);
      }
      onClose();
    } catch (error) {
      // Error handled in hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{requestType ? 'Ubah Tipe Pengajuan' : 'Tambah Tipe Pengajuan'}</DialogTitle>
            <DialogDescription>
              Tentukan tipe pengajuan baru yang akan menggunakan alur persetujuan terpusat.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} required>Nama Tipe Pengajuan</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Contoh: Cuti Tahunan"
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
                    placeholder="Contoh: annual-leave"
                    disabled={isSubmitting}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
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
                    value={field.value ?? ''}
                    id={field.name}
                    placeholder="Penjelasan singkat mengenai tipe pengajuan ini..."
                    className="resize-none min-h-[100px]"
                    disabled={isSubmitting}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FieldLabel className="text-base">Status Aktif</FieldLabel>
                    <p className="text-sm text-muted-foreground">
                      Tipe pengajuan ini dapat digunakan dalam kebijakan alur.
                    </p>
                  </div>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </div>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2 min-w-[120px]">
              {isSubmitting ? (
                <HugeiconsIcon icon={Loading03Icon} className="h-4 w-4 animate-spin" />
              ) : (
                <HugeiconsIcon icon={SaveIcon} className="h-4 w-4" />
              )}
              {requestType ? 'Simpan Perubahan' : 'Tambah Tipe'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
