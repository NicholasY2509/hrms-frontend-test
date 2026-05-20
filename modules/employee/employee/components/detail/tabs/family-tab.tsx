'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import {
  UserGroupIcon,
  Edit01Icon,
  Delete01Icon,
  Calendar01Icon,
  IdCardLanyardIcon,
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
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { familySchema, FamilyFormValues } from '../../../schemas';
import { EmployeeFamily } from '../../../types';
import { toast } from 'sonner';

interface FamilyTabProps {
  employeeId: string | number;
}

export function FamilyTab({ employeeId }: FamilyTabProps) {
  const { items, isLoading, mutate } = useEmployeeDetails(employeeId, 'family');
  const { update, isLoading: isUpdating } = useUpdateEmployeeDetails(employeeId, 'family');

  const [isOpen, setIsOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FamilyFormValues>({
    resolver: zodResolver(familySchema),
    defaultValues: {
      full_name: '',
      family_relationship_id: undefined,
      gender_id: undefined,
      place_birth: '',
      date_birth: '',
      id_card_number: '',
    },
  });

  const handleAdd = () => {
    setEditingId(null);
    reset({
      full_name: '',
      family_relationship_id: undefined,
      gender_id: undefined,
      place_birth: '',
      date_birth: '',
      id_card_number: '',
    });
    setIsOpen(true);
  };

  const handleEdit = (item: EmployeeFamily) => {
    setEditingId(item.id);
    reset({
      full_name: item.full_name,
      family_relationship_id: typeof item.family_relationship === 'object'
        ? item.family_relationship.id
        : item.family_relationship as number,
      gender_id: typeof item.gender === 'object'
        ? item.gender.id
        : item.gender as number,
      place_birth: item.place_birth || '',
      date_birth: item.date_birth,
      id_card_number: item.id_card_number,
    });
    setIsOpen(true);
  };

  const onSubmit = async (data: FamilyFormValues) => {
    try {
      const normalize = (item: any) => ({
        id: item.id,
        full_name: item.full_name,
        family_relationship_id: typeof item.family_relationship === 'object'
          ? item.family_relationship.id
          : item.family_relationship_id,
        gender_id: typeof item.gender === 'object'
          ? item.gender.id
          : item.gender_id,
        place_birth: item.place_birth,
        date_birth: item.date_birth,
        id_card_number: item.id_card_number,
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
        family_relationship_id: typeof item.family_relationship === 'object'
          ? item.family_relationship.id
          : item.family_relationship_id,
        gender_id: typeof item.gender === 'object'
          ? item.gender.id
          : item.gender_id,
        place_birth: item.place_birth,
        date_birth: item.date_birth,
        id_card_number: item.id_card_number,
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
      title="Anggota Keluarga"
      icon={UserGroupIcon}
      isLoading={isLoading}
      isEmpty={items.length === 0}
      extra={
        <Button size="sm" className="gap-2" onClick={handleAdd}>
          <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" />
          Tambah Anggota
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item: EmployeeFamily) => (
          <div key={item.id} className="group relative border p-5 rounded-2xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-base text-foreground leading-tight">{item.full_name}</h4>
                <span className="inline-flex mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                  {typeof item.family_relationship === 'object' ? item.family_relationship.name : '-'}
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

            <div className="grid grid-cols-2 gap-y-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <HugeiconsIcon icon={Calendar01Icon} className="w-3 h-3" />
                  Tanggal Lahir
                </span>
                <span className="text-xs font-medium">
                  {item.date_birth ? format(new Date(item.date_birth), 'dd MMMM yyyy', { locale: idLocale }) : '-'}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 text-right">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Jenis Kelamin</span>
                <span className="text-xs font-medium">
                  {typeof item.gender === 'object' ? item.gender.name : '-'}
                </span>
              </div>
              <div className="col-span-2 flex flex-col gap-0.5 pt-2 border-t border-dashed">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <HugeiconsIcon icon={IdCardLanyardIcon} className="w-3 h-3" />
                  Nomor KTP
                </span>
                <span className="text-xs font-mono font-medium tracking-wider">
                  {item.id_card_number || '-'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Anggota Keluarga' : 'Tambah Anggota Keluarga'}</DialogTitle>
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
                    <FieldLabel required>Hubungan Keluarga</FieldLabel>
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

                      </SelectContent>
                    </Select>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                name="gender_id"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel required>Jenis Kelamin</FieldLabel>
                    <Select value={field.value?.toString()} onValueChange={(val) => field.onChange(Number(val))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Laki-Laki</SelectItem>
                        <SelectItem value="2">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="place_birth"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Tempat Lahir</FieldLabel>
                    <Input {...field} value={field.value || ''} placeholder="Kota" />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                name="date_birth"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel required>Tanggal Lahir</FieldLabel>
                    <DatePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>

            <Controller
              name="id_card_number"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel required>Nomor KTP</FieldLabel>
                  <Input {...field} placeholder="Masukkan nomor KTP" />
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
                  editingId ? 'Simpan Perubahan' : 'Tambah Anggota'
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
        title="Hapus Anggota Keluarga"
        description="Apakah Anda yakin ingin menghapus anggota keluarga ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        variant="destructive"
        isLoading={isUpdating}
      />
    </DetailTabContainer>
  );
}
