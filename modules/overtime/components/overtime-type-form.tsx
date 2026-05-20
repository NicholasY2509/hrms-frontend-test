"use client";

import * as React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { zodResolver } from "@hookform/resolvers/zod";
import { overtimeTypeSchema, OvertimeTypeFormValues } from "../schemas/type";
import { OvertimeType } from "../types";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useOvertimeTypeMutation } from "../hooks/use-overtime-type";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface OvertimeTypeFormProps {
  initialData?: OvertimeType;
  onSuccess?: () => void;
}

export function OvertimeTypeForm({
  initialData,
  onSuccess,
}: OvertimeTypeFormProps) {
  const { createType, updateType, isCreating, isUpdating } =
    useOvertimeTypeMutation();

  const form = useForm<OvertimeTypeFormValues>({
    resolver: zodResolver(overtimeTypeSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || "",
    },
  });

  const { control, handleSubmit, formState } = form;
  const isSubmitting = isCreating || isUpdating;

  const onSubmit: SubmitHandler<OvertimeTypeFormValues> = async (values) => {
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
              <FieldLabel required>Kode/Nama Tipe</FieldLabel>
              <Input
                {...field}
                placeholder="Contoh: A, B, atau Lembur Biasa"
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel required>Deskripsi</FieldLabel>
              <Textarea
                {...field}
                placeholder="Jelaskan ketentuan tipe lembur ini..."
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="price"
          control={control}
          render={({ field: { onChange, value, ...field }, fieldState }) => (
            <Field>
              <FieldLabel required>Tarif (Price)</FieldLabel>
              <NumericFormat
                {...field}
                value={value}
                onValueChange={(values) => {
                  onChange(values.value);
                }}
                customInput={Input}
                thousandSeparator="."
                decimalSeparator=","
                prefix="Rp "
                placeholder="Rp 80.000"
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
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
