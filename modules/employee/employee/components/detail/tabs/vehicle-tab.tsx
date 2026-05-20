'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Car01Icon,
  Edit01Icon,
  Delete01Icon,
  Calendar01Icon,
  Loading03Icon,
  Add01Icon,
  UserIcon,
  IdCardLanyardIcon
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
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { vehicleSchema, VehicleFormValues } from '../../../schemas';
import { EmployeeVehicle } from '../../../types';

interface VehicleTabProps {
  employeeId: string | number;
}

export function VehicleTab({ employeeId }: VehicleTabProps) {
  const { items, isLoading, mutate } = useEmployeeDetails(employeeId, 'vehicle');
  const { update, isLoading: isUpdating } = useUpdateEmployeeDetails(employeeId, 'vehicle');

  const [isOpen, setIsOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      vehicle_name: '',
      vehicle_year: '',
      plate_number: '',
      vehicle_owner: '',
    },
  });

  const handleAdd = () => {
    setEditingId(null);
    reset({
      vehicle_name: '',
      vehicle_year: '',
      plate_number: '',
      vehicle_owner: '',
    });
    setIsOpen(true);
  };

  const handleEdit = (item: EmployeeVehicle) => {
    setEditingId(item.id);
    reset({
      vehicle_name: item.vehicle_name,
      vehicle_year: item.vehicle_year,
      plate_number: item.plate_number,
      vehicle_owner: item.vehicle_owner,
    });
    setIsOpen(true);
  };

  const onSubmit = async (data: VehicleFormValues) => {
    try {
      const normalize = (item: any) => ({
        id: item.id,
        vehicle_name: item.vehicle_name,
        vehicle_year: item.vehicle_year,
        plate_number: item.plate_number,
        vehicle_owner: item.vehicle_owner,
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
        vehicle_name: item.vehicle_name,
        vehicle_year: item.vehicle_year,
        plate_number: item.plate_number,
        vehicle_owner: item.vehicle_owner,
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
      title="Kendaraan Pribadi"
      icon={Car01Icon}
      isLoading={isLoading}
      isEmpty={items.length === 0}
      extra={
        <Button size="sm" className="gap-2" onClick={handleAdd}>
          <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" />
          Tambah Kendaraan
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item: EmployeeVehicle) => (
          <div key={item.id} className="group relative border p-5 rounded-2xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <HugeiconsIcon icon={Car01Icon} className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-foreground leading-tight">{item.vehicle_name}</h4>
                  <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-1">
                    <HugeiconsIcon icon={Calendar01Icon} className="w-3 h-3" />
                    Tahun {item.vehicle_year}
                  </span>
                </div>
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

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <HugeiconsIcon icon={IdCardLanyardIcon} className="w-3 h-3" />
                  Nomor Plat
                </span>
                <span className="text-xs font-bold font-mono tracking-wider text-foreground bg-muted/50 px-2 py-1 rounded-lg border border-muted-foreground/10 w-fit">
                  {item.plate_number || '-'}
                </span>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5 justify-end">
                  <HugeiconsIcon icon={UserIcon} className="w-3 h-3" />
                  Pemilik
                </span>
                <span className="text-xs font-medium text-foreground">
                  {item.vehicle_owner || '-'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Kendaraan' : 'Tambah Kendaraan'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            <Controller
              name="vehicle_name"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel required>Nama Kendaraan (Merk/Tipe)</FieldLabel>
                  <Input {...field} placeholder="Contoh: Honda Vario 125" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="vehicle_year"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel required>Tahun Kendaraan</FieldLabel>
                    <Input {...field} placeholder="YYYY" maxLength={4} />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                name="plate_number"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel required>Nomor Plat</FieldLabel>
                    <Input {...field} placeholder="Contoh: B 1234 ABC" />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>

            <Controller
              name="vehicle_owner"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel required>Nama Pemilik (Sesuai STNK)</FieldLabel>
                  <Input {...field} placeholder="Masukkan nama pemilik" />
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
                  editingId ? 'Simpan Perubahan' : 'Tambah Kendaraan'
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
        title="Hapus Kendaraan"
        description="Apakah Anda yakin ingin menghapus kendaraan ini dari riwayat?"
        confirmText="Hapus"
        variant="destructive"
        isLoading={isUpdating}
      />
    </DetailTabContainer>
  );
}
