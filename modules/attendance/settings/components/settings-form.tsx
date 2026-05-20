"use client";

import { useForm, Controller } from "react-hook-form";
import { AttendanceSetting } from "../types";
import { useUpdateAttendanceSettings } from "../hooks/use-attendance-settings";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { TimePicker } from "@/components/ui/time-picker";
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
  CheckmarkCircle02Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface SettingsFormProps {
  settings: any[];
  title: string;
  description: string;
  icon?: React.ReactNode;
  onSubmit?: (data: Record<string, string | number>) => Promise<void>;
  isLoading?: boolean;
}

const getSettingIcon = (key: string) => {
  if (key.includes('time') || key.includes('hours') || key.includes('minutes')) return <HugeiconsIcon icon={TimerIcon} className="h-4 w-4" />;
  if (key.includes('radius')) return <HugeiconsIcon icon={GlobalIcon} className="h-4 w-4" />;
  if (key.includes('gap')) return <HugeiconsIcon icon={ActivityIcon} className="h-4 w-4" />;
  if (key.includes('status') || key.includes('id')) return <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-4 w-4" />;
  return <HugeiconsIcon icon={InformationCircleIcon} className="h-4 w-4" />;
};

export function SettingsForm({ settings, title, description, icon, onSubmit: externalOnSubmit, isLoading: externalIsLoading }: SettingsFormProps) {
  const { control, handleSubmit, reset } = useForm<Record<string, string | number>>();
  const { updateSettings: internalUpdateSettings, isLoading: internalIsLoading } = useUpdateAttendanceSettings();

  const isLoading = externalIsLoading ?? internalIsLoading;
  const updateSettings = externalOnSubmit ?? internalUpdateSettings;

  useEffect(() => {
    if (settings.length > 0) {
      const defaultValues: Record<string, string | number> = {};
      settings.forEach((setting) => {
        defaultValues[setting.key] = setting.value;
      });
      reset(defaultValues);
    }
  }, [settings, reset]);

  const onSubmit = async (data: Record<string, string | number>) => {
    await updateSettings(data);
  };

  return (
    <div className="pb-24">
      {/* Header Section */}
      <div className="relative mb-12 overflow-hidden rounded-3xl bg-linear-to-br from-primary/5 via-transparent to-primary/5 p-8 border border-primary/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20 text-primary-foreground">
            {icon || <HugeiconsIcon icon={Settings02Icon} className="h-8 w-8" />}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">{description}</p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4">
          {settings.map((setting) => (
            <Card
              key={setting.id}
              className={cn(
                "group relative overflow-hidden transition-all duration-300",
                "hover:shadow-md hover:border-primary/30 border-border/50",
                "rounded-2xl bg-card/40 backdrop-blur-sm"
              )}
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center min-h-[100px]">
                  {/* Visual Indicator Line */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />

                  <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          {getSettingIcon(setting.key)}
                        </div>
                        <h4 className="font-semibold text-base tracking-tight leading-none">
                          {setting.description}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground/70 bg-muted/30 px-2 py-0.5 rounded-full border border-border/50 transition-colors group-hover:border-primary/20">
                          {setting.key}
                        </span>
                        {setting.type === 'integer' && (
                          <span className="text-[10px] uppercase tracking-wider font-bold text-primary/60">
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
                          const isTime = setting.key.includes("time") || setting.key.includes("midpoint") || setting.key.includes("buffer");

                          return (
                            <Field className="gap-1.5">
                              <div className="relative group/input">
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
                                    type={setting.type === "integer" ? "number" : "text"}
                                    aria-invalid={fieldState.invalid}
                                    className={cn(
                                      "h-11 rounded-xl bg-background/50 border-border/60 transition-all duration-300",
                                      "focus:ring-2 focus:ring-primary/20 focus:border-primary group-hover/input:border-primary/40",
                                      "placeholder:text-muted-foreground/50 font-medium"
                                    )}
                                    placeholder={`Masukkan nilai...`}
                                  />
                                )}
                              </div>
                              <FieldError errors={[fieldState.error]} />
                            </Field>
                          );
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
        <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4 animate-in slide-in-from-bottom-8 duration-500">
          <div className="flex items-center gap-6 rounded-2xl bg-background/80 backdrop-blur-xl border border-primary/20 p-3 pl-6 shadow-2xl shadow-primary/20 max-w-2xl w-full">
            <div className="flex-1 hidden sm:block">
              <p className="text-sm font-medium text-foreground">Simpan Perubahan</p>
              <p className="text-xs text-muted-foreground">Pastikan data yang diinput sudah valid</p>
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
                className="rounded-xl shadow-lg shadow-primary/20 px-8 h-11"
              >
                {isLoading ? (
                  <HugeiconsIcon icon={Loading03Icon} className="mr-2 h-4 w-4 animate-spin" />
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
  );
}
