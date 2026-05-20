'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  IdCardLanyardIcon,
  Edit01Icon,
  Delete01Icon,
  Loading03Icon,
  Add01Icon,
  LicenseIcon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { useEmployeeDetails, useUpdateEmployeeDetails } from '../../../hooks/use-employee-detail';
import { DetailTabContainer } from './detail-tab-container';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { licenseSchema, LicenseFormValues } from '../../../schemas';
import { EmployeeLicense } from '../../../types';

interface LicenseTabProps {
  employeeId: string | number;
}

const LICENSE_TYPES = [
  { id: 1, name: 'SIM A' },
  { id: 2, name: 'SIM B1' },
  { id: 3, name: 'SIM C' },
] as const;

export function LicenseTab({ employeeId }: LicenseTabProps) {
  const { items, isLoading, mutate } = useEmployeeDetails(employeeId, 'license');
  const { update, isLoading: isUpdating } = useUpdateEmployeeDetails(employeeId, 'license');

  const [isOpen, setIsOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<LicenseFormValues>({
    resolver: zodResolver(licenseSchema),
    defaultValues: {
      license_number: '',
      driver_license_type_id: undefined,
    },
  });

  const handleAdd = () => {
    setEditingId(null);
    reset({
      license_number: '',
      driver_license_type_id: undefined,
    });
    setIsOpen(true);
  };

  const handleEdit = (item: EmployeeLicense) => {
    setEditingId(item.id);
    reset({
      license_number: item.license_number,
      driver_license_type_id: item.driver_license_type.id,
    });
    setIsOpen(true);
  };

  const onSubmit = async (data: LicenseFormValues) => {
    try {
      const normalize = (item: any) => ({
        id: item.id,
        license_number: item.license_number,
        driver_license_type_id: item.driver_license_type_id || item.driver_license_type?.id,
      });

      let updatedItems;
      if (editingId) {
        updatedItems = items.map((item: any) =>
          item.id === editingId ? { ...data, id: editingId } : item
        );
      } else {
        updatedItems = [...items, { ...data }];
      }

      const payload = updatedItems.map(normalize);
      await update(payload);
      setIsOpen(false);
      mutate();
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleDeleteRequest = (id: number) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      const normalize = (item: any) => ({
        id: item.id,
        license_number: item.license_number,
        driver_license_type_id: item.driver_license_type_id || item.driver_license_type?.id,
      });

      const updatedItems = items.filter((item: any) => item.id !== deletingId);
      const payload = updatedItems.map(normalize);
      await update(payload);
      mutate();
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <DetailTabContainer
      title="Surat Izin Mengemudi (SIM)"
      icon={IdCardLanyardIcon}
      isLoading={isLoading}
      isEmpty={items.length === 0}
      extra={
        <Button size="sm" className="gap-2" onClick={handleAdd}>
          <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" />
          Tambah SIM
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item: EmployeeLicense) => (
          <div key={item.id} className="group relative border p-5 rounded-2xl transition-all duration-300 hover:border-primary/30 bg-card">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <HugeiconsIcon icon={LicenseIcon} className="w-5 h-5" />
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => handleEdit(item)}>
                  <HugeiconsIcon icon={Edit01Icon} className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50" onClick={() => handleDeleteRequest(item.id)}>
                  <HugeiconsIcon icon={Delete01Icon} className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary px-2 py-0.5 bg-primary/5 rounded border border-primary/10">
                  {item.driver_license_type.name}
                </span>
              </div>
              <h4 className="font-mono text-base font-bold tracking-wider text-foreground pt-1">
                {item.license_number}
              </h4>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit SIM' : 'Tambah SIM'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            <Controller
              name="driver_license_type_id"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel required>Tipe SIM</FieldLabel>
                  <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Tipe SIM" />
                    </SelectTrigger>
                    <SelectContent>
                      {LICENSE_TYPES.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="license_number"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel required>Nomor SIM</FieldLabel>
                  <Input {...field} placeholder="Masukkan nomor SIM" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={isUpdating}>
                Batal
              </Button>
              <Button type="submit" className="gap-2" disabled={isUpdating}>
                {isUpdating ? (
                  <HugeiconsIcon icon={Loading03Icon} className="w-4 h-4 animate-spin" />
                ) : (
                  editingId ? 'Simpan Perubahan' : 'Tambah SIM'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus SIM"
        description="Apakah Anda yakin ingin menghapus data SIM ini?"
        confirmText="Hapus"
        variant="destructive"
        isLoading={isUpdating}
      />
    </DetailTabContainer>
  );
}
