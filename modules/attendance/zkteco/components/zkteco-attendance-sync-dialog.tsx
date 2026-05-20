"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { format } from "date-fns"
import {
  zktecoAttendanceSyncSchema,
  ZktecoAttendanceSyncFormValues,
} from "../schemas/zkteco-attendance-sync.schema"
import {
  useZktecoMachines,
  useSyncZktecoAttendances,
} from "../hooks/use-zkteco"

interface ZktecoAttendanceSyncDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ZktecoAttendanceSyncDialog({
  open,
  onOpenChange,
}: ZktecoAttendanceSyncDialogProps) {
  const { machines, isLoadingMachines } = useZktecoMachines()
  const { syncZktecoAttendances, isLoading: isSyncing } =
    useSyncZktecoAttendances({
      onSuccess: () => {
        onOpenChange(false)
        reset()
      },
    })

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ZktecoAttendanceSyncFormValues>({
    resolver: zodResolver(zktecoAttendanceSyncSchema),
    defaultValues: {
      zkteco_machine_id: 0,
      start_date: "",
      end_date: "",
    },
  })

  const onSubmit = async (values: ZktecoAttendanceSyncFormValues) => {
    await syncZktecoAttendances(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tarik Data Absensi Fingerprint</DialogTitle>
          <DialogDescription>
            Pilih mesin fingerprint dan tentukan rentang tanggal log absensi
            yang ingin ditarik.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <Controller
            name="zkteco_machine_id"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Mesin Fingerprint
                </FieldLabel>
                <Select
                  onValueChange={(val) => field.onChange(Number(val))}
                  value={field.value ? String(field.value) : undefined}
                  disabled={isLoadingMachines}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue
                      placeholder={
                        isLoadingMachines
                          ? "Memuat mesin..."
                          : "Pilih mesin fingerprint"
                      }
                    />
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

          <FieldGroup className="grid grid-cols-2 gap-4">
            <Controller
              name="start_date"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Tanggal Mulai
                  </FieldLabel>
                  <DatePicker
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(date) =>
                      field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                    }
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
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(date) =>
                      field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                    }
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </FieldGroup>

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
  )
}
