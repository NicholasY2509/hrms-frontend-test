"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
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
import { workingHourSchema, WorkingHourFormValues } from "../schemas/working-hour.schema";
import { MasterWorkingHourModel } from "../types";

interface WorkingHourFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: MasterWorkingHourModel | null;
  onSubmit: (data: WorkingHourFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function WorkingHourFormDialog({
  open,
  onOpenChange,
  data,
  onSubmit,
  isLoading,
}: WorkingHourFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WorkingHourFormValues>({
    resolver: zodResolver(workingHourSchema),
    defaultValues: {
      name: "",
      clock_in: "08:00",
      clock_out: "17:00",
    },
  });

  React.useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        clock_in: data.clock_in.substring(0, 5),
        clock_out: data.clock_out.substring(0, 5),
      });
    } else {
      reset({
        name: "",
        clock_in: "08:00",
        clock_out: "17:00",
      });
    }
  }, [data, reset, open]);

  const onFormSubmit = async (values: WorkingHourFormValues) => {
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
            <DialogTitle>{data ? "Edit Jam Kerja" : "Tambah Jam Kerja"}</DialogTitle>
            <DialogDescription>
              Lengkapi formulir di bawah ini untuk {data ? "memperbarui" : "menambahkan"} data jam kerja.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel required>Nama Jam Kerja</FieldLabel>
                  <Input {...field} placeholder="Contoh: SHIFT PAGI" />
                  <FieldError errors={[errors.name?.message]} />
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="clock_in"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel required>Jam Masuk</FieldLabel>
                    <Input {...field} type="time" />
                    <FieldError errors={[errors.clock_in?.message]} />
                  </Field>
                )}
              />

              <Controller
                name="clock_out"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel required>Jam Pulang</FieldLabel>
                    <Input {...field} type="time" />
                    <FieldError errors={[errors.clock_out?.message]} />
                  </Field>
                )}
              />
            </div>
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
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
