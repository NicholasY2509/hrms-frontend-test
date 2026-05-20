"use client";

import * as React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { FileUpload } from "@/components/ui/file-upload";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { unpaidLeaveSchema, UnpaidLeaveFormValues } from "../schemas/unpaid-leave-schema";
import { useUnpaidLeaveTypes, useCreateUnpaidLeave } from "../hooks/use-unpaid-leave";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  Note01Icon,
  SentIcon,
  ArrowLeft02Icon,
  FileAttachmentIcon,
  ArrowLeft01Icon,
  Loader,
  Loading03Icon
} from "@hugeicons/core-free-icons";

export function UnpaidLeaveForm() {
  const router = useRouter();
  const { items: types, isLoading: isLoadingTypes } = useUnpaidLeaveTypes();
  const { createUnpaidLeave, isLoading: isSubmitting } = useCreateUnpaidLeave({
    onSuccess: () => {
      router.push("/employee/unpaid-leave");
      router.refresh();
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<UnpaidLeaveFormValues>({
    resolver: zodResolver(unpaidLeaveSchema) as any,
    defaultValues: {
      unpaid_leave_type_id: undefined,
      start_date: undefined,
      end_date: undefined,
      note: "",
    },
  });

  const onSubmit: SubmitHandler<UnpaidLeaveFormValues> = (data) => {
    createUnpaidLeave(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Form Pengajuan Cuti</h1>
          <p className="text-sm text-muted-foreground">
            Lengkapi data di bawah ini untuk untuk mengajukan Cuti/Izin.
          </p>
        </div>
      </div>

      <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border">
        <CardContent className="">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <FieldGroup>
              <Controller
                name="unpaid_leave_type_id"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel required className="flex items-center gap-2">
                      <HugeiconsIcon icon={Note01Icon} className="h-4 w-4 text-primary" />
                      Tipe Cuti
                    </FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value?.toString()}
                      disabled={isLoadingTypes}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue
                          placeholder={
                            isLoadingTypes ? "Memuat..." : "Pilih tipe cuti"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {types.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Controller
                  name="start_date"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel required className="flex items-center gap-2">
                        <HugeiconsIcon icon={Calendar01Icon} className="h-4 w-4 text-primary" />
                        Tanggal Mulai
                      </FieldLabel>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
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
                      <FieldLabel required className="flex items-center gap-2">
                        <HugeiconsIcon icon={Calendar01Icon} className="h-4 w-4 text-primary" />
                        Tanggal Selesai
                      </FieldLabel>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="note"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="flex items-center gap-2">
                      <HugeiconsIcon icon={Note01Icon} className="h-4 w-4 text-primary" />
                      Catatan
                    </FieldLabel>
                    <Textarea
                      {...field}
                      placeholder="Masukkan alasan atau catatan tambahan..."
                      className="min-h-[120px] resize-none"
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                name="attachment"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="flex items-center gap-2">
                      <HugeiconsIcon icon={FileAttachmentIcon} className="h-4 w-4 text-primary" />
                      Lampiran (Opsional)
                    </FieldLabel>
                    <FileUpload
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </FieldGroup>

            <div className="flex justify-end gap-4 border-t pt-8">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !isDirty}
              >
                {isSubmitting ? (
                  <>
                    <HugeiconsIcon icon={Loading03Icon} className="h-4 w-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <HugeiconsIcon icon={SentIcon} className="h-4 w-4" />
                    Kirim Pengajuan
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
