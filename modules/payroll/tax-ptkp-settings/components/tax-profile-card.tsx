'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HugeiconsIcon } from '@hugeicons/react';
import { Note01Icon, SaveIcon, Edit01Icon, Loading03Icon, Mail01Icon, CreditCardIcon, Layers01Icon, PercentSquareIcon } from '@hugeicons/core-free-icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { taxProfileSchema, TaxProfileFormValues } from '@/modules/employee/employee/schemas';
import { useEmployeeDetails, useUpdateEmployeeDetails } from '@/modules/employee/employee/hooks/use-employee-detail';
import { Skeleton } from '@/components/ui/skeleton';
import { DetailItem } from '@/modules/employee/employee/components/detail/detail-items';
import { TaxProfile } from '@/modules/employee/employee/types';
import { useTaxPtkpSettings } from '../hooks/use-tax-ptkp-settings';

interface TaxProfileCardProps {
  employeeId: number;
}

export function TaxProfileCard({ employeeId }: TaxProfileCardProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const { item, isLoading, mutate } = useEmployeeDetails(employeeId, 'tax-profile');
  const { update, isLoading: isUpdating } = useUpdateEmployeeDetails(employeeId, 'tax-profile');
  const { items: ptkpSettings } = useTaxPtkpSettings();

  const taxProfile = item as TaxProfile;

  const { control, handleSubmit, reset, formState: { isDirty } } = useForm<TaxProfileFormValues>({
    resolver: zodResolver(taxProfileSchema),
    defaultValues: {
      npwp_number: '',
      ptkp_setting_id: null,
      tax_method: 'gross',
    },
  });

  React.useEffect(() => {
    if (taxProfile) {
      reset({
        npwp_number: taxProfile.npwp_number || '',
        ptkp_setting_id: taxProfile.ptkp_setting?.id ?? taxProfile.ptkp_setting_id,
        tax_method: taxProfile.tax_method,
      });
    }
  }, [taxProfile, reset]);

  const onSubmit = async (data: TaxProfileFormValues) => {
    try {
      await update(data);
      setIsEditing(false);
      mutate();
    } catch (error) {
      // Error handled by hook
    }
  };

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full rounded-xl" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <HugeiconsIcon icon={Note01Icon} className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight">Profil Pajak (PPh 21)</span>
            <span className="text-xs font-medium text-muted-foreground">Informasi perpajakan dan status PTKP karyawan</span>
          </div>
        </div>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <HugeiconsIcon icon={Edit01Icon} className="w-4 h-4" />
            Edit Profil
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
              onClick={handleSubmit(onSubmit)}
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-4">
        {!isEditing ? (
          <>
            <DetailItem
              icon={CreditCardIcon}
              label="Nomor NPWP"
              value={taxProfile?.npwp_number || '-'}
            />
            <DetailItem
              icon={Note01Icon}
              label="Kategori PTKP"
              value={`TER ${taxProfile?.ptkp_setting?.ter_category?.name || '-'} - ${taxProfile?.ptkp_setting?.code}` || '-'}
            />
            <DetailItem
              icon={PercentSquareIcon}
              label="Metode Pajak"
              value={taxProfile?.tax_method === 'gross' ? 'Gross' : taxProfile?.tax_method === 'gross_up' ? 'Gross Up' : 'Net'}
            />
          </>
        ) : (
          <>
            <Controller
              name="npwp_number"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Nomor NPWP</FieldLabel>
                  <Input {...field} value={field.value || ''} id={field.name} placeholder="Contoh: 12.345.678.9-012.345" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="ptkp_setting_id"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name} required>Kategori PTKP</FieldLabel>
                  <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {ptkpSettings.map((ptkp: any) => (
                        <SelectItem key={ptkp.id} value={ptkp.id.toString()}>
                          TER {ptkp.ter_category} - {ptkp.code} ({ptkp.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="tax_method"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name} required>Metode Pajak</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder="Pilih Metode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gross">Gross (Pajak ditanggung Karyawan)</SelectItem>
                      <SelectItem value="gross_up">Gross Up (Tunjangan Pajak)</SelectItem>
                      <SelectItem value="net">Net (Pajak ditanggung Perusahaan)</SelectItem>
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
  );
}
