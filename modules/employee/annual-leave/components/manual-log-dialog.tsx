"use client";

import * as React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmployeePicker } from "@/modules/employee/employee/components/employee-picker";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  manualLogSchema,
  ManualLogFormValues,
} from "../schemas/manual-log-schema";
import { useCreateManualLog } from "../hooks/use-annual-leave";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon, PlusSignIcon, Delete02Icon } from "@hugeicons/core-free-icons";
import { format } from "date-fns";

interface ManualLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManualLogDialog({ open, onOpenChange }: ManualLogDialogProps) {
  const { createManualLog, isLoading } = useCreateManualLog({
    onSuccess: () => {
      onOpenChange(false);
      reset();
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ManualLogFormValues>({
    resolver: zodResolver(manualLogSchema) as any,
    defaultValues: {
      employee_id: undefined,
      total: 0,
      annual_leave_year: new Date().getFullYear(),
      annual_leave_at: format(new Date(), "yyyy-MM-dd"),
      status: "Adjustment",
      keterangan: "",
      deduction_details_array: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "deduction_details_array",
  });

  const onSubmit = async (data: ManualLogFormValues) => {
    const deduction_details: Record<string, number> = {};
    if (data.deduction_details_array && data.deduction_details_array.length > 0) {
      data.deduction_details_array.forEach((item) => {
        deduction_details[item.year] = item.deduction;
      });
    }

    const payload = {
      employee_id: data.employee_id,
      total: data.total,
      annual_leave_year: data.annual_leave_year,
      annual_leave_at: data.annual_leave_at,
      status: data.status,
      keterangan: data.keterangan,
      ...(Object.keys(deduction_details).length > 0 ? { deduction_details } : {}),
    };

    await createManualLog(payload);
  };

  const isProcessing = isLoading || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Log Cuti Manual</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="employee_id"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel required>Karyawan</FieldLabel>
                  <EmployeePicker
                    value={field.value ?? null}
                    onChange={field.onChange}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="total"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel required>Total Hari</FieldLabel>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                name="annual_leave_year"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Tahun Cuti</FieldLabel>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="annual_leave_at"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel required>Tanggal</FieldLabel>
                    <DatePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) =>
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                      }
                      className="w-full"
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                name="status"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel required>Status</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Adjustment">Adjustment</SelectItem>
                        <SelectItem value="Potong">Potong</SelectItem>
                        <SelectItem value="Tambah">Tambah</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>

            <Controller
              name="keterangan"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel required>Keterangan</FieldLabel>
                  <Textarea
                    {...field}
                    rows={3}
                    aria-invalid={fieldState.invalid}
                    placeholder="Alasan penyesuaian manual..."
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <FieldLabel className="mb-0">Detail Potongan (Opsional)</FieldLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ year: new Date().getFullYear().toString(), deduction: 0 })}
                >
                  <HugeiconsIcon icon={PlusSignIcon} className="mr-1 h-3 w-3" />
                  Tambah Tahun
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <Controller
                    name={`deduction_details_array.${index}.year`}
                    control={control}
                    render={({ field: inputField, fieldState }) => (
                      <Field className="flex-1" data-invalid={fieldState.invalid}>
                        <Input
                          {...inputField}
                          placeholder="Tahun (e.g. 2023)"
                          aria-invalid={fieldState.invalid}
                        />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />

                  <Controller
                    name={`deduction_details_array.${index}.deduction`}
                    control={control}
                    render={({ field: inputField, fieldState }) => (
                      <Field className="flex-1" data-invalid={fieldState.invalid}>
                        <Input
                          type="number"
                          {...inputField}
                          onChange={(e) => inputField.onChange(Number(e.target.value))}
                          placeholder="Jumlah Potongan"
                          aria-invalid={fieldState.invalid}
                        />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => remove(index)}
                  >
                    <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </FieldGroup>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing && (
                <HugeiconsIcon
                  icon={Loading03Icon}
                  className="mr-2 h-4 w-4 animate-spin"
                />
              )}
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
