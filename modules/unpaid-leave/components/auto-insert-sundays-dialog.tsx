"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { DatePicker } from "@/components/ui/date-picker";
import { format, parseISO } from "date-fns";
import { useAutoInsertSundays } from "@/modules/unpaid-leave/hooks/use-holidays";

const schema = z.object({
  start_date: z.string().min(1, "Tanggal mulai wajib diisi"),
  end_date: z.string().min(1, "Tanggal selesai wajib diisi"),
});

type FormValues = z.infer<typeof schema>;

interface AutoInsertSundaysDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AutoInsertSundaysDialog({ open, onOpenChange }: AutoInsertSundaysDialogProps) {
  const { autoInsertSundays, isLoading } = useAutoInsertSundays();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      start_date: "",
      end_date: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await autoInsertSundays(values);
      onOpenChange(false);
      reset();
    } catch (error) {
      // Error is handled in hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Auto Insert Hari Minggu</DialogTitle>
            <DialogDescription>
              Hasilkan data hari libur otomatis untuk setiap hari Minggu dalam rentang tanggal yang dipilih.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Controller
              name="start_date"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Tanggal Mulai
                  </FieldLabel>
                  <DatePicker
                    value={field.value ? parseISO(field.value) : undefined}
                    onChange={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="end_date"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Tanggal Selesai
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
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              Hasilkan Otomatis
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
