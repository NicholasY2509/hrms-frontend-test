"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon, ArrowRight01Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { DatePicker } from "@/components/ui/date-picker";
import { careerTransitionSchema, CareerTransitionFormValues } from "../schemas";
import { useCareerTypes } from "../hooks/use-career";
import { useEmployeeStatuses } from "@/modules/employee/employee/hooks/use-employees";
import { Employee } from "@/modules/employee/employee/types";
import { useCreateCareer } from "../hooks/use-career-mutation";
import { TeamPicker } from "@/modules/organization/teams/components/team-picker";
import { WorkPositionPicker } from "@/modules/organization/work-position/components/work-position-picker";
import { WorkLocationPicker } from "@/modules/organization/work-location/components/work-location-picker";
import { EmployeePicker } from "@/modules/employee/employee/components/employee-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CareerTransitionRequest } from "../types";
import { DepartmentPicker } from "@/modules/organization/department/components/department-picker";

interface CareerTransitionSheetProps {
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
}

export function CareerTransitionSheet({
  employee,
  isOpen,
  onClose,
}: CareerTransitionSheetProps) {
  const { items: careerTypes, isLoading: isLoadingCareerTypes } = useCareerTypes({ enabled: isOpen });
  const { items: statuses, isLoading: isLoadingStatuses } = useEmployeeStatuses({ enabled: isOpen });

  const { createCareer, isLoading: isSubmitting } = useCreateCareer({
    onSuccess: onClose,
  });

  const form = useForm<CareerTransitionFormValues>({
    resolver: zodResolver(careerTransitionSchema),
    defaultValues: {
      employee_id: employee.id,
      career_type_id: undefined as any,
      career_at: undefined,
      before_employee_status_id: employee.work_employee_status_id || 0,
      before_work_position_id: employee.position?.id || 0,
      before_department_id: employee.department?.id || 0,
      before_work_location_id: employee.work_location?.id || 0,
      before_team_id: employee.team_id ? Number(employee.team_id) : null,
      before_supervisor_id: employee.supervisor_id ? Number(employee.supervisor_id) : null,
      after_employee_status_id: undefined as any,
      after_work_position_id: undefined as any,
      after_department_id: undefined as any,
      after_work_location_id: undefined as any,
      after_team_id: null,
      after_supervisor_id: null,
      note: "",
    },
  });

  const { control, handleSubmit, reset } = form;

  React.useEffect(() => {
    if (isOpen) {
      reset({
        employee_id: employee.id,
        career_type_id: undefined as any,
        career_at: undefined,
        before_employee_status_id: employee.work_employee_status_id || 0,
        before_work_position_id: employee.position?.id || 0,
        before_department_id: employee.department?.id || 0,
        before_work_location_id: employee.work_location?.id || 0,
        before_team_id: employee.team_id ? Number(employee.team_id) : null,
        before_supervisor_id: employee.supervisor_id ? Number(employee.supervisor_id) : null,
        after_employee_status_id: undefined as any,
        after_work_position_id: undefined as any,
        after_department_id: undefined as any,
        after_work_location_id: undefined as any,
        after_team_id: null,
        after_supervisor_id: null,
        note: "",
      });
    }
  }, [isOpen, employee, reset]);

  const onSubmit = async (values: CareerTransitionFormValues) => {
    const payload: CareerTransitionRequest = {
      ...values,
      after_team_id: values.after_team_id || null,
      after_supervisor_id: values.after_supervisor_id || null,
      career_at: format(values.career_at, "yyyy-MM-dd HH:mm:ss"),
    };

    await createCareer(payload);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex flex-col h-full sm:min-w-[50vw] p-0">
        <SheetHeader className="border-b text-left">
          <SheetTitle>Form Transisi Karir</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 overflow-y-auto bg-background">
          <form
            id="career-transition-form"
            onSubmit={handleSubmit(onSubmit, (errors) => console.log("Validation Errors:", errors))}
            className="px-4 py-6 space-y-8"
          >
            <FieldGroup>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  name="career_type_id"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel required>Tipe Transisi</FieldLabel>
                      <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                        <SelectTrigger aria-invalid={fieldState.invalid} disabled={isLoadingCareerTypes}>
                          <SelectValue placeholder="Pilih tipe transisi" />
                        </SelectTrigger>
                        <SelectContent>
                          {careerTypes.map((type: any) => (
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

                <Controller
                  name="career_at"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel required>Tanggal Efektif</FieldLabel>
                      <DatePicker value={field.value} onChange={field.onChange} />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
              </div>

              {/* Transition Mapping */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <HugeiconsIcon icon={InformationCircleIcon} size={18} />
                  <span>PERUBAHAN DETAIL KARIR</span>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  <TransitionFieldRow
                    label="Status Karyawan"
                    beforeValue={statuses.find(s => s.id === Number(employee.work_employee_status_id))?.name || "-"}
                  >
                    <Controller
                      name="after_employee_status_id"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                            <SelectTrigger
                              aria-invalid={fieldState.invalid}
                              className="w-full"
                            >
                              <SelectValue placeholder="Pilih status baru" />
                            </SelectTrigger>

                            <SelectContent>
                              {statuses.map((item) => (
                                <SelectItem key={item.id} value={item.id.toString()}>
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldError errors={[fieldState.error]} />
                        </Field>
                      )}
                    />
                  </TransitionFieldRow>

                  {/* Position */}
                  <TransitionFieldRow
                    label="Jabatan/Posisi"
                    beforeValue={employee.position?.name || "-"}
                  >
                    <Controller
                      name="after_work_position_id"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <WorkPositionPicker
                            value={field.value}
                            onChange={field.onChange}
                          />
                          <FieldError errors={[fieldState.error]} />
                        </Field>
                      )}
                    />
                  </TransitionFieldRow>

                  {/* Department */}
                  <TransitionFieldRow
                    label="Departemen"
                    beforeValue={employee.department?.name || "-"}
                  >
                    <Controller
                      name="after_department_id"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <DepartmentPicker
                            value={field.value}
                            onChange={field.onChange}
                          />
                          <FieldError errors={[fieldState.error]} />
                        </Field>
                      )}
                    />
                  </TransitionFieldRow>

                  {/* Location */}
                  <TransitionFieldRow
                    label="Lokasi Kerja"
                    beforeValue={employee.work_location?.name || "-"}
                  >
                    <Controller
                      name="after_work_location_id"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <WorkLocationPicker
                            value={field.value}
                            onChange={field.onChange}
                          />
                          <FieldError errors={[fieldState.error]} />
                        </Field>
                      )}
                    />
                  </TransitionFieldRow>

                  {/* Team */}
                  <TransitionFieldRow
                    label="Tim (Opsional)"
                    beforeValue={employee.team_id ? "Terdaftar" : "Tanpa Tim"}
                  >
                    <Controller
                      name="after_team_id"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <TeamPicker
                            value={field.value || ""}
                            onChange={field.onChange}
                          />
                          <FieldError errors={[fieldState.error]} />
                        </Field>
                      )}
                    />
                  </TransitionFieldRow>

                  {/* Supervisor */}
                  <TransitionFieldRow
                    label="Atasan Langsung"
                    beforeValue={employee.supervisor?.name || "-"}
                  >
                    <Controller
                      name="after_supervisor_id"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <EmployeePicker
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="Cari atasan..."
                          />
                          <FieldError errors={[fieldState.error]} />
                        </Field>
                      )}
                    />
                  </TransitionFieldRow>
                </div>
              </div>

              <Controller
                name="note"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Catatan Transisi</FieldLabel>
                    <Textarea {...field} placeholder="Berikan alasan atau detail transisi..." value={field.value || ""} />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </ScrollArea>

        <SheetFooter className="border-t justify-end px-4 py-3">
          <Button type="submit" form="career-transition-form" disabled={isSubmitting}>
            {isSubmitting && <HugeiconsIcon icon={Loading03Icon} className="mr-2 h-4 w-4 animate-spin" />}
            Proses Transisi Karir
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

function TransitionFieldRow({
  label,
  beforeValue,
  children
}: {
  label: string;
  beforeValue: string;
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_40px_1fr] items-center gap-2">
        <Input value={beforeValue} readOnly />
        <div className="flex justify-center text-muted-foreground/50">
          <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}
