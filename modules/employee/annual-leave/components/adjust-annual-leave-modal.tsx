"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import {
  adjustAnnualLeaveSchema,
  AdjustAnnualLeaveFormValues,
} from "../schemas/adjust-annual-leave-schema"
import { useAdjustAnnualLeave } from "../hooks/use-annual-leave-mutation"

interface AdjustAnnualLeaveModalProps {
  employee: any // We can use any or the specific Employee type
  isOpen: boolean
  onClose: () => void
}

export function AdjustAnnualLeaveModal({
  employee,
  isOpen,
  onClose,
}: AdjustAnnualLeaveModalProps) {
  const { adjustAnnualLeave, isLoading: isSubmitting } = useAdjustAnnualLeave({
    onSuccess: onClose,
  })

  const form = useForm<AdjustAnnualLeaveFormValues>({
    resolver: zodResolver(adjustAnnualLeaveSchema),
    defaultValues: {
      annual_leave_2: 0,
      annual_leave_3: 0,
      keterangan: "",
    },
  })

  const { control, handleSubmit, reset } = form

  // Reset form when opened with current balances
  React.useEffect(() => {
    if (isOpen && employee) {
      reset({
        annual_leave_2: employee.annual_leave_2 || 0,
        annual_leave_3: employee.annual_leave_3 || 0,
        keterangan: "",
      })
    }
  }, [isOpen, employee, reset])

  const onSubmit = async (values: AdjustAnnualLeaveFormValues) => {
    await adjustAnnualLeave({ employeeId: employee.id, data: values })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ubah Hak Cuti</DialogTitle>
        </DialogHeader>
        <form
          id="adjust-annual-leave-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-4"
        >
          <FieldGroup>
            <Controller
              name="annual_leave_2"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel required>Sisa Cuti Tahun Lalu</FieldLabel>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="annual_leave_3"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel required>Sisa Cuti Tahun Ini</FieldLabel>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="keterangan"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel required>Keterangan / Alasan</FieldLabel>
                  <Textarea
                    {...field}
                    placeholder="Masukkan alasan penyesuaian cuti..."
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            type="submit"
            form="adjust-annual-leave-form"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <HugeiconsIcon
                icon={Loading03Icon}
                className="mr-2 h-4 w-4 animate-spin"
              />
            )}
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
