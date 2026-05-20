'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Add01Icon,
  Edit01Icon,
  Delete01Icon,
  CreditCardIcon,
  InformationCircleIcon,
  Shield
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { useEmployeeDetails, useUpdateEmployeeDetails } from '../../../hooks/use-employee-detail';
import { DetailTabContainer } from './detail-tab-container';
import { HugeiconsIcon } from '@hugeicons/react';
import { EmployeeInsurance } from '../../../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { insuranceSchema, InsuranceFormValues } from '../../../schemas';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

interface InsuranceTabProps {
  employeeId: string | number;
}

export function InsuranceTab({ employeeId }: InsuranceTabProps) {
  const { item, isLoading, mutate } = useEmployeeDetails(employeeId, 'insurance');
  const { update, isLoading: isUpdating } = useUpdateEmployeeDetails(employeeId, 'insurance');

  const insurances = item?.insurances || [];

  const [isOpen, setIsOpen] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<EmployeeInsurance | null>(null);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  const [isTogglingKesehatan, setIsTogglingKesehatan] = React.useState(false);
  const [isTogglingKetenagakerjaan, setIsTogglingKetenagakerjaan] = React.useState(false);

  const handleToggleKesehatan = async (checked: boolean) => {
    setIsTogglingKesehatan(true);
    try {
      await update({ is_bpjs_kesehatan: checked });
      await mutate();
    } catch (error) {
      // Error handled by hook toast
    } finally {
      setIsTogglingKesehatan(false);
    }
  };

  const handleToggleKetenagakerjaan = async (checked: boolean) => {
    setIsTogglingKetenagakerjaan(true);
    try {
      await update({ is_bpjs_ketenagakerjaan: checked });
      await mutate();
    } catch (error) {
      // Error handled by hook toast
    } finally {
      setIsTogglingKetenagakerjaan(false);
    }
  };

  const { control, handleSubmit, reset, setValue } = useForm<InsuranceFormValues>({
    resolver: zodResolver(insuranceSchema),
    defaultValues: {
      insurance_name: '',
      card_number: '',
    },
  });

  const handleAdd = () => {
    setEditingItem(null);
    reset({
      insurance_name: '',
      card_number: '',
    });
    setIsOpen(true);
  };

  const handleEdit = (item: EmployeeInsurance) => {
    setEditingItem(item);
    reset({
      insurance_name: item.insurance_name,
      card_number: item.card_number,
    });
    setIsOpen(true);
  };

  const handleDeleteRequest = (id: number) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const onSubmit = async (data: InsuranceFormValues) => {
    try {
      let newItems;
      if (editingItem) {
        newItems = insurances.map((item: any) =>
          item.id === editingItem.id ? { ...data, id: item.id } : {
            id: item.id,
            insurance_name: item.insurance_name,
            card_number: item.card_number
          }
        );
      } else {
        newItems = [
          ...insurances.map((item: any) => ({
            id: item.id,
            insurance_name: item.insurance_name,
            card_number: item.card_number
          })),
          data
        ];
      }

      await update(newItems);
      mutate();
      setIsOpen(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  const onConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      const newItems = insurances
        .filter((item: any) => item.id !== deletingId)
        .map((item: any) => ({
          id: item.id,
          insurance_name: item.insurance_name,
          card_number: item.card_number
        }));

      await update(newItems);
      mutate();
      setIsConfirmOpen(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <DetailTabContainer
      title="Jaminan Sosial"
      icon={Shield}
      isLoading={isLoading}
      isEmpty={false}
      extra={
        <Button size="sm" className="gap-2" onClick={handleAdd}>
          <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" />
          Tambah Jaminan
        </Button>
      }
    >
      {/* BPJS Toggles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* BPJS Kesehatan Toggle */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/40 transition-colors duration-200">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-foreground">BPJS Kesehatan</h4>
            <p className="text-xs text-muted-foreground">
              Aktifkan jika karyawan terdaftar dalam program BPJS Kesehatan perusahaan.
            </p>
          </div>
          <div className="flex items-center">
            <Switch
              checked={item?.is_bpjs_kesehatan ?? false}
              onCheckedChange={handleToggleKesehatan}
              disabled={isTogglingKesehatan}
              className="scale-110 sm:scale-125 origin-right transition-transform"
            />
          </div>
        </div>

        {/* BPJS Ketenagakerjaan Toggle */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/40 transition-colors duration-200">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-foreground">BPJS Ketenagakerjaan</h4>
            <p className="text-xs text-muted-foreground">
              Aktifkan jika karyawan terdaftar dalam program BPJS Ketenagakerjaan perusahaan.
            </p>
          </div>
          <div className="flex items-center">
            <Switch
              checked={item?.is_bpjs_ketenagakerjaan ?? false}
              onCheckedChange={handleToggleKetenagakerjaan}
              disabled={isTogglingKetenagakerjaan}
              className="scale-110 sm:scale-125 origin-right transition-transform"
            />
          </div>
        </div>
      </div>

      {/* Title for custom insurances */}
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground/80 mt-6 mb-4">
        <HugeiconsIcon icon={Shield} className="w-4 h-4 text-primary" />
        Daftar Asuransi & Jaminan Tambahan
      </div>

      {insurances.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground bg-muted/10">
          <span className="text-xs">Tidak ada data asuransi tambahan. Silakan tambahkan jika ada.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insurances.map((item: EmployeeInsurance) => (
            <div
              key={item.id}
              className={cn(
                "group relative flex flex-col p-5 rounded-2xl border bg-card hover:border-primary/30 transition-all overflow-hidden",
                "hover:shadow-md transition-all duration-300"
              )}
            >
              {/* Design Element: Subtle blue gradient accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />

              <div className="flex items-start justify-between mb-4 z-10">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                  <HugeiconsIcon icon={Shield} className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5"
                    onClick={() => handleEdit(item)}
                  >
                    <HugeiconsIcon icon={Edit01Icon} className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-50"
                    onClick={() => handleDeleteRequest(item.id)}
                  >
                    <HugeiconsIcon icon={Delete01Icon} className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="z-10">
                <h4 className="font-bold text-sm text-foreground mb-1">
                  {item.insurance_name}
                </h4>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <HugeiconsIcon icon={CreditCardIcon} className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-mono tracking-wider font-medium">
                    {item.card_number}
                  </span>
                </div>
              </div>

              {/* Premium Touch: A small footer label */}
              <div className="mt-4 pt-4 border-t border-dashed flex items-center gap-2 z-10">
                <HugeiconsIcon icon={InformationCircleIcon} className="w-3 h-3 text-muted-foreground/50" />
                <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                  Active Policy
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Jaminan' : 'Tambah Jaminan'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <Controller
              name="insurance_name"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel required>Nama Jaminan</FieldLabel>
                  <Input {...field} placeholder="Contoh: BPJS Ketenagakerjaan, BPJS Kesehatan, dll" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="card_number"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel required>Nomor Kartu / Polis</FieldLabel>
                  <Input {...field} placeholder="Masukkan nomor kartu" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={onConfirmDelete}
        title="Hapus Asuransi"
        description="Apakah Anda yakin ingin menghapus data asuransi ini?"
        confirmText="Hapus"
        variant="destructive"
        isLoading={isUpdating}
      />
    </DetailTabContainer>
  );
}
