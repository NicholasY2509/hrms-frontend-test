'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Briefcase01Icon,
  Edit01Icon,
  Delete01Icon,
  Calendar01Icon,
  Loading03Icon,
  Add01Icon,
  Location01Icon,
  CallIcon,
  InformationCircleIcon
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
import { experienceSchema, ExperienceFormValues } from '../../../schemas';
import { EmployeeExperience } from '../../../types';

interface ExperienceTabProps {
  employeeId: string | number;
}

export function ExperienceTab({ employeeId }: ExperienceTabProps) {
  const { items, isLoading, mutate } = useEmployeeDetails(employeeId, 'experience');
  const { update, isLoading: isUpdating } = useUpdateEmployeeDetails(employeeId, 'experience');

  const [isOpen, setIsOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      office_name: '',
      office_address: '',
      office_phone: '',
      start_year: '',
      end_year: '',
      work_position: '',
      reason: '',
    },
  });

  const handleAdd = () => {
    setEditingId(null);
    reset({
      office_name: '',
      office_address: '',
      office_phone: '',
      start_year: '',
      end_year: '',
      work_position: '',
      reason: '',
    });
    setIsOpen(true);
  };

  const handleEdit = (item: EmployeeExperience) => {
    setEditingId(item.id);
    reset({
      office_name: item.office_name,
      office_address: item.office_address,
      office_phone: item.office_phone,
      start_year: item.start_year,
      end_year: item.end_year,
      work_position: item.work_position,
      reason: item.reason,
    });
    setIsOpen(true);
  };

  const onSubmit = async (data: ExperienceFormValues) => {
    try {
      const normalize = (item: any) => ({
        id: item.id,
        office_name: item.office_name,
        office_address: item.office_address,
        office_phone: item.office_phone,
        start_year: item.start_year,
        end_year: item.end_year,
        work_position: item.work_position,
        reason: item.reason,
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
        office_name: item.office_name,
        office_address: item.office_address,
        office_phone: item.office_phone,
        start_year: item.start_year,
        end_year: item.end_year,
        work_position: item.work_position,
        reason: item.reason,
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
      title="Pengalaman Kerja"
      icon={Briefcase01Icon}
      isLoading={isLoading}
      isEmpty={items.length === 0}
      extra={
        <Button size="sm" className="gap-2" onClick={handleAdd}>
          <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" />
          Tambah Pengalaman
        </Button>
      }
    >
      <div className="relative space-y-3 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-muted-foreground/10">
        {[...items].sort((a, b) => Number(b.end_year) - Number(a.end_year)).map((item: EmployeeExperience) => (
          <div key={item.id} className="relative pl-12">
            {/* Timeline Dot Marker */}
            <div className="absolute left-[13px] top-1/2 -translate-y-1/2 w-[14px] h-[14px] rounded-full bg-background border-2 border-primary flex items-center justify-center z-10">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            </div>

            {/* Content Card */}
            <div className="bg-card border p-5 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-lg text-foreground leading-tight">
                    {item.work_position}
                  </h4>
                  <div className="flex items-center gap-2 mt-1.5 text-primary font-semibold">
                    <HugeiconsIcon icon={Briefcase01Icon} className="w-4 h-4" />
                    <span className="text-sm">{item.office_name}</span>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <HugeiconsIcon icon={Location01Icon} className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span className="text-xs leading-relaxed">{item.office_address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <HugeiconsIcon icon={CallIcon} className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-xs font-mono">{item.office_phone}</span>
                    </div>
                  </div>
                </div>

                <div className="md:border-l md:pl-6 pt-4 md:pt-0">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <HugeiconsIcon icon={InformationCircleIcon} className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Alasan Berhenti</span>
                  </div>
                  <p className="text-xs leading-relaxed text-foreground/80 italic">
                    "{item.reason}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Pengalaman Kerja' : 'Tambah Pengalaman Kerja'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="work_position"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel required>Posisi / Jabatan</FieldLabel>
                    <Input {...field} placeholder="Masukkan posisi" />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                name="office_name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel required>Nama Perusahaan</FieldLabel>
                    <Input {...field} placeholder="Masukkan nama kantor" />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
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
              <Controller
                name="office_phone"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel required>Telepon Kantor</FieldLabel>
                    <Input {...field} placeholder="Nomor telepon" />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>

            <Controller
              name="office_address"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel required>Alamat Kantor</FieldLabel>
                  <Textarea {...field} placeholder="Masukkan alamat lengkap" className="min-h-[80px]" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="reason"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel required>Alasan Berhenti</FieldLabel>
                  <Textarea {...field} placeholder="Ceritakan singkat alasan berhenti" className="min-h-[80px]" />
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
                  editingId ? 'Simpan Perubahan' : 'Tambah Pengalaman'
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
        title="Hapus Pengalaman Kerja"
        description="Apakah Anda yakin ingin menghapus pengalaman kerja ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        variant="destructive"
        isLoading={isUpdating}
      />
    </DetailTabContainer>
  );
}
