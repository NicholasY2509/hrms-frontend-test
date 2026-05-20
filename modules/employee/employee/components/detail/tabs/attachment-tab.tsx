'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  AttachmentIcon,
  Download01Icon,
  EyeIcon,
  File01Icon,
  Pdf01Icon,
  Image01Icon,
  Delete01Icon,
  Add01Icon,
  Loading03Icon,
  CloudUploadIcon,
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { useEmployeeDetails, useUpdateEmployeeDetails } from '../../../hooks/use-employee-detail';
import { DetailTabContainer } from './detail-tab-container';
import { HugeiconsIcon } from '@hugeicons/react';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { FileUpload } from '@/components/ui/file-upload';
import { cn } from '@/lib/utils';

const attachmentUploadSchema = z.object({
  name: z.string().min(1, 'Nama dokumen wajib diisi'),
  file: z.any().refine((file) => file instanceof File, 'File wajib diunggah'),
});

type AttachmentUploadValues = z.infer<typeof attachmentUploadSchema>;

interface AttachmentTabProps {
  employeeId: string | number;
}

export function AttachmentTab({ employeeId }: AttachmentTabProps) {
  const { items, isLoading, mutate } = useEmployeeDetails(employeeId, 'attachment');
  const { update, isLoading: isUpdating } = useUpdateEmployeeDetails(employeeId, 'attachment');

  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<AttachmentUploadValues>({
    resolver: zodResolver(attachmentUploadSchema),
    defaultValues: {
      name: '',
      file: undefined,
    },
  });

  const getFileStyle = (filename: string) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return {
      icon: Pdf01Icon,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'hover:border-rose-200',
      label: 'PDF Document'
    };
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return {
      icon: Image01Icon,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'hover:border-blue-200',
      label: 'Image File'
    };
    return {
      icon: File01Icon,
      color: 'text-slate-600',
      bg: 'bg-slate-50',
      border: 'hover:border-slate-200',
      label: 'Attachment'
    };
  };

  const handleOpenUpload = () => {
    reset();
    setIsUploadOpen(true);
  };

  const onUploadSubmit = async (data: AttachmentUploadValues) => {
    try {
      const formData = new FormData();

      // Keep existing items
      items.forEach((item: any, index: number) => {
        formData.append(`attachment[${index}][id]`, item.id.toString());
      });

      // Add new file
      const newIndex = items.length;
      formData.append(`attachment[${newIndex}][name]`, data.name);
      formData.append(`attachment[${newIndex}][file]`, data.file);

      await update(formData);
      mutate();
      setIsUploadOpen(false);
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
      const formData = new FormData();
      const remainingItems = items.filter((item: any) => item.id !== deletingId);

      remainingItems.forEach((item: any, index: number) => {
        formData.append(`attachment[${index}][id]`, item.id.toString());
      });

      await update(formData);
      mutate();
      setIsConfirmOpen(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <DetailTabContainer
      title="Lampiran"
      icon={AttachmentIcon}
      isLoading={isLoading}
      isEmpty={items.length === 0}
      extra={
        <Button
          size="sm"
          className="gap-2"
          onClick={handleOpenUpload}
          disabled={isUpdating}
        >
          <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" />
          Tambah Lampiran
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item: any) => {
          const style = getFileStyle(item.path);
          return (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl border bg-card transition-all duration-300 group relative overflow-hidden",
                style.border
              )}
            >
              {/* Subtle background glow on hover */}
              <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300", style.bg)} />

              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105", style.bg, style.color)}>
                <HugeiconsIcon icon={style.icon} className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0 z-10">
                <h4 className="font-bold text-sm truncate pr-2 text-foreground group-hover:text-primary transition-colors" title={item.name}>
                  {item.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                    {item.path?.split('.').pop()?.toUpperCase() || 'FILE'}
                  </p>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <p className="text-[10px] text-muted-foreground font-medium">
                    {style.label}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 z-10">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-background hover:shadow-sm" asChild>
                  <a href={item.full_path} target="_blank" rel="noopener noreferrer">
                    <HugeiconsIcon icon={EyeIcon} className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-primary hover:bg-primary/5" asChild>
                  <a href={item.full_path} download={item.name}>
                    <HugeiconsIcon icon={Download01Icon} className="w-4 h-4" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  onClick={() => handleDeleteRequest(item.id)}
                >
                  <HugeiconsIcon icon={Delete01Icon} className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Unggah Lampiran Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onUploadSubmit)} className="space-y-5 py-4">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel required>Nama Dokumen</FieldLabel>
                  <Input {...field} placeholder="Contoh: Sertifikat Pelatihan" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="file"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel required>File Dokumen</FieldLabel>
                  <FileUpload
                    value={field.value}
                    onChange={(file) => {
                      field.onChange(file);
                      if (file && !watch('name')) {
                        const nameWithoutExt = file.name.split('.').slice(0, -1).join('.');
                        setValue('name', nameWithoutExt);
                      }
                    }}
                    accept="image/*,application/pdf"
                    maxSize={5}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsUploadOpen(false)} disabled={isUpdating}>
                Batal
              </Button>
              <Button type="submit" className="gap-2" disabled={isUpdating}>
                {isUpdating ? (
                  <HugeiconsIcon icon={Loading03Icon} className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <HugeiconsIcon icon={CloudUploadIcon} className="w-4 h-4" />
                    Unggah Dokumen
                  </>
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
        title="Hapus Lampiran"
        description="Apakah Anda yakin ingin menghapus lampiran ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        variant="destructive"
        isLoading={isUpdating}
      />
    </DetailTabContainer>
  );
}
