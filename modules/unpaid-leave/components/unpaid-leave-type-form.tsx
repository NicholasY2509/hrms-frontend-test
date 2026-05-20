"use client";

import * as React from "react";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  unpaidLeaveTypeSchema,
  UnpaidLeaveTypeFormValues,
} from "../schemas/unpaid-leave-type-schema";
import { UnpaidLeaveType } from "../types";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useUnpaidLeaveTypeMutation } from "../hooks/use-unpaid-leave-type";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface UnpaidLeaveTypeFormProps {
  initialData?: UnpaidLeaveType;
  onSuccess?: () => void;
}

export function UnpaidLeaveTypeForm({
  initialData,
  onSuccess,
}: UnpaidLeaveTypeFormProps) {
  const { createType, updateType, isCreating, isUpdating } =
    useUnpaidLeaveTypeMutation();

  const form = useForm<UnpaidLeaveTypeFormValues>({
    resolver: zodResolver(unpaidLeaveTypeSchema),
    defaultValues: {
      name: initialData?.name || "",
      background_color: initialData?.background_color || "#ffffff",
      border_color: initialData?.border_color || "#000000",
      text_color: initialData?.text_color || "#000000",
      limit: initialData?.limit || null,
      is_annual_leave_deduction: initialData?.is_annual_leave_deduction || false,
    },
  });

  const { control, handleSubmit, formState } = form;
  const isSubmitting = isCreating || isUpdating;

  const onSubmit = async (data: FieldValues) => {
    const values = data as UnpaidLeaveTypeFormValues;
    try {
      if (initialData) {
        await updateType({ id: initialData.id, values });
      } else {
        await createType(values);
      }
      onSuccess?.();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel required>Nama Tipe</FieldLabel>
              <Input
                {...field}
                placeholder="Contoh: Izin Khusus"
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <Controller
            name="background_color"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel required>Background</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    {...field}
                    type="color"
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input {...field} placeholder="#ffffff" />
                </div>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            name="border_color"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel required>Border</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    {...field}
                    type="color"
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input {...field} placeholder="#000000" />
                </div>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            name="text_color"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel required>Teks</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    {...field}
                    type="color"
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input {...field} placeholder="#000000" />
                </div>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>

        <Controller
          name="limit"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Batas Hari (Opsional)</FieldLabel>
              <Input
                {...field}
                type="number"
                value={field.value || ""}
                onChange={(e) =>
                  field.onChange(e.target.value ? Number(e.target.value) : null)
                }
                placeholder="Kosongkan jika tidak ada batas"
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="is_annual_leave_deduction"
          control={control}
          render={({ field }) => (
            <Field className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
              <div className="space-y-0.5">
                <FieldLabel className="text-base">
                  Potong Cuti Tahunan
                </FieldLabel>
                <p className="text-sm text-muted-foreground">
                  Aktifkan jika tipe izin ini akan memotong saldo cuti tahunan
                  karyawan.
                </p>
              </div>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting && (
            <HugeiconsIcon
              icon={Loading03Icon}
              className="mr-2 h-4 w-4 animate-spin"
            />
          )}
          {initialData ? "Simpan Perubahan" : "Tambah Tipe"}
        </Button>
      </div>
    </form>
  );
}
