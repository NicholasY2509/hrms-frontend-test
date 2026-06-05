'use client';

import {
  InformationCircleIcon,
  Briefcase01Icon,
  HierarchyIcon,
  Location01Icon,
  Calendar01Icon,
  UserGroupIcon,
  Tick01Icon,
  Edit01Icon,
  UserIcon,
  Mail01Icon,
  Task01Icon,
  LicenseIcon,
  IdCardLanyardIcon,
  UserCheck01Icon,
  Loading03Icon,
  Cancel01Icon,
  CircleCheck,
  Save
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DetailItem } from '../detail-items';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeOverviewSchema, EmployeeOverviewFormValues } from '../../../schemas';
import { useEmployeeDetails, useUpdateEmployeeDetails } from '../../../hooks/use-employee-detail';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { DepartmentPicker } from '@/modules/organization/department/components/department-picker';
import { WorkPositionPicker } from '@/modules/organization/work-position/components/work-position-picker';
import { WorkLocationPicker } from '@/modules/organization/work-location/components/work-location-picker';
import { TeamPicker } from '@/modules/organization/teams/components/team-picker';
import { EmployeePicker } from '@/modules/employee/employee/components/employee-picker';
import { EmployeeStatusPicker } from '@/modules/employee/employee/components/employee-status-picker';
import { DatePicker } from '@/components/ui/date-picker';
import { toast } from 'sonner';
import { Employee, EmployeeOverview } from '../../../types';
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { EmployeeLeaveLedgerSheet } from '@/modules/employee/annual-leave/components/employee-leave-ledger-sheet';

interface OverviewTabProps {
  employee: Employee;
}

export function OverviewTab({ employee }: OverviewTabProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const { item, isLoading: isLoadingDetails, mutate } = useEmployeeDetails(employee.id, 'overview');
  const { update, isLoading: isUpdating } = useUpdateEmployeeDetails(employee.id, 'overview');

  const overview = item as EmployeeOverview;

  const [isToggling, setIsToggling] = React.useState(false);
  const [isLedgerOpen, setIsLedgerOpen] = React.useState(false);

  const handleToggleAnnualLeave = async (checked: boolean) => {
    setIsToggling(true);
    try {
      await update({ is_get_annual_leaves: checked });
      await mutate();
    } catch (error) {
      // Error handled by hook toast
    } finally {
      setIsToggling(false);
    }
  };

  const { control, handleSubmit, reset, formState: { isDirty } } = useForm<EmployeeOverviewFormValues>({
    resolver: zodResolver(employeeOverviewSchema),
    defaultValues: {
      employee_id_number: '',
      initial_name: '',
      company_email: '',
      work_position_id: undefined,
      department_id: undefined,
      team_id: null,
      work_location_id: undefined,
      employee_status_id: undefined,
      work_employee_status_id: undefined,
      join_date: '',
    },
  });

  React.useEffect(() => {
    if (overview) {
      reset({
        employee_id_number: overview.employee_id_number || '',
        initial_name: overview.initial || '',
        company_email: overview.company_email || '',
        work_position_id: overview.position?.id,
        department_id: overview.department?.id,
        team_id: overview.team?.id,
        work_location_id: overview.work_location?.id,
        employee_status_id: overview.employee_status?.id,
        work_employee_status_id: overview.work_employee_status?.id,
        join_date: employee.join_date || '',
      });
    }
  }, [overview, employee.join_date, reset]);

  const onSubmit = async (data: EmployeeOverviewFormValues) => {
    try {
      await update(data);
      setIsEditing(false);
      mutate();
    } catch (error) {
      // Error handled by hook
    }
  };

  if (isLoadingDetails) {
    return <Skeleton className="h-[600px] w-full rounded-xl" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={InformationCircleIcon} className="w-5 h-5 text-primary" />
            Overview
          </div>
          {!isEditing ? (
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditing(true)}>
              <HugeiconsIcon icon={Edit01Icon} className="w-4 h-4" />
              Edit
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  reset();
                }}
                disabled={isUpdating}
              >
                Batal
              </Button>
              <Button
                size="sm"
                className="gap-2"
                onClick={handleSubmit(onSubmit)}
                disabled={isUpdating || !isDirty}
              >
                {isUpdating ? (
                  <HugeiconsIcon icon={Loading03Icon} className="w-4 h-4 animate-spin" />
                ) : (
                  <HugeiconsIcon icon={Save} className="w-4 h-4" />
                )}
                Simpan
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Main Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
          {!isEditing ? (
            <>
              <DetailItem
                icon={IdCardLanyardIcon}
                label="Nomor Induk Karyawan"
                value={overview?.employee_id_number}
              />
              <DetailItem
                icon={UserIcon}
                label="Inisial"
                value={overview?.initial || '-'}
              />
              <DetailItem
                icon={Mail01Icon}
                label="Email Perusahaan"
                value={overview?.company_email || '-'}
              />
              <DetailItem
                icon={Briefcase01Icon}
                label="Jabatan"
                value={overview?.position?.name}
              />
              <DetailItem
                icon={HierarchyIcon}
                label="Departemen"
                value={overview?.department?.name}
              />
              <DetailItem
                icon={UserGroupIcon}
                label="Tim"
                value={overview?.team?.name || '-'}
              />
              <DetailItem
                icon={Location01Icon}
                label="Lokasi Kerja"
                value={overview?.work_location?.name}
              />
              <DetailItem
                icon={LicenseIcon}
                label="Status Karyawan"
                value={overview?.employee_status?.name}
              />
              <DetailItem
                icon={UserCheck01Icon}
                label="Status Kerja"
                value={overview?.work_employee_status?.name}
              />
              <DetailItem
                icon={Calendar01Icon}
                label="Tanggal Bergabung"
                value={employee.join_date ? format(new Date(employee.join_date), 'dd MMMM yyyy', { locale: idLocale }) : '-'}
              />
            </>
          ) : (
            <>
              <Controller
                name="employee_id_number"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel required>Nomor Induk Karyawan</FieldLabel>
                    <Input {...field} placeholder="Contoh: 12345" />
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
                name="work_position_id"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel required>Jabatan</FieldLabel>
                    <WorkPositionPicker value={field.value} onChange={field.onChange} />
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
                    <DepartmentPicker value={field.value} onChange={field.onChange} />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
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
              <Controller
                name="work_employee_status_id"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel required>Status Kerja</FieldLabel>
                    <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder="Pilih Status Kerja" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Aktif</SelectItem>
                        <SelectItem value="2">Resign</SelectItem>
                        <SelectItem value="3">Non-Aktif</SelectItem>
                      </SelectContent>

                    </Select>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
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
            </>
          )}
        </div>

        {/* Leave Information Section */}
        <div className="pt-6 border-t space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
              <HugeiconsIcon icon={Calendar01Icon} className="w-4 h-4 text-primary" />
              Informasi Sisa Cuti
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsLedgerOpen(true)}>
              <HugeiconsIcon icon={Calendar01Icon} className="w-4 h-4" />
              Detail Mutasi
            </Button>
          </div>

          {/* Toggle Banner */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/40 transition-colors duration-200">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-foreground">Hak Cuti Tahunan</h4>
              <p className="text-xs text-muted-foreground">
                Ketika diaktfikan, karyawan akan mulai mendapatkan hak cuti setiap bulannnya.
              </p>
            </div>
            <div className="flex items-center">
              <Switch
                checked={overview?.is_get_annual_leaves ?? false}
                onCheckedChange={handleToggleAnnualLeave}
                disabled={isToggling}
                size="default"
                className="scale-110 sm:scale-125 origin-right transition-transform"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Cuti Tahun Lalu ({new Date().getFullYear() - 1})</span>
              <span className="text-lg font-bold">{overview?.annual_leave_2 || 0} <span className="text-sm font-medium text-muted-foreground ml-0.5">Hari</span></span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Cuti Tahun Ini ({new Date().getFullYear()})</span>
              <span className="text-lg font-bold text-primary">{overview?.annual_leave_3 || 0} <span className="text-sm font-medium text-muted-foreground ml-0.5">Hari</span></span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Total Sisa Cuti</span>
              <span className={`text-lg font-bold ${((overview?.annual_leave_2 || 0) + (overview?.annual_leave_3 || 0)) < 0 ? 'text-rose-600' : 'text-orange-600'}`}>
                {(overview?.annual_leave_2 || 0) + (overview?.annual_leave_3 || 0)}
                <span className="text-sm font-medium text-muted-foreground ml-0.5">Hari</span>
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <EmployeeLeaveLedgerSheet
        employeeId={employee.id}
        employeeName={employee.name}
        open={isLedgerOpen}
        onOpenChange={setIsLedgerOpen}
      />
    </Card>
  );
}
