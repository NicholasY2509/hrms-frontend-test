"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon, FileAttachmentIcon } from "@hugeicons/core-free-icons";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { warningLetterSchema, WarningLetterFormValues } from "../schemas/warning-letter-schema";
import { useWarningLetterTypes } from "../hooks/use-warning-letter";
import { useCreateWarningLetter } from "../hooks/use-warning-letter-mutation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileUpload } from "@/components/ui/file-upload";
import { DatePicker } from "@/components/ui/date-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";

interface WarningLetterSheetProps {
  employeeId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function WarningLetterSheet({
  employeeId,
  isOpen,
  onClose,
}: WarningLetterSheetProps) {
  const { items: types, isLoading: isLoadingTypes } = useWarningLetterTypes({ enabled: isOpen });
  const { createWarningLetter, isLoading: isSubmitting } = useCreateWarningLetter({
    onSuccess: onClose,
  });

  const form = useForm<WarningLetterFormValues>({
    resolver: zodResolver(warningLetterSchema),
    defaultValues: {
      employee_id: employeeId,
      warning_letter_type_id: undefined as any,
      document_no: "",
      name: "",
      note: "",
    },
  });

  const { control, handleSubmit, setValue, watch, reset } = form;
  const attachment = watch("attachment");

  // Reset form when opened
  React.useEffect(() => {
    if (isOpen) {
      reset({
        employee_id: employeeId,
        document_no: "",
        name: "",
        note: "",
      });
    }
  }, [isOpen, employeeId, reset]);

  const onSubmit = async (values: WarningLetterFormValues) => {
    const formData = new FormData();
    formData.append("employee_id", values.employee_id.toString());
    formData.append("warning_letter_type_id", values.warning_letter_type_id.toString());
    formData.append("document_no", values.document_no);
    formData.append("name", values.name);

    formData.append("warning_at", format(values.warning_at, "yyyy-MM-dd HH:mm:ss"));
    formData.append("start_date", format(values.start_date, "yyyy-MM-dd HH:mm:ss"));
    formData.append("end_date", format(values.end_date, "yyyy-MM-dd HH:mm:ss"));

    if (values.note) formData.append("note", values.note);
    if (values.attachment) formData.append("attachment", values.attachment);

    await createWarningLetter(formData);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex flex-col h-full sm:max-w-[540px]">
        <SheetHeader className="border-b text-left px-4">
          <SheetTitle>Form Surat Peringatan</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 overflow-y-auto bg-background">
          <form id="warning-letter-form" onSubmit={handleSubmit(onSubmit)} className="px-4 py-3 space-y-4">
            <FieldGroup>
              <Controller
                name="warning_letter_type_id"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel required>Tipe Surat Peringatan</FieldLabel>
                    <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                      <SelectTrigger aria-invalid={fieldState.invalid} disabled={isLoadingTypes}>
                        <SelectValue placeholder={isLoadingTypes ? "Loading..." : "Pilih tipe SP"} />
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

              <Controller
                name="document_no"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel required>Nomor Dokumen</FieldLabel>
                    <Input {...field} placeholder="Contoh: 001/SP1/HRD/2024" aria-invalid={fieldState.invalid} />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel required>Judul/Nama Kejadian</FieldLabel>
                    <Input {...field} placeholder="Contoh: Indisipliner Keterlambatan" aria-invalid={fieldState.invalid} />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  name="warning_at"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel required>Tanggal Kejadian</FieldLabel>
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
                name="start_date"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel required>Masa Berlaku Surat Peringatan</FieldLabel>
                    <DateRangePicker
                      value={{
                        from: field.value,
                        to: watch("end_date") as Date
                      }}
                      onChange={(range) => {
                        field.onChange(range?.from);
                        setValue("end_date", range?.to as Date, { shouldValidate: true });
                      }}
                    />
                    <FieldError errors={[fieldState.error, form.formState.errors.end_date]} />
                  </Field>
                )}
              />

              <Controller
                name="note"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Catatan</FieldLabel>
                    <Textarea {...field} placeholder="Berikan penjelasan detail..." className="min-h-[100px]" value={field.value || ""} />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                name="attachment"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Lampiran (Opsional)</FieldLabel>
                    <FileUpload
                      value={field.value}
                      onChange={field.onChange}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      maxSize={5}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </ScrollArea>
        <SheetFooter className="border-t justify-end px-4 py-3">
          <Button type="submit" form="warning-letter-form" disabled={isSubmitting}>
            {isSubmitting && <HugeiconsIcon icon={Loading03Icon} className="mr-2 h-4 w-4 animate-spin" />}
            Keluarkan Surat Peringatan
          </Button>
          <SheetClose asChild>
            <Button variant="outline" type="button" disabled={isSubmitting}>
              Batal
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
