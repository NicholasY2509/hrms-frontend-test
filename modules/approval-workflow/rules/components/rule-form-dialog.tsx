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
import { WorkPositionPicker } from '@/modules/organization/work-position/components/work-position-picker';
import { WorkLocationPicker } from '@/modules/organization/work-location/components/work-location-picker';
import { DepartmentPicker } from '@/modules/organization/department/components/department-picker';
import { useCreateRule } from '../hooks/use-rules-mutation';
import { ruleSchema, RuleFormValues } from '../schemas/rule-schema';
import { toast } from 'sonner';

interface RuleFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  schemeId: number | string;
}

export function RuleFormDialog({ isOpen, onClose, schemeId }: RuleFormDialogProps) {
  const { createRule, isLoading } = useCreateRule();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RuleFormValues>({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      work_position_id: null,
      department_id: null,
      work_location_id: null,
    },
  });

  const selectedPosition = watch('work_position_id');
  const selectedDepartment = watch('department_id');

  React.useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: RuleFormValues) => {
    if (!data.work_position_id && !data.department_id) {
      toast.error("Pilih salah satu: Jabatan atau Departemen");
      return;
    }

    try {
      const payload = {
        work_position_id: data.work_position_id || null,
        department_id: data.department_id || null,
        work_location_id: data.work_location_id || null,
        is_active: true,
        is_default: false,
        steps: [], // Initially empty
      };
      await createRule({ schemeId: Number(schemeId), payload });
      onClose();
    } catch (error) { }
  };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Tambah Aturan Khusus</DialogTitle>
            <DialogDescription>
              Tentukan jabatan, departemen, atau lokasi kerja yang akan memiliki alur persetujuan berbeda.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-4">
            <Controller
              name="work_position_id"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Jabatan</FieldLabel>
                  <WorkPositionPicker
                    value={field.value}
                    onChange={(val: any) => {
                      field.onChange(val);
                      if (val) setValue('department_id', null);
                    }}
                    placeholder={selectedDepartment ? "Dinonaktifkan karena departemen dipilih" : "Cari dan pilih jabatan..."}
                    disabled={!!selectedDepartment}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Atau</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <Controller
              name="department_id"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Departemen</FieldLabel>
                  <DepartmentPicker
                    value={field.value}
                    onChange={(val: any) => {
                      field.onChange(val);
                      if (val) setValue('work_position_id', null);
                    }}
                    placeholder={selectedPosition ? "Dinonaktifkan karena jabatan dipilih" : "Cari dan pilih departemen..."}
                    disabled={!!selectedPosition}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="h-2" />

            <Controller
              name="work_location_id"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Lokasi Kerja (Opsional)</FieldLabel>
                  <WorkLocationPicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Semua Lokasi"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Aturan akan berlaku untuk {selectedPosition ? 'Jabatan' : 'Departemen'} terpilih di lokasi ini.
                  </p>
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
              Simpan Aturan
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}
