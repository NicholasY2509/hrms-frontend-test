'use client';

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field';
import { WorkPositionPicker } from '@/modules/organization/work-position/components/work-position-picker';
import { useApprovalRequestTypes } from '../../request-types/hooks/use-request-types';
import { usePolicies } from '../hooks/use-policies';
import { useCreatePolicy, useUpdatePolicySteps } from '../hooks/use-policies-mutation';
import { PolicyFormValues, policySchema } from '../schemas/policy-schema';
import { useEffect } from 'react';

interface PolicyFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  policy?: any;
}

export function PolicyFormDialog({ isOpen, onClose, policy }: PolicyFormDialogProps) {
  const { requestTypes } = useApprovalRequestTypes();
  const { createPolicy, isLoading: isCreating } = useCreatePolicy();
  const { updatePolicySteps, isLoading: isUpdating } = useUpdatePolicySteps();
  const isLoading = isCreating || isUpdating;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PolicyFormValues>({
    resolver: zodResolver(policySchema),
    defaultValues: {
      name: '',
      approvable_type: '',
      is_default: false,
      work_position_id: null,
      is_active: true,
    },
  });

  const isDefault = watch('is_default');
  const selectedType = watch('approvable_type');

  useEffect(() => {
    if (!policy) {
      const typeName = requestTypes.find((t: any) => t.model_class === selectedType)?.name || '';
      if (typeName) {
        setValue('name', isDefault ? `${typeName} - Global Default` : `${typeName} Policy`);
      }
    }
  }, [selectedType, isDefault, requestTypes, setValue, policy]);

  useEffect(() => {
    if (isOpen && policy) {
      reset({
        name: policy.name,
        approvable_type: policy.approvable_type,
        is_default: policy.is_default,
        work_position_id: policy.work_position_id?.toString() || null,
        is_active: policy.is_active,
      });
    } else if (!isOpen) {
      reset({
        name: '',
        approvable_type: '',
        is_default: false,
        work_position_id: null,
        is_active: true,
      });
    }
  }, [isOpen, policy, reset]);

  const onSubmit = async (data: PolicyFormValues) => {
    try {
      if (policy) {
        await updatePolicySteps({ id: policy.id, steps: [] });
      } else {
        await createPolicy(data);
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
            <DialogTitle>{policy ? 'Ubah Kebijakan' : 'Tambah Kebijakan Baru'}</DialogTitle>
            <DialogDescription>
              Tentukan tipe pengajuan dan target jabatan untuk kebijakan ini.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4 space-y-4">
            <Controller
              name="approvable_type"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel required>Tipe Pengajuan</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={!!policy}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Pilih tipe pengajuan..." />
                    </SelectTrigger>
                    <SelectContent>
                      {requestTypes.map((type: any) => (
                        <SelectItem key={type.id} value={type.model_class}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="is_default"
              control={control}
              render={({ field }) => (
                <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/30">
                  <div className="space-y-0.5">
                    <Label className="text-base">Global Default</Label>
                    <p className="text-sm text-muted-foreground">
                      Gunakan ini sebagai alur utama jika tidak ada aturan khusus per jabatan.
                    </p>
                  </div>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      if (checked) setValue('work_position_id', null);
                    }}
                    disabled={!!policy}
                  />
                </div>
              )}
            />

            {!isDefault && (
              <Controller
                name="work_position_id"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel required>Target Jabatan</FieldLabel>
                    <WorkPositionPicker
                      value={field.value}
                      onChange={field.onChange}
                      disabled={!!policy}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            )}

            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel required>Nama Kebijakan</FieldLabel>
                  <Input {...field} placeholder="Contoh: Kebijakan Cuti Manager" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

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
              {policy ? 'Simpan Perubahan' : 'Buat Kebijakan'}
            </Button>

          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
