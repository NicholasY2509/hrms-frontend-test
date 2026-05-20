"use client";

import * as React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { WorkLocationPicker } from "@/modules/organization/work-location/components/work-location-picker";
import { attendanceLocationSchema, AttendanceLocationFormValues } from "../schemas/attendance-location.schema";
import { AttendanceLocationModel } from "../types";

interface AttendanceLocationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: AttendanceLocationModel | null;
  onSubmit: (data: AttendanceLocationFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function AttendanceLocationFormDialog({
  open,
  onOpenChange,
  data,
  onSubmit,
  isLoading,
}: AttendanceLocationFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<AttendanceLocationFormValues>({
    resolver: zodResolver(attendanceLocationSchema),
    defaultValues: {
      name: "",
      latitude: "",
      longitude: "",
      distance: 50,
      work_location_id: 0,
    },
  });

  React.useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        latitude: data.latitude,
        longitude: data.longitude,
        distance: Number(data.distance),
        work_location_id: Number(data.work_location_id),
      });
    } else {
      reset({
        name: "",
        latitude: "",
        longitude: "",
        distance: 50,
        work_location_id: 0,
      });
    }
  }, [data, reset, open]);

  const onFormSubmit: SubmitHandler<AttendanceLocationFormValues> = async (values) => {
    try {
      await onSubmit(values);
      onOpenChange(false);
      reset();
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{data ? "Edit Lokasi Absensi" : "Tambah Lokasi Absensi"}</DialogTitle>
            <DialogDescription>
              Tentukan koordinat dan radius untuk membatasi lokasi absensi karyawan.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel required>Nama Lokasi</FieldLabel>
                  <Input {...field} placeholder="Contoh: Gedung Deltamas" aria-invalid={fieldState.invalid} />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="work_location_id"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel required>Lokasi Kerja</FieldLabel>
                  <WorkLocationPicker
                    value={field.value}
                    onChange={(val: any) => field.onChange(String(val) === "all" ? 0 : Number(val))}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="latitude"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel required>Latitude</FieldLabel>
                    <Input {...field} placeholder="3.5921..." aria-invalid={fieldState.invalid} />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                name="longitude"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel required>Longitude</FieldLabel>
                    <Input {...field} placeholder="98.6765..." aria-invalid={fieldState.invalid} />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>

            <Controller
              name="distance"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel required>Radius (Meter)</FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    placeholder="50"
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>

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
              {isLoading ? "Menyimpan..." : "Simpan Lokasi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
