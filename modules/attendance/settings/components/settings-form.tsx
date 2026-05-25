"use client"

import { useForm, Controller } from "react-hook-form"
import { AttendanceSetting } from "../types"
import { useUpdateAttendanceSettings } from "../hooks/use-attendance-settings"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field, FieldError } from "@/components/ui/field"
import { TimePicker } from "@/components/ui/time-picker"
import {
  Loading03Icon,
  SaveIcon,
  Settings02Icon,
  Clock01Icon,
  InformationCircleIcon,
  GlobalIcon,
  TimerIcon,
  Calendar01Icon,
  ActivityIcon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect } from "react"
import { cn } from "@/lib/utils"

interface SettingsFormProps {
  settings: any[]
  title: string
  description: string
  icon?: React.ReactNode
  onSubmit?: (data: Record<string, string | number>) => Promise<void>
  isLoading?: boolean
}

const getSettingIcon = (key: string) => {
  if (key.includes("time") || key.includes("hours") || key.includes("minutes"))
    return <HugeiconsIcon icon={TimerIcon} className="h-4 w-4" />
  if (key.includes("radius"))
    return <HugeiconsIcon icon={GlobalIcon} className="h-4 w-4" />
  if (key.includes("gap"))
    return <HugeiconsIcon icon={ActivityIcon} className="h-4 w-4" />
  if (key.includes("status") || key.includes("id"))
    return <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-4 w-4" />
  return <HugeiconsIcon icon={InformationCircleIcon} className="h-4 w-4" />
}

export function SettingsForm({
  settings,
  title,
  description,
  icon,
  onSubmit: externalOnSubmit,
  isLoading: externalIsLoading,
}: SettingsFormProps) {
  const { control, handleSubmit, reset } =
    useForm<Record<string, string | number>>()
  const {
    updateSettings: internalUpdateSettings,
    isLoading: internalIsLoading,
  } = useUpdateAttendanceSettings()

  const isLoading = externalIsLoading ?? internalIsLoading
  const updateSettings = externalOnSubmit ?? internalUpdateSettings

  useEffect(() => {
    if (settings.length > 0) {
      const defaultValues: Record<string, string | number> = {}
      settings.forEach((setting) => {
        defaultValues[setting.key] = setting.value
      })
      reset(defaultValues)
    }
  }, [settings, reset])

  const onSubmit = async (data: Record<string, string | number>) => {
    await updateSettings(data)
  }

  return (
    <div className="pb-24">
      {/* Header Section */}
      <div className="relative mb-12 overflow-hidden rounded-3xl border border-primary/10 bg-linear-to-br from-primary/5 via-transparent to-primary/5 p-8">
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            {icon || (
              <HugeiconsIcon icon={Settings02Icon} className="h-8 w-8" />
            )}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4">
          {settings.map((setting) => (
            <Card
              key={setting.id}
              className={cn(
                "group relative overflow-hidden transition-all duration-300",
                "border-border/50 hover:border-primary/30 hover:shadow-md",
                "rounded-2xl bg-card/40 backdrop-blur-sm"
              )}
            >
              <CardContent className="p-0">
                <div className="flex min-h-[100px] flex-col md:flex-row md:items-center">
                  {/* Visual Indicator Line */}
                  <div className="absolute top-0 bottom-0 left-0 w-1 origin-center scale-y-0 bg-primary transition-transform duration-300 group-hover:scale-y-100" />

                  <div className="flex flex-1 flex-col gap-6 p-6 md:flex-row md:items-center">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-muted p-1.5 text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                          {getSettingIcon(setting.key)}
                        </div>
                        <h4 className="text-base leading-none font-semibold tracking-tight">
                          {setting.description}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-border/50 bg-muted/30 px-2 py-0.5 font-mono text-xs text-muted-foreground/70 transition-colors group-hover:border-primary/20">
                          {setting.key}
                        </span>
                        {setting.type === "integer" && (
                          <span className="text-[10px] font-bold tracking-wider text-primary/60 uppercase">
                            Angka
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="md:w-72">
                      <Controller
                        name={setting.key}
                        control={control}
                        render={({ field, fieldState }) => {
                          const isTime =
                            setting.key.includes("time") ||
                            setting.key.includes("midpoint") ||
                            setting.key.includes("buffer") ||
                            setting.key.includes("cutoff")

                          return (
                            <Field className="gap-1.5">
                              <div className="group/input relative">
                                {isTime ? (
                                  <TimePicker
                                    value={field.value as string}
                                    onChange={field.onChange}
                                    disabled={isLoading}
                                    className="max-w-md"
                                    variant="seconds"
                                  />
                                ) : (
                                  <Input
                                    {...field}
                                    value={field.value ?? ""}
                                    id={setting.key}
                                    type={
                                      setting.type === "integer"
                                        ? "number"
                                        : "text"
                                    }
                                    aria-invalid={fieldState.invalid}
                                    className={cn(
                                      "h-11 rounded-xl border-border/60 bg-background/50 transition-all duration-300",
                                      "group-hover/input:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20",
                                      "font-medium placeholder:text-muted-foreground/50"
                                    )}
                                    placeholder={`Masukkan nilai...`}
                                  />
                                )}
                              </div>
                              <FieldError errors={[fieldState.error]} />
                            </Field>
                          )
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Floating Action Bar */}
        <div className="fixed right-0 bottom-8 left-0 z-50 flex animate-in justify-center px-4 duration-500 slide-in-from-bottom-8">
          <div className="flex w-full max-w-2xl items-center gap-6 rounded-2xl border border-primary/20 bg-background/80 p-3 pl-6 shadow-2xl shadow-primary/20 backdrop-blur-xl">
            <div className="hidden flex-1 sm:block">
              <p className="text-sm font-medium text-foreground">
                Simpan Perubahan
              </p>
              <p className="text-xs text-muted-foreground">
                Pastikan data yang diinput sudah valid
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={() => reset()}
                className="rounded-xl border-border/50"
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 rounded-xl px-8 shadow-lg shadow-primary/20"
              >
                {isLoading ? (
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    className="mr-2 h-4 w-4 animate-spin"
                  />
                ) : (
                  <HugeiconsIcon icon={SaveIcon} className="mr-2 h-4 w-4" />
                )}
                Simpan
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
