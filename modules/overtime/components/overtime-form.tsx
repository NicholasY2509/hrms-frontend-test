"use client"

import * as React from "react"
import { useForm, Controller, useWatch, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Banknote,
  Clock01Icon,
  Calendar01Icon,
  SentIcon,
  ArrowLeft01Icon,
  Loading03Icon,
  Note01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field"
import { DatePicker } from "@/components/ui/date-picker"
import { TimePicker } from "@/components/ui/time-picker"
import { DateTimePicker } from "@/components/ui/datetime-picker"
import { FileUpload } from "@/components/ui/file-upload"

import { overtimeSchema, OvertimeFormValues } from "../schemas"
import { useCreateOvertime } from "../hooks/use-overtime"
import { useAuth } from "@/modules/auth/hooks/use-auth"
import { useMySalary } from "@/modules/payroll/employee-salaries/hooks/use-employee-salary"

export function OvertimeForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const typeParam =
    (searchParams.get("type") as "UMUM" | "DAC" | "NATIONAL") || "UMUM"

  const { user } = useAuth()
  const { item: salaryDetails } = useMySalary()

  const { createOvertime, isLoading: isSubmitting } = useCreateOvertime({
    onSuccess: () => {
      router.push("/employee/overtime")
      router.refresh()
    },
  })

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = useForm<OvertimeFormValues>({
    resolver: zodResolver(overtimeSchema) as any,
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      type: typeParam,
      note: "",
      start_time: typeParam === "DAC" ? "" : "17:00",
      finish_time: typeParam === "DAC" ? "" : "19:00",
    },
  })

  const watchedValues = useWatch({ control })

  const [totalTime, setTotalTime] = React.useState("00:00")
  const [estimatedCost, setEstimatedCost] = React.useState(0)

  React.useEffect(() => {
    if (watchedValues.start_time && watchedValues.finish_time) {
      const isDac = watchedValues.type === "DAC"

      let start: Date
      let finish: Date

      if (isDac) {
        start = new Date(watchedValues.start_time)
        finish = new Date(watchedValues.finish_time)
      } else {
        start = new Date(`2000-01-01T${watchedValues.start_time}`)
        finish = new Date(`2000-01-01T${watchedValues.finish_time}`)
      }

      if (isNaN(start.getTime()) || isNaN(finish.getTime())) return

      let diffMinutes = (finish.getTime() - start.getTime()) / (1000 * 60)
      if (!isDac && diffMinutes < 0) diffMinutes += 24 * 60

      if (diffMinutes > 0) {
        let netMinutes = diffMinutes

        if (watchedValues.type === "NATIONAL") {
          const startParts = watchedValues.start_time.split(":")
          const finishParts = watchedValues.finish_time.split(":")
          const startMins =
            parseInt(startParts[0]) * 60 + parseInt(startParts[1] || "0")
          let finishMins =
            parseInt(finishParts[0]) * 60 + parseInt(finishParts[1] || "0")
          if (finishMins < startMins) finishMins += 24 * 60

          const getOverlap = (
            sA: number,
            eA: number,
            sB: number,
            eB: number
          ) => {
            return Math.max(0, Math.min(eA, eB) - Math.max(sA, sB))
          }

          netMinutes -= getOverlap(startMins, finishMins, 12 * 60, 13 * 60)
          netMinutes -= getOverlap(startMins, finishMins, 18 * 60, 19 * 60)
          netMinutes -= getOverlap(startMins, finishMins, 36 * 60, 37 * 60)
          netMinutes -= getOverlap(startMins, finishMins, 42 * 60, 43 * 60)
        }

        let displayMinutes = netMinutes
        if (watchedValues.type === "NATIONAL" && displayMinutes > 8 * 60) {
          displayMinutes = 8 * 60
        }

        const hours = Math.floor(displayMinutes / 60)
        const minutes = Math.floor(displayMinutes % 60)
        setTotalTime(
          `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
        )

        if (salaryDetails) {
          const totalHoursRaw = netMinutes / 60
          let multiplier = 0
          if (watchedValues.type === "UMUM") {
            if (totalHoursRaw >= 4) multiplier = 5
            else if (totalHoursRaw >= 3) multiplier = 3.5
            else if (totalHoursRaw >= 2) multiplier = 2
          } else if (watchedValues.type === "NATIONAL") {
            const effectiveHours = Math.floor(totalHoursRaw)
            if (effectiveHours >= 1) {
              const cappedHours = Math.min(effectiveHours, 8)
              for (let i = 1; i <= cappedHours; i++) {
                if (i <= 2) multiplier += 1.0
                else if (i <= 4) multiplier += 1.5
                else multiplier += 2.0
              }
            }
          }

          const cost = (salaryDetails.actual_base_amount / 173) * multiplier
          setEstimatedCost(cost)
          setValue("estimated_cost", cost)
        }
      } else {
        setTotalTime("00:00")
        setEstimatedCost(0)
      }
    }
  }, [
    watchedValues.start_time,
    watchedValues.finish_time,
    watchedValues.type,
    salaryDetails,
    setValue,
  ])

  const onSubmit: SubmitHandler<OvertimeFormValues> = (data) => {
    if (!user?.id) return

    let payload = { ...data }
    if (data.type === "DAC") {
      payload.start_time = format(
        new Date(data.start_time),
        "yyyy-MM-dd HH:mm:ss"
      )
      payload.finish_time = format(
        new Date(data.finish_time),
        "yyyy-MM-dd HH:mm:ss"
      )
    }

    createOvertime(payload)
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case "UMUM":
        return "Reguler"
      case "DAC":
        return "DAC"
      case "NATIONAL":
        return "Hari Libur"
      default:
        return type
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <HugeiconsIcon icon={ArrowLeft01Icon} className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Form Pengajuan Lembur {getTypeName(typeParam)}
          </h1>
          <p className="text-sm text-muted-foreground">
            Lengkapi detail pengajuan lembur Anda di bawah ini.
          </p>
        </div>
      </div>

      <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-8">
            <FieldGroup>
              <Controller
                name="date"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel required className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={Calendar01Icon}
                        className="h-4 w-4 text-primary"
                      />
                      Tanggal Lembur
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

              {typeParam !== "DAC" ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Controller
                    name="start_time"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          required
                          className="flex items-center gap-2"
                        >
                          <HugeiconsIcon
                            icon={Clock01Icon}
                            className="h-4 w-4 text-primary"
                          />
                          Jam Mulai
                        </FieldLabel>
                        <TimePicker
                          value={field.value}
                          onChange={field.onChange}
                          variant="minutes"
                        />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />
                  <Controller
                    name="finish_time"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          required
                          className="flex items-center gap-2"
                        >
                          <HugeiconsIcon
                            icon={Clock01Icon}
                            className="h-4 w-4 text-primary"
                          />
                          Jam Selesai
                        </FieldLabel>
                        <TimePicker
                          value={field.value}
                          onChange={field.onChange}
                          variant="minutes"
                        />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Controller
                    name="start_time"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          required
                          className="flex items-center gap-2"
                        >
                          <HugeiconsIcon
                            icon={Clock01Icon}
                            className="h-4 w-4 text-primary"
                          />
                          Mulai (Tanggal & Jam)
                        </FieldLabel>
                        <DateTimePicker
                          value={
                            field.value ? new Date(field.value) : undefined
                          }
                          onChange={(date) =>
                            field.onChange(
                              date ? format(date, "yyyy-MM-dd'T'HH:mm") : ""
                            )
                          }
                        />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />
                  <Controller
                    name="finish_time"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          required
                          className="flex items-center gap-2"
                        >
                          <HugeiconsIcon
                            icon={Clock01Icon}
                            className="h-4 w-4 text-primary"
                          />
                          Selesai (Tanggal & Jam)
                        </FieldLabel>
                        <DateTimePicker
                          value={
                            field.value ? new Date(field.value) : undefined
                          }
                          onChange={(date) =>
                            field.onChange(
                              date ? format(date, "yyyy-MM-dd'T'HH:mm") : ""
                            )
                          }
                        />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />
                </div>
              )}

              {/* Calculations Display */}
              <div className="grid grid-cols-1 gap-4 rounded-2xl border border-border/50 bg-muted/30 p-6 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    <HugeiconsIcon icon={Clock01Icon} className="h-3.5 w-3.5" />{" "}
                    Total Waktu
                  </span>
                  <span className="text-2xl font-bold tracking-tight">
                    {totalTime}{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      Jam
                    </span>
                  </span>
                </div>
                <div className="flex flex-col gap-1 sm:text-right">
                  <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase sm:justify-end">
                    <HugeiconsIcon icon={Banknote} className="h-3.5 w-3.5" />{" "}
                    Estimasi Biaya
                  </span>
                  <span className="text-2xl font-bold tracking-tight text-primary">
                    {typeParam === "DAC" ? (
                      <span className="text-base font-medium text-muted-foreground">
                        Menunggu Realisasi
                      </span>
                    ) : (
                      new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      }).format(estimatedCost)
                    )}
                  </span>
                </div>
                {typeParam === "NATIONAL" && (
                  <span className="col-span-2 mt-2 w-full rounded-lg border border-dashed border-primary/20 bg-primary/5 p-3 text-[11px] text-primary/80">
                    Jam <strong> 12:00-13:00 </strong>
                    dan juga jam
                    <strong> 18:00-19:00 </strong>
                    tidak akan terhitung secara otomatis karena terhitung
                    sebagai <strong> jam istirahat.</strong>
                    Maksimal jam lembur adalah <strong> 8 jam </strong> dalam
                    satu hari.
                  </span>
                )}
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
                      Catatan / Alasan
                    </FieldLabel>
                    <Textarea
                      {...field}
                      placeholder="Masukkan alasan lembur atau catatan tambahan..."
                      className="min-h-[120px] resize-none"
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                name="attachments"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={Note01Icon}
                        className="h-4 w-4 text-primary"
                      />
                      Lampiran (Opsional)
                    </FieldLabel>
                    <FileUpload
                      multiple
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
                className="gap-2 px-8"
              >
                {isSubmitting ? (
                  <>
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      className="h-4 w-4 animate-spin"
                    />
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
  )
}
