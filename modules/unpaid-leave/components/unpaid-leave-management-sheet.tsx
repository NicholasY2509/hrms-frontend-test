"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon, Calendar01Icon, Note01Icon, FileAttachmentIcon } from "@hugeicons/core-free-icons";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
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
import { unpaidLeaveManagementSchema, UnpaidLeaveManagementFormValues } from "../schemas/unpaid-leave-schema";
import { useUnpaidLeaveTypes, useCreateUnpaidLeaveManagement } from "../hooks/use-unpaid-leave";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileUpload } from "@/components/ui/file-upload";
import { DatePicker } from "@/components/ui/date-picker";

interface UnpaidLeaveManagementSheetProps {
  employeeId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function UnpaidLeaveManagementSheet({
  employeeId,
  isOpen,
  onClose,
}: UnpaidLeaveManagementSheetProps) {
  const { items: types, isLoading: isLoadingTypes } = useUnpaidLeaveTypes();
  const { createUnpaidLeave, isLoading: isSubmitting } = useCreateUnpaidLeaveManagement({
    onSuccess: onClose,
  });

  const form = useForm<UnpaidLeaveManagementFormValues>({
    resolver: zodResolver(unpaidLeaveManagementSchema) as any,
    defaultValues: {
      employee_id: employeeId,
      unpaid_leave_type_id: undefined as any,
      start_date: undefined as any,
      end_date: undefined as any,
      note: "",
      attachment: undefined,
    },
  });

  const { control, handleSubmit, reset } = form;

  // Reset form when opened
  React.useEffect(() => {
    if (isOpen) {
      reset({
        employee_id: employeeId,
        unpaid_leave_type_id: undefined as any,
        start_date: undefined as any,
        end_date: undefined as any,
        note: "",
        attachment: undefined,
      });
    }
  }, [isOpen, employeeId, reset]);

  const onSubmit = async (values: UnpaidLeaveManagementFormValues) => {
    await createUnpaidLeave(values);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex h-full flex-col sm:max-w-[540px]">
        <SheetHeader className="border-b px-4 text-left">
          <SheetTitle>Buatkan Pengajuan Cuti</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 overflow-y-auto bg-background">
          <form
            id="unpaid-leave-management-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 px-4 py-3"
          >
            <FieldGroup>
              <Controller
                name="unpaid_leave_type_id"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel required className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={Note01Icon}
                        className="h-4 w-4 text-primary"
                      />
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
                        <HugeiconsIcon
                          icon={Calendar01Icon}
                          className="h-4 w-4 text-primary"
                        />
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
                        <HugeiconsIcon
                          icon={Calendar01Icon}
                          className="h-4 w-4 text-primary"
                        />
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
                      <HugeiconsIcon
                        icon={Note01Icon}
                        className="h-4 w-4 text-primary"
                      />
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
                      <HugeiconsIcon
                        icon={FileAttachmentIcon}
                        className="h-4 w-4 text-primary"
                      />
                      Lampiran (Opsional)
                    </FieldLabel>
                    <FileUpload
                      value={field.value}
                      onChange={field.onChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      maxSize={2}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </ScrollArea>
        <SheetFooter className="justify-end border-t px-4 py-3">
          <Button
            type="submit"
            form="unpaid-leave-management-form"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <HugeiconsIcon
                icon={Loading03Icon}
                className="mr-2 h-4 w-4 animate-spin"
              />
            )}
            Simpan Pengajuan
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
