"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { FileUpload } from "@/components/ui/file-upload";
import { MonthPicker } from "@/components/ui/month-picker";
import {
  importWorkingHourSchema,
  ImportWorkingHourFormValues,
  UploadType,
} from "../schemas/import-working-hour.schema";
import { useImportWorkingHour } from "../hooks/use-working-hours";

interface ImportWorkingHourDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportStarted?: (taskId: string | number) => void;
}

export function ImportWorkingHourDialog({
  open,
  onOpenChange,
  onImportStarted,
}: ImportWorkingHourDialogProps) {
  const { importWorkingHour, isLoading } = useImportWorkingHour({
    onSuccess: (data) => {
      onOpenChange(false);
      reset();
      if (data?.data?.task_id) {
        onImportStarted?.(data.data.task_id);
      }
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ImportWorkingHourFormValues>({
    resolver: zodResolver(importWorkingHourSchema),
    defaultValues: {
      upload_type: UploadType.NON_SECURITY,
      month: new Date(),
    },
  });

  const onSubmit = async (data: ImportWorkingHourFormValues) => {
    await importWorkingHour(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Import Jam Kerja Pegawai
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <Controller
            name="file"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel required>File Excel</FieldLabel>
                <FileUpload
                  value={field.value}
                  onChange={field.onChange}
                  accept=".xlsx, .xls, .csv"
                  description="Upload file format Excel (.xlsx, .xls) atau CSV"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            name="month"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel required>Bulan</FieldLabel>
                <MonthPicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Pilih bulan"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            name="upload_type"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel required>Tipe Unggahan</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Pilih tipe unggahan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="non_security">Non Security</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          {watch('upload_type') === 'non_security' && (
            <Controller
              name="day_type"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel required>Tipe Hari</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder="Pilih tipe hari" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Weekday">Weekday</SelectItem>
                      <SelectItem value="Weekend">Weekend</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Mengimpor..." : "Import"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
