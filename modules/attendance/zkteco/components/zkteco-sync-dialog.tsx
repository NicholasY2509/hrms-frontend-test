"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zktecoSyncSchema, ZktecoSyncFormValues } from "../schemas/zkteco-sync.schema";
import { useZktecoMachines, useSyncZktecoUsers } from "../hooks/use-zkteco";

interface ZktecoSyncDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ZktecoSyncDialog({ open, onOpenChange }: ZktecoSyncDialogProps) {
  const { machines, isLoadingMachines } = useZktecoMachines();
  const { syncZktecoUsers, isLoading: isSyncing } = useSyncZktecoUsers({
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ZktecoSyncFormValues>({
    resolver: zodResolver(zktecoSyncSchema),
    defaultValues: {
      zkteco_machine_id: 0,
    },
  });

  const onSubmit = async (values: ZktecoSyncFormValues) => {
    await syncZktecoUsers(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tarik Data User Fingerprint</DialogTitle>
          <DialogDescription>
            Pilih mesin fingerprint untuk mengambil data user terbaru dan menyinkronkannya dengan database.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <Controller
            name="zkteco_machine_id"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} required>Mesin Fingerprint</FieldLabel>
                <Select
                  onValueChange={(val) => field.onChange(Number(val))}
                  value={field.value ? String(field.value) : undefined}
                  disabled={isLoadingMachines}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder={isLoadingMachines ? "Memuat mesin..." : "Pilih mesin fingerprint"} />
                  </SelectTrigger>
                  <SelectContent>
                    {machines.map((machine: any) => (
                      <SelectItem key={machine.id} value={String(machine.id)}>
                        {machine.name} ({machine.ip_address})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting || isSyncing}>
              {isSubmitting || isSyncing ? "Memproses..." : "Mulai Tarik Data"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
