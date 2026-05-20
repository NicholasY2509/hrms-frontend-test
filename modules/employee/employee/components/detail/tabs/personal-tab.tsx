'use client';

import * as React from 'react';
import {
  IdCardLanyardIcon,
  Location,
  PrayerRugIcon,
  DropletIcon,
  Home01Icon,
  UserIcon,
  Mail01Icon,
  CallIcon,
  UserCheck01Icon,
  Calendar01Icon,
  Edit01Icon,
  Loading03Icon,
  InformationCircleIcon,
  SaveIcon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DetailItem } from '../detail-items';
import { Employee, EmployeePersonal } from '../../../types';
import { useEmployeeDetails, useUpdateEmployeeDetails } from '../../../hooks/use-employee-detail';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeePersonalSchema, EmployeePersonalFormValues } from '../../../schemas';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';

interface PersonalTabProps {
  employee: Employee;
}

export function PersonalTab({ employee }: PersonalTabProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const { item, isLoading, mutate } = useEmployeeDetails(employee.id, 'personal');
  const { update, isLoading: isUpdating } = useUpdateEmployeeDetails(employee.id, 'personal');

  const personal = item as EmployeePersonal;

  const { control, handleSubmit, reset, watch, setValue, formState: { isDirty } } = useForm<EmployeePersonalFormValues>({
    resolver: zodResolver(employeePersonalSchema),
    defaultValues: {
      full_name: '',
      first_name: '',
      last_name: '',
      phone_number: '',
      handphone: '',
      email: '',
      gender_id: undefined,
      marital_status_id: undefined,
      id_card_number: '',
      religion_id: undefined,
      blood_group_id: undefined,
      place_birth: '',
      date_birth: '',
      current_address: '',
      residence_address: '',
    },
  });

  const firstName = watch('first_name');
  const lastName = watch('last_name');

  React.useEffect(() => {
    const fullName = `${firstName || ''} ${lastName || ''}`.trim();
    setValue('full_name', fullName, { shouldDirty: true });
  }, [firstName, lastName, setValue]);

  React.useEffect(() => {
    if (personal) {
      reset({
        full_name: personal.full_name || '',
        first_name: personal.first_name || '',
        last_name: personal.last_name || '',
        phone_number: personal.phone_number || '',
        handphone: personal.handphone || personal.phone_number || '',
        email: personal.email || '',
        gender_id: personal.gender?.id,
        marital_status_id: personal.marital_status?.id,
        id_card_number: personal.id_card_number || '',
        religion_id: personal.religion?.id,
        blood_group_id: personal.blood_group?.id,
        place_birth: personal.birth_place || personal.place_birth || '',
        date_birth: personal.birth_date || personal.date_birth || '',
        current_address: personal.current_address || '',
        residence_address: personal.residence_address || '',
      });
    }
  }, [personal, reset]);

  const onSubmit = async (data: EmployeePersonalFormValues) => {
    try {
      await update(data);
      setIsEditing(false);
      mutate();
    } catch (error) {
      // Error handled by hook
    }
  };

  if (isLoading) {
    return <Skeleton className="h-[600px] w-full rounded-xl" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={UserIcon} className="w-5 h-5 text-primary" />
            Personal Data
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
                onClick={handleSubmit(onSubmit, (errors) => console.log('Validation Errors:', errors))}
                disabled={isUpdating || !isDirty}
              >
                {isUpdating ? (
                  <HugeiconsIcon icon={Loading03Icon} className="w-4 h-4 animate-spin" />
                ) : (
                  <HugeiconsIcon icon={SaveIcon} className="w-4 h-4" />
                )}
                Simpan
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Contact Information */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
            <HugeiconsIcon icon={Mail01Icon} className="w-4 h-4 text-primary" />
            Informasi Kontak
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
            {!isEditing ? (
              <>
                <DetailItem
                  icon={Mail01Icon}
                  label="Email Pribadi"
                  value={personal?.email || '-'}
                />
                <DetailItem
                  icon={CallIcon}
                  label="Nomor Telepon"
                  value={personal?.handphone || personal?.phone_number || '-'}
                />
              </>
            ) : (
              <>
                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Email Pribadi</FieldLabel>
                      <Input {...field} value={field.value || ''} placeholder="email@gmail.com" />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  name="handphone"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel required>Nomor Telepon</FieldLabel>
                      <Input {...field} value={field.value || ''} placeholder="0812..." />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
              </>
            )}
          </div>
        </div>

        {/* Personal Details */}
        <div className="pt-6 border-t space-y-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
            <HugeiconsIcon icon={UserIcon} className="w-4 h-4 text-primary" />
            Data Pribadi
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
            {!isEditing ? (
              <>
                <DetailItem
                  icon={UserIcon}
                  label="Nama Lengkap"
                  value={personal?.full_name || '-'}
                />
                <DetailItem
                  icon={UserIcon}
                  label="Nama Depan"
                  value={personal?.first_name || '-'}
                />
                <DetailItem
                  icon={UserIcon}
                  label="Nama Belakang"
                  value={personal?.last_name || '-'}
                />
                <DetailItem
                  icon={UserCheck01Icon}
                  label="Jenis Kelamin"
                  value={personal?.gender?.name || '-'}
                />
                <DetailItem
                  icon={UserCheck01Icon}
                  label="Status Pernikahan"
                  value={personal?.marital_status?.name || '-'}
                />
                <DetailItem
                  icon={Location}
                  label="Tempat Lahir"
                  value={personal?.birth_place || personal?.place_birth || '-'}
                />
                <DetailItem
                  icon={Calendar01Icon}
                  label="Tanggal Lahir"
                  value={(personal?.birth_date || personal?.date_birth) ? format(new Date(personal?.birth_date || personal?.date_birth || ''), 'dd MMMM yyyy', { locale: idLocale }) : '-'}
                />
              </>
            ) : (
              <>
                <Controller
                  name="full_name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel required>Nama Lengkap</FieldLabel>
                      <Input {...field} value={field.value || ''} placeholder="Nama Lengkap" disabled />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  name="first_name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel required>Nama Depan</FieldLabel>
                      <Input {...field} value={field.value || ''} placeholder="Nama Depan" />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  name="last_name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Nama Belakang</FieldLabel>
                      <Input {...field} value={field.value || ''} placeholder="Nama Belakang" />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  name="gender_id"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel required>Jenis Kelamin</FieldLabel>
                      <Select value={field.value?.toString()} onValueChange={(val) => field.onChange(Number(val))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Jenis Kelamin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Laki-Laki</SelectItem>
                          <SelectItem value="2">Perempuan</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  name="marital_status_id"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel required>Status Pernikahan</FieldLabel>
                      <Select value={field.value?.toString()} onValueChange={(val) => field.onChange(Number(val))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Menikah</SelectItem>
                          <SelectItem value="2">Lajang</SelectItem>
                          <SelectItem value="3">Duda</SelectItem>
                          <SelectItem value="4">Janda</SelectItem>
                          <SelectItem value="5">Bercerai</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  name="place_birth"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel required>Tempat Lahir</FieldLabel>
                      <Input {...field} value={field.value || ''} placeholder="Kota" />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  name="date_birth"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel required>Tanggal Lahir</FieldLabel>
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
        </div>

        {/* Identity & Documents */}
        <div className="pt-6 border-t space-y-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
            <HugeiconsIcon icon={IdCardLanyardIcon} className="w-4 h-4 text-primary" />
            Identitas & Dokumen
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
            {!isEditing ? (
              <>
                <DetailItem
                  icon={IdCardLanyardIcon}
                  label="Nomor KTP"
                  value={personal?.id_card_number || '-'}
                />
                <DetailItem
                  icon={PrayerRugIcon}
                  label="Agama"
                  value={personal?.religion?.name || '-'}
                />
                <DetailItem
                  icon={DropletIcon}
                  label="Golongan Darah"
                  value={personal?.blood_group?.name || '-'}
                />
              </>
            ) : (
              <>
                <Controller
                  name="id_card_number"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel required>Nomor KTP</FieldLabel>
                      <Input {...field} value={field.value || ''} placeholder="Nomor KTP" />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  name="religion_id"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel required>Agama</FieldLabel>
                      <Select value={field.value?.toString()} onValueChange={(val) => field.onChange(Number(val))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Agama" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Islam</SelectItem>
                          <SelectItem value="2">Kristen</SelectItem>
                          <SelectItem value="3">Hindu</SelectItem>
                          <SelectItem value="4">Buddha</SelectItem>
                          <SelectItem value="5">Konghucu</SelectItem>
                          <SelectItem value='7'>Katolik</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  name="blood_group_id"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel required>Golongan Darah</FieldLabel>
                      <Select value={field.value?.toString()} onValueChange={(val) => field.onChange(Number(val))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Golongan Darah" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">0</SelectItem>
                          <SelectItem value="2">A</SelectItem>
                          <SelectItem value="3">B</SelectItem>
                          <SelectItem value="4">AB</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
              </>
            )}
          </div>
        </div>

        {/* Address & Domicile */}
        <div className="pt-6 border-t space-y-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
            <HugeiconsIcon icon={Home01Icon} className="w-4 h-4 text-primary" />
            Alamat & Domisili
          </div>
          <div className="grid grid-cols-1 gap-6">
            {!isEditing ? (
              <>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Alamat Sekarang</p>
                  <div className="text-sm border p-3 rounded-md bg-muted/30">
                    {personal?.current_address || '-'}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Alamat Domisili (KTP)</p>
                  <div className="text-sm border p-3 rounded-md bg-muted/30">
                    {personal?.residence_address || '-'}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Controller
                  name="current_address"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel required>Alamat Sekarang</FieldLabel>
                      <Textarea {...field} value={field.value || ''} placeholder="Alamat Lengkap" className="min-h-[100px] resize-none" />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  name="residence_address"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel required>Alamat Domisili (KTP)</FieldLabel>
                      <Textarea {...field} value={field.value || ''} placeholder="Alamat Lengkap" className="min-h-[100px] resize-none" />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
