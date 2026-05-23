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
} from "@/components/ui/dialog"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { AttendanceStatusPicker } from "../../shared/components/attendance-status-picker"
import { AttendanceModel } from "../types"
import {
  batchUpdateAttendanceStatusSchema,
  BatchUpdateAttendanceStatusFormValues,
} from "../schemas/batch-update-attendance-status.schema"
import { useBatchUpdateAttendanceStatus } from "../hooks/use-attendance"
import { ScrollArea } from "@/components/ui/scroll-area"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar01Icon, UserIcon } from "@hugeicons/core-free-icons"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"

interface BatchUpdateAttendanceStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedAttendances: AttendanceModel[]
  onSuccess?: () => void
}

export function BatchUpdateAttendanceStatusDialog({
  open,
  onOpenChange,
  selectedAttendances,
  onSuccess,
}: BatchUpdateAttendanceStatusDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<BatchUpdateAttendanceStatusFormValues>({
    resolver: zodResolver(batchUpdateAttendanceStatusSchema),
    defaultValues: {
      attendance_ids: [],
      attendance_status_id: undefined,
    },
  })

  const { batchUpdateAttendanceStatus } = useBatchUpdateAttendanceStatus({
    onSuccess: () => {
      onOpenChange(false)
      reset()
      onSuccess?.()
    },
  })

  React.useEffect(() => {
    if (open && selectedAttendances.length > 0) {
      reset({
        attendance_ids: selectedAttendances.map((a) => a.id),
        attendance_status_id: undefined,
      })
    }
  }, [open, selectedAttendances, reset])

  const onSubmit = async (values: BatchUpdateAttendanceStatusFormValues) => {
    await batchUpdateAttendanceStatus(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ubah Status Kehadiran Massal</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 py-4"
        >
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-semibold">
                Kehadiran Terpilih ({selectedAttendances.length})
              </h4>
              <p className="text-xs text-muted-foreground">
                Berikut adalah daftar kehadiran yang akan diubah statusnya.
              </p>
            </div>

            <div className="rounded-md border">
              <ScrollArea className="h-[250px] w-full p-2">
                <div className="grid grid-cols-2 gap-2">
                  {selectedAttendances.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-md border bg-card p-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <HugeiconsIcon icon={UserIcon} size={14} />
                        </div>
                        <div className="flex flex-col">
                          <span className="mb-1 text-[13px] leading-none font-medium">
                            {item.employee.name}
                          </span>
                          <div className="flex items-center gap-1.5 text-[11px] leading-none text-muted-foreground">
                            <HugeiconsIcon icon={Calendar01Icon} size={10} />
                            {format(
                              new Date(item.attendance_at),
                              "dd MMM yyyy",
                              {
                                locale: id,
                              }
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="h-5 px-1.5 py-0 text-[10px]"
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                  {selectedAttendances.length === 0 && (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      Belum ada kehadiran yang dipilih
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="space-y-4">
            <Controller
              name="attendance_status_id"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="w-full">
                  <FieldLabel htmlFor={field.name} required>
                    Status Baru
                  </FieldLabel>
                  <AttendanceStatusPicker
                    value={field.value ?? null}
                    onChange={(val) => field.onChange(val ?? undefined)}
                    placeholder="Pilih Status Kehadiran"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || selectedAttendances.length === 0}
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
