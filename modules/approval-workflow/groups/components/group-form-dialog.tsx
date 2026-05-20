'use client';

import * as React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
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
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field';
import { ApprovalGroup } from '../types';
import { groupSchema, GroupFormValues } from '../schemas/group-schema';
import { useCreateApprovalGroup, useUpdateApprovalGroup } from '../hooks/use-approval-group-mutation';

interface GroupFormDialogProps {
  group: ApprovalGroup | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function GroupFormDialog({
  group,
  isOpen,
  onClose,
  onSuccess,
}: GroupFormDialogProps) {
  const { createGroup, isLoading: isCreating } = useCreateApprovalGroup();
  const { updateGroup, isLoading: isUpdating } = useUpdateApprovalGroup();
  const isLoading = isCreating || isUpdating;
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      if (group) {
        reset({
          name: group.name,
          description: group.description || '',
        });
      } else {
        reset({
          name: '',
          description: '',
        });
      }
    }
  }, [group, isOpen, reset]);

  const onSubmit: SubmitHandler<GroupFormValues> = async (data) => {
    if (group) {
      await updateGroup({ id: group.id, data });
    } else {
      await createGroup(data);
    }
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{group ? 'Ubah Grup' : 'Buat Grup Baru'}</DialogTitle>
            <DialogDescription>
              {group
                ? 'Perbarui rincian grup persetujuan.'
                : 'Tentukan grup persetujuan baru untuk mengelompokkan pengguna.'}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} required>Nama Grup</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="misal: Staff HRD"
                    disabled={isLoading}
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
                    placeholder="Jelaskan tujuan grup ini..."
                    className="min-h-[120px]"
                    disabled={isLoading}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading ? (
                <HugeiconsIcon icon={Loading03Icon} className="h-4 w-4 animate-spin" />
              ) : (
                <HugeiconsIcon icon={SaveIcon} className="h-4 w-4" />
              )}
              {group ? 'Perbarui Grup' : 'Simpan Grup'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
