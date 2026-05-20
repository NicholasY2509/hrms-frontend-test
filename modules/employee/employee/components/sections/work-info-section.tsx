"use client";

import * as React from 'react';
import { Control, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { Loading03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { cn } from '@/lib/utils';

import { DepartmentPicker } from '@/modules/organization/department/components/department-picker';
import { WorkPositionPicker } from '@/modules/organization/work-position/components/work-position-picker';
import { WorkLocationPicker } from '@/modules/organization/work-location/components/work-location-picker';
import { TeamPicker } from '@/modules/organization/teams/components/team-picker';
import { EmployeeStatusPicker } from '@/modules/employee/employee/components/employee-status-picker';

import { CreateEmployeeFormValues } from '../../schemas';

interface WorkInfoSectionProps {
  control: Control<CreateEmployeeFormValues>;
  isGeneratingNik?: boolean;
}

export function WorkInfoSection({ control, isGeneratingNik }: WorkInfoSectionProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4">
        <Controller
          name="join_date"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel required>Tanggal Bergabung</FieldLabel>
              <DatePicker
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="initial_name"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Inisial</FieldLabel>
              <Input {...field} value={field.value || ''} placeholder="Contoh: JD" />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="company_email"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Email Perusahaan</FieldLabel>
              <Input {...field} value={field.value || ''} placeholder="email@perusahaan.com" />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="department_id"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel required>Departemen</FieldLabel>
              <DepartmentPicker value={field.value} onChange={field.onChange} className="bg-background" />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <div className='flex flex-row items-center gap-2'>
          <Controller
            name="work_position_id"
            control={control}
            render={({ field, fieldState }) => (
              <Field className='w-full'>
                <FieldLabel required>Jabatan</FieldLabel>
                <WorkPositionPicker value={field.value} onChange={field.onChange} className="bg-background" />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            name="employee_id_number"
            control={control}
            render={({ field, fieldState }) => (
              <Field className='w-1/2'>
                <FieldLabel required>NIK</FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={"XXXXXX"}
                    className={cn(
                      "bg-background font-mono font-medium tracking-wider",
                      isGeneratingNik && "pr-10 text-muted-foreground animate-pulse",
                      field.value && !isGeneratingNik && "border-primary/30 text-primary bg-primary/2"
                    )}
                    readOnly
                  />
                  {isGeneratingNik && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <HugeiconsIcon icon={Loading03Icon} className="w-4 h-4 animate-spin text-primary" />
                    </div>
                  )}
                </div>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>

        <Controller
          name="team_id"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Tim</FieldLabel>
              <TeamPicker value={field.value} onChange={field.onChange} />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="work_location_id"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel required>Lokasi Kerja</FieldLabel>
              <WorkLocationPicker value={field.value} onChange={field.onChange} />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="employee_status_id"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel required>Status Karyawan</FieldLabel>
              <EmployeeStatusPicker value={field.value} onChange={field.onChange} />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </div>
    </div>
  );
}
