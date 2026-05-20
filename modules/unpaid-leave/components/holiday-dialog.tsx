"use client";

import { useEffect } from "react";
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
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { holidaySchema, HolidayFormValues } from "@/modules/unpaid-leave/schemas/holiday-schema";
import { Holiday } from "@/modules/unpaid-leave/types";
import { useHolidayMutation } from "@/modules/unpaid-leave/hooks/use-holidays";
import { DatePicker } from "@/components/ui/date-picker";
import { format, parseISO } from "date-fns";

interface HolidayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedHoliday: Holiday | null;
}

export function HolidayDialog({ open, onOpenChange, selectedHoliday }: HolidayDialogProps) {
  const { createHoliday, updateHoliday, isCreating, isUpdating } = useHolidayMutation();
  const isEdit = !!selectedHoliday;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<HolidayFormValues>({
    resolver: zodResolver(holidaySchema),
    defaultValues: {
      name: "",
      date: "",
    },
  });

  useEffect(() => {
    if (selectedHoliday) {
      reset({
        name: selectedHoliday.name,
        date: selectedHoliday.date,
      });
    } else {
      reset({
        name: "",
        date: "",
      });
    }
  }, [selectedHoliday, reset, open]);

  const onSubmit = async (values: HolidayFormValues) => {
    try {
      if (isEdit && selectedHoliday) {
        await updateHoliday({ id: selectedHoliday.id, values });
      } else {
        await createHoliday(values);
      }
      onOpenChange(false);
    } catch (error) {
      // Error is handled in hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Hari Libur" : "Tambah Hari Libur"}</DialogTitle>
            <DialogDescription>
              Silakan isi detail hari libur di bawah ini.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Nama Hari Libur
                  </FieldLabel>
                  <Input {...field} id={field.name} placeholder="Contoh: Tahun Baru" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="date"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Tanggal
                  </FieldLabel>
                  <DatePicker
                    value={field.value ? parseISO(field.value) : undefined}
                    onChange={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
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
              disabled={isCreating || isUpdating}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isEdit ? "Simpan Perubahan" : "Tambah"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
