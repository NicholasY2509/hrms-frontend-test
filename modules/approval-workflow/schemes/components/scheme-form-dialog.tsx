'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HugeiconsIcon } from '@hugeicons/react';
import { SaveIcon, Loading03Icon } from '@hugeicons/core-free-icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateScheme } from '../hooks/use-schemes-mutation';
import { schemeSchema, SchemeFormValues } from '../schemas/scheme-schema';

interface SchemeFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SchemeFormDialog({ isOpen, onClose }: SchemeFormDialogProps) {
  const { createScheme, isLoading } = useCreateScheme();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SchemeFormValues>({
    resolver: zodResolver(schemeSchema),
    defaultValues: {
      name: '',
      model_class: '',
      description: '',
    },
  });

  React.useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: SchemeFormValues) => {
    try {
      await createScheme({
        ...data,
        is_active: true,
      });
      onClose();
    } catch (error) { }
  }


  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Tambah Kategori Kebijakan</DialogTitle>
            <DialogDescription>
              Buat kategori baru untuk pengajuan yang memerlukan persetujuan.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-4">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel required>Nama Kategori</FieldLabel>
                  <Input {...field} placeholder="Contoh: Izin Meninggalkan Kantor, Lembur" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="model_class"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel required>Model Class</FieldLabel>
                  <Input {...field} placeholder="Contoh: App\Modules\Leave\Models\LeaveRequest" />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Namespace lengkap dari model yang akan menggunakan kebijakan ini.
                  </p>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Deskripsi</FieldLabel>
                  <Textarea {...field} value={field.value || ''} placeholder="Penjelasan singkat mengenai kategori ini..." />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2 min-w-[120px]">
              {isLoading ? (
                <HugeiconsIcon icon={Loading03Icon} className="h-4 w-4 animate-spin" />
              ) : (
                <HugeiconsIcon icon={SaveIcon} className="h-4 w-4" />
              )}
              Simpan Kategori
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}
