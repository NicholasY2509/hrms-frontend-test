'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  LicenseIcon,
  Edit01Icon,
  Delete01Icon,
  Calendar01Icon,
  DiplomaIcon,
  Loading03Icon,
  Add01Icon,
  SchoolIcon
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
import { educationSchema, EducationFormValues } from '../../../schemas';
import { EmployeeEducation } from '../../../types';

interface EducationTabProps {
  employeeId: string | number;
}

export function EducationTab({ employeeId }: EducationTabProps) {
  const { items, isLoading, mutate } = useEmployeeDetails(employeeId, 'education');
  const { update, isLoading: isUpdating } = useUpdateEmployeeDetails(employeeId, 'education');

  const [isOpen, setIsOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      study: '',
      start_year: '',
      end_year: '',
      school_name: '',
    },
  });

  const handleAdd = () => {
    setEditingId(null);
    reset({
      study: '',
      start_year: '',
      end_year: '',
      school_name: '',
    });
    setIsOpen(true);
  };

  const handleEdit = (item: EmployeeEducation) => {
    setEditingId(item.id);
    reset({
      study: item.study,
      start_year: item.start_year,
      end_year: item.end_year,
      school_name: item.school_name,
    });
    setIsOpen(true);
  };

  const onSubmit = async (data: EducationFormValues) => {
    try {
      const normalize = (item: any) => ({
        id: item.id,
        study: item.study,
        start_year: item.start_year,
        end_year: item.end_year,
        school_name: item.school_name,
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
        study: item.study,
        start_year: item.start_year,
        end_year: item.end_year,
        school_name: item.school_name,
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
      title="Riwayat Pendidikan"
      icon={LicenseIcon}
      isLoading={isLoading}
      isEmpty={items.length === 0}
      extra={
        <Button size="sm" className="gap-2" onClick={handleAdd}>
          <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" />
          Tambah Pendidikan
        </Button>
      }
    >
      <div className="relative space-y-3 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-muted-foreground/10">
        {[...items].sort((a, b) => Number(b.end_year) - Number(a.end_year)).map((item: EmployeeEducation) => (
          <div key={item.id} className="relative pl-12">
            <div className="absolute left-[13px] top-1/2 -translate-y-1/2 w-[14px] h-[14px] rounded-full bg-background border-2 border-primary flex items-center justify-center z-10">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            </div>

            {/* Content Card */}
            <div className="bg-card border p-5 rounded-2xl">
              <div className="flex justify-between items-start mb-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-primary/5 rounded-lg border border-primary/10">
                  <HugeiconsIcon icon={Calendar01Icon} className="w-3 h-3 text-primary" />
                  <span className="text-[11px] font-bold font-mono tracking-wider text-primary">
                    {item.start_year} — {item.end_year}
                  </span>
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

              <div>
                <h4 className="font-bold text-lg text-foreground leading-tight">
                  {item.school_name}
                </h4>
                {item.study && (
                  <div className="flex items-center gap-2 mt-1.5 text-muted-foreground">
                    <HugeiconsIcon icon={SchoolIcon} className="w-3.5 h-3.5" />
                    <span className="text-sm font-medium">{item.study}</span>
                  </div>
                )}

              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Riwayat Pendidikan' : 'Tambah Riwayat Pendidikan'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            <Controller
              name="school_name"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel required>Nama Institusi / Sekolah</FieldLabel>
                  <Input {...field} placeholder="Masukkan nama sekolah" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="study"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel required>Program Studi / Jurusan</FieldLabel>
                  <Input {...field} placeholder="Masukkan program studi" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="start_year"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel required>Tahun Mulai</FieldLabel>
                    <Input {...field} placeholder="YYYY" maxLength={4} />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                name="end_year"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel required>Tahun Selesai</FieldLabel>
                    <Input {...field} placeholder="YYYY" maxLength={4} />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={isUpdating}>
                Batal
              </Button>
              <Button type="submit" className="gap-2" disabled={isUpdating}>
                {isUpdating ? (
                  <HugeiconsIcon icon={Loading03Icon} className="w-4 h-4 animate-spin" />
                ) : (
                  editingId ? 'Simpan Perubahan' : 'Tambah Pendidikan'
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
        title="Hapus Riwayat Pendidikan"
        description="Apakah Anda yakin ingin menghapus riwayat pendidikan ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        variant="destructive"
        isLoading={isUpdating}
      />
    </DetailTabContainer>
  );
}
