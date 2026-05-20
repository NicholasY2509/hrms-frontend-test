'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ContactIcon,
  Edit01Icon,
  Delete01Icon,
  CallIcon,
  Location01Icon,
  Loading03Icon,
  Add01Icon
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
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { emergencyContactSchema, EmergencyContactFormValues } from '../../../schemas';
import { EmployeeEmergencyContact } from '../../../types';

interface EmergencyContactTabProps {
  employeeId: string | number;
}

export function EmergencyContactTab({ employeeId }: EmergencyContactTabProps) {
  const { items, isLoading, mutate } = useEmployeeDetails(employeeId, 'emergency');
  const { update, isLoading: isUpdating } = useUpdateEmployeeDetails(employeeId, 'emergency');

  const [isOpen, setIsOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<EmergencyContactFormValues>({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues: {
      full_name: '',
      family_relationship_id: undefined,
      current_address: '',
      phone_number: '',
    },
  });

  const handleAdd = () => {
    setEditingId(null);
    reset({
      full_name: '',
      family_relationship_id: undefined,
      current_address: '',
      phone_number: '',
    });
    setIsOpen(true);
  };

  const handleEdit = (item: EmployeeEmergencyContact) => {
    setEditingId(item.id);
    reset({
      full_name: item.full_name,
      family_relationship_id: typeof item.family_relationship === 'object'
        ? item.family_relationship.id || undefined
        : item.family_relationship,
      current_address: item.current_address || '',
      phone_number: item.phone_number || '',
    });
    setIsOpen(true);
  };

  const onSubmit = async (data: EmergencyContactFormValues) => {
    try {
      const normalize = (item: any) => ({
        id: item.id,
        full_name: item.full_name,
        current_address: item.current_address,
        phone_number: item.phone_number,
        family_relationship_id: typeof item.family_relationship === 'object'
          ? item.family_relationship.id
          : item.family_relationship_id,
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
        full_name: item.full_name,
        current_address: item.current_address,
        phone_number: item.phone_number,
        family_relationship_id: typeof item.family_relationship === 'object'
          ? item.family_relationship.id
          : item.family_relationship_id,
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
      title="Kontak Darurat"
      icon={ContactIcon}
      isLoading={isLoading}
      isEmpty={items.length === 0}
      extra={
        <Button size="sm" className="gap-2" onClick={handleAdd}>
          <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" />
          Tambah Kontak
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item: EmployeeEmergencyContact) => (
          <div key={item.id} className="group relative border p-5 rounded-2xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-base text-foreground leading-tight">{item.full_name}</h4>
                <span className="inline-flex mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                  {typeof item.family_relationship === 'object' ? item.family_relationship.name || 'Lainnya' : '-'}
                </span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => handleEdit(item)}>
                  <HugeiconsIcon icon={Edit01Icon} className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50" onClick={() => handleDeleteRequest(item.id)}>
                  <HugeiconsIcon icon={Delete01Icon} className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <HugeiconsIcon icon={CallIcon} className="w-3 h-3 text-primary" />
                  Nomor Telepon
                </span>
                <div className="inline-flex items-center px-3 py-1.5 bg-primary/5 border border-primary/10 rounded-xl w-fit">
                  <span className="text-sm font-bold font-mono tracking-wider text-primary">
                    {item.phone_number || '-'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 pt-2 border-t border-dashed">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <HugeiconsIcon icon={Location01Icon} className="w-3 h-3" />
                  Alamat Sekarang
                </span>
                <span className="text-xs font-medium leading-relaxed">
                  {item.current_address || '-'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Kontak Darurat' : 'Tambah Kontak Darurat'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            <Controller
              name="full_name"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel required>Nama Lengkap</FieldLabel>
                  <Input {...field} placeholder="Masukkan nama lengkap" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="family_relationship_id"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel required>Hubungan</FieldLabel>
                    <Select value={field.value?.toString()} onValueChange={(val) => field.onChange(Number(val))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Hubungan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='1'>Ayah</SelectItem>
                        <SelectItem value='2'>Anak Kandung</SelectItem>
                        <SelectItem value='3'>Anak Tiri/Angkat</SelectItem>
                        <SelectItem value='4'>Istri</SelectItem>
                        <SelectItem value='5'>Suami</SelectItem>
                        <SelectItem value='6'>Ibu</SelectItem>
                        <SelectItem value='7'>Saudara Laki-Laki</SelectItem>
                        <SelectItem value='8'>Saudara Perempuan</SelectItem>
                        <SelectItem value='9'>Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                name="phone_number"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel required>Nomor Telepon</FieldLabel>
                    <Input {...field} placeholder="08..." />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>

            <Controller
              name="current_address"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel required>Alamat Lengkap</FieldLabel>
                  <Textarea {...field} placeholder="Masukkan alamat lengkap" className="min-h-[100px]" />
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
                  editingId ? 'Simpan Perubahan' : 'Tambah Kontak'
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
        title="Hapus Kontak Darurat"
        description="Apakah Anda yakin ingin menghapus kontak darurat ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        variant="destructive"
        isLoading={isUpdating}
      />
    </DetailTabContainer>
  );
}
