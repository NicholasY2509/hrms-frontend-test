"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  shiftExchangeSchema,
  ShiftExchangeFormValues,
} from "@/modules/shift-exchange/schemas"
import { useCreateShiftExchange } from "@/modules/shift-exchange/hooks/use-shift-exchange-mutation"
import { useShiftExchangeWorkingHour } from "@/modules/shift-exchange/hooks/use-shift-exchange"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft } from "@hugeicons/core-free-icons"
import { DatePicker } from "@/components/ui/date-picker"
import { WorkingHourPicker } from "@/modules/attendance/working-hours/components/working-hour-picker"
import { EmployeePicker } from "@/modules/employee/employee/components/employee-picker"
import { useAuth } from "@/modules/auth/hooks/auth-context"

export default function ShiftExchangeCreateClient() {
  const router = useRouter()
  const { user } = useAuth()

  const { createShiftExchange, isLoading } = useCreateShiftExchange({
    onSuccess: () => {
      router.push("/employee/shift-exchange")
    },
  })

  const form = useForm<ShiftExchangeFormValues>({
    resolver: zodResolver(shiftExchangeSchema),
    defaultValues: {
      date: "",
      original_working_hour_id: 0,
      requested_working_hour_id: 0,
      exchange_with_employee_id: undefined,
      reason: "",
    },
  })

  const watchDate = form.watch("date")
  const watchEmployeeId = form.watch("exchange_with_employee_id")

  const { data: originalWorkingHour, isLoading: isLoadingOriginal } =
    useShiftExchangeWorkingHour(
      watchDate,
      user?.employee_id ? Number(user.employee_id) : undefined
    )
  const { data: requestedWorkingHour, isLoading: isLoadingRequested } =
    useShiftExchangeWorkingHour(
      watchDate,
      watchEmployeeId ? Number(watchEmployeeId) : undefined
    )

  React.useEffect(() => {
    if (originalWorkingHour?.working_hour_id) {
      form.setValue(
        "original_working_hour_id",
        originalWorkingHour.working_hour_id
      )
    }
  }, [originalWorkingHour, form])

  React.useEffect(() => {
    if (watchEmployeeId && requestedWorkingHour?.working_hour_id) {
      form.setValue(
        "requested_working_hour_id",
        requestedWorkingHour.working_hour_id
      )
    } else if (!watchEmployeeId) {
      // Allow manual selection when no employee is picked
      // But we shouldn't necessarily clear it if they picked one manually.
    }
  }, [requestedWorkingHour, watchEmployeeId, form])

  const onSubmit = async (data: ShiftExchangeFormValues) => {
    await createShiftExchange({
      ...data,
      date: new Date(data.date).toISOString(),
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/employee/shift-exchange")}
        >
          <HugeiconsIcon icon={ArrowLeft} className="h-5 w-5" />
        </Button>
        <PageHeader
          title="Ajukan Tukar Shift"
          description="Isi formulir di bawah ini untuk mengajukan penukaran shift."
        />
      </div>

      <Card>
        <CardContent className="p-6">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Controller
              name="date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Tanggal
                  </FieldLabel>
                  <DatePicker
                    {...field}
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(date) =>
                      field.onChange(date ? date.toISOString() : "")
                    }
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error?.message]} />
                </Field>
              )}
            />

            <Controller
              name="exchange_with_employee_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Karyawan Tujuan (Opsional)
                  </FieldLabel>
                  <EmployeePicker
                    value={field.value ?? 0}
                    onChange={(value) => field.onChange(value ?? null)}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error?.message]} />
                </Field>
              )}
            />

            <div className="grid w-full grid-cols-2 gap-2">
              <Controller
                name="original_working_hour_id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} required>
                      Jam Kerja Asal{" "}
                      {isLoadingOriginal && (
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                          (Memuat...)
                        </span>
                      )}
                    </FieldLabel>
                    <WorkingHourPicker
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      aria-invalid={fieldState.invalid}
                      disabled={true}
                    />
                    <FieldError errors={[fieldState.error?.message]} />
                  </Field>
                )}
              />

              <Controller
                name="requested_working_hour_id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} required>
                      Jam Kerja Tujuan{" "}
                      {isLoadingRequested && (
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                          (Memuat...)
                        </span>
                      )}
                    </FieldLabel>
                    <WorkingHourPicker
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      aria-invalid={fieldState.invalid}
                      disabled={!!watchEmployeeId || isLoadingRequested}
                    />
                    <FieldError errors={[fieldState.error?.message]} />
                  </Field>
                )}
              />
            </div>

            <Controller
              name="reason"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Alasan
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error?.message]} />
                </Field>
              )}
            />

            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/employee/shift-exchange")}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
