'use client';

import * as React from 'react';
import { useForm, Controller, useFieldArray, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, Delete02Icon } from '@hugeicons/core-free-icons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import { departmentSchema, DepartmentFormValues } from '../schemas';
import { Department } from '../types';
import { useCreateDepartment, useUpdateDepartment } from '../hooks/use-department-mutation';
import { EmployeePicker } from '@/modules/employee/employee/components/employee-picker';
import { WorkLocationPicker } from '../../work-location/components/work-location-picker';

interface DepartmentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  department?: Department | null;
  onSuccess: () => void;
}

export function DepartmentFormDialog({
  isOpen,
  onClose,
  department,
  onSuccess,
}: DepartmentFormDialogProps) {
  const isEdit = !!department;
  const { createDepartment, isLoading: isCreating } = useCreateDepartment();
  const { updateDepartment, isLoading: isUpdating } = useUpdateDepartment();
  const isLoading = isCreating || isUpdating;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: '',
      heads: [] as DepartmentFormValues['heads'],
    } as DepartmentFormValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'heads',
  });

  React.useEffect(() => {
    if (department) {
      reset({
        name: department.name,
        heads: department.heads.map(h => ({
          work_location_id: h.work_location_id,
          employee_id: h.employee_id,
        })),
      });
    } else {
      reset({
        name: '',
        heads: [],
      });
    }
  }, [department, reset, isOpen]);

  const onSubmit: SubmitHandler<DepartmentFormValues> = async (data) => {
    const success = isEdit
      ? await updateDepartment({ id: department.id, data })
      : await createDepartment(data);

    if (success) {
      onSuccess();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Ubah Department' : 'Tambah Department'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name" required>Nama Department</FieldLabel>
                <Input {...field} id="name" placeholder="Masukkan nama department..." />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FieldLabel className="text-base font-semibold">Kepala Department per Lokasi</FieldLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => append({ work_location_id: null, employee_id: 0 })}
              >
                <HugeiconsIcon icon={Add01Icon} className="h-4 w-4" />
                Tambah Assignment
              </Button>
            </div>

            {fields.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Belum ada kepala department yang ditugaskan.</p>
              </div>
            )}

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-3 items-start bg-muted/30 p-3 rounded-lg border">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <Controller
                      name={`heads.${index}.work_location_id`}
                      control={control}
                      render={({ field: fieldProps, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel required className="text-xs">Lokasi</FieldLabel>
                          <WorkLocationPicker
                            value={fieldProps.value || null}
                            onChange={(val) => fieldProps.onChange(Number(val))}
                            className="h-9 text-sm"
                          />
                          <FieldError errors={[fieldState.error]} />
                        </Field>
                      )}
                    />
                    <Controller
                      name={`heads.${index}.employee_id`}
                      control={control}
                      render={({ field: fieldProps, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel required className="text-xs">Kepala Department</FieldLabel>
                          <EmployeePicker
                            value={fieldProps.value || null}
                            onChange={(val) => fieldProps.onChange(val ? Number(val) : null)}
                          />
                          <FieldError errors={[fieldState.error]} />
                        </Field>
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => remove(index)}
                  >
                    <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
