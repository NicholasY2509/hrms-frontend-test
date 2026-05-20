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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmployeePicker } from "@/modules/employee/employee/components/employee-picker";
import { attendanceUserSchema, AttendanceUserFormValues } from "../schemas/attendance-user.schema";
import { AttendanceUserModel } from "../types";
import { useZktecoMachines } from "../../zkteco/hooks/use-zkteco";

interface AttendanceUserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: AttendanceUserModel | null;
  onSubmit: (data: AttendanceUserFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function AttendanceUserFormDialog({
  open,
  onOpenChange,
  data,
  onSubmit,
  isLoading,
}: AttendanceUserFormDialogProps) {
  const { machines, isLoading: isLoadingMachines } = useZktecoMachines();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AttendanceUserFormValues>({
    resolver: zodResolver(attendanceUserSchema),
    defaultValues: {
      employee_id: 0,
      uid: "",
      zkteco_machine_id: 0,
    },
  });

  React.useEffect(() => {
    if (data) {
      reset({
        employee_id: data.employee_id,
        uid: data.uid,
        zkteco_machine_id: data.zkteco_machine_id,
      });
    } else {
      reset({
        employee_id: 0,
        uid: "",
        zkteco_machine_id: 0,
      });
    }
  }, [data, reset, open]);

  const onFormSubmit: SubmitHandler<AttendanceUserFormValues> = async (values) => {
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
            <DialogTitle>{data ? "Edit Pemetaan User" : "Tambah Pemetaan User"}</DialogTitle>
            <DialogDescription>
              Hubungkan data karyawan dengan ID Fingerprint (UID) di mesin absensi.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Controller
              name="employee_id"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel required>Karyawan</FieldLabel>
                  <EmployeePicker
                    value={field.value || ""}
                    onChange={(val) => field.onChange(val)}
                  />
                  <FieldError errors={[errors.employee_id?.message]} />
                </Field>
              )}
            />

            <Controller
              name="zkteco_machine_id"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel required>Mesin Absensi</FieldLabel>
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(val) => field.onChange(Number(val))}
                    disabled={isLoadingMachines}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih mesin absensi" />
                    </SelectTrigger>
                    <SelectContent>
                      {machines.map((machine) => (
                        <SelectItem key={machine.id} value={machine.id.toString()}>
                          {machine.name} ({machine.ip_address})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[errors.zkteco_machine_id?.message]} />
                </Field>
              )}
            />

            <Controller
              name="uid"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel required>UID (ID Mesin)</FieldLabel>
                  <Input {...field} placeholder="Contoh: 1047" />
                  <FieldError errors={[errors.uid?.message]} />
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
              {isLoading ? "Menyimpan..." : "Simpan Pemetaan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
