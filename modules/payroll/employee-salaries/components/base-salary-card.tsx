'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HugeiconsIcon } from '@hugeicons/react';
import { BankIcon, History, PlusSignIcon, Loading03Icon, Calendar01Icon, Note01Icon } from '@hugeicons/core-free-icons';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NumericFormat } from 'react-number-format';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useEmployeeSalaryHistory, useUpdateEmployeeSalary } from '../hooks/use-employee-salary';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { DetailTabContainer } from '@/modules/employee/employee/components/detail/tabs/detail-tab-container';
import { EmployeeSalaryFormValues, employeeSalarySchema } from '../schemas/employee-salary-schema';

interface BaseSalaryCardProps {
  employeeId: number;
}

export function BaseSalaryCard({ employeeId }: BaseSalaryCardProps) {
  const { items, isLoading, mutate } = useEmployeeSalaryHistory(employeeId);
  const { updateSalary, isLoading: isUpdating } = useUpdateEmployeeSalary({
    onSuccess: () => mutate()
  });
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const { control, handleSubmit, reset } = useForm<EmployeeSalaryFormValues>({
    resolver: zodResolver(employeeSalarySchema) as any,
    defaultValues: {
      employee_id: employeeId,
      bpjs_base_amount: 0,
      actual_base_amount: 0,
      effective_date: new Date().toISOString().split('T')[0],
      reason: '',
    },
  });

  const onSubmit = async (data: EmployeeSalaryFormValues) => {
    try {
      await updateSalary(data);
      setIsDialogOpen(false);
      reset();
    } catch (error) {
      // Error handled by hook
    }
  };

  const currencyFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });

  const latestSalary = items?.[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <HugeiconsIcon icon={BankIcon} className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight">Gaji Pokok & Dasar BPJS</span>
            <span className="text-xs font-medium text-muted-foreground">Riwayat perubahan gaji pokok dan komponen dasar BPJS</span>
          </div>
        </div>
        <Button size="sm" className="gap-2 rounded-lg" onClick={() => setIsDialogOpen(true)}>
          <HugeiconsIcon icon={PlusSignIcon} className="w-4 h-4" />
          Update Gaji
        </Button>
      </div>

      <div className="space-y-8">
        {/* Highlight Section */}
        {latestSalary && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-muted/30 border border-dashed">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Gaji Pokok Terakhir</p>
              <p className="text-2xl font-black text-primary">
                {currencyFormatter.format(latestSalary.actual_base_amount)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Dasar BPJS Terakhir</p>
              <p className="text-2xl font-black text-foreground/80">
                {currencyFormatter.format(latestSalary.bpjs_base_amount)}
              </p>
            </div>
          </div>
        )}

        {/* History Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground/80">
            <HugeiconsIcon icon={History} className="w-4 h-4 text-primary" />
            Riwayat Perubahan Gaji
          </div>
          <div className="rounded-2xl border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider">Tgl Efektif</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider">Gaji Pokok</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider">Dasar BPJS</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider">Alasan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium text-xs">
                      {format(new Date(item.effective_date), 'dd MMM yyyy', { locale: idLocale })}
                    </TableCell>
                    <TableCell className="text-xs font-semibold">{currencyFormatter.format(item.actual_base_amount)}</TableCell>
                    <TableCell className="text-xs">{currencyFormatter.format(item.bpjs_base_amount)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground italic">{item.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Gaji Pokok</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="actual_base_amount"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name} required>Gaji Pokok</FieldLabel>
                    <NumericFormat
                      customInput={Input}
                      id={field.name}
                      prefix="Rp "
                      value={field.value}
                      onValueChange={(values) => field.onChange(values.floatValue ?? '')}
                      thousandSeparator="."
                      decimalSeparator=","
                      placeholder="Rp 0"
                      allowNegative={false}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                name="bpjs_base_amount"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name} required>Dasar BPJS</FieldLabel>
                    <NumericFormat
                      customInput={Input}
                      id={field.name}
                      prefix="Rp "
                      value={field.value}
                      onValueChange={(values) => field.onChange(values.floatValue ?? '')}
                      thousandSeparator="."
                      decimalSeparator=","
                      placeholder="Rp 0"
                      allowNegative={false}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>

            <Controller
              name="effective_date"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name} required>Tanggal Efektif</FieldLabel>
                  <Input {...field} type="date" id={field.name} />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="reason"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name} required>Alasan Perubahan</FieldLabel>
                  <Input {...field} id={field.name} placeholder="Contoh: Kenaikan Tahunan, Promosi" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isUpdating}>
                Batal
              </Button>
              <Button type="submit" className="gap-2" disabled={isUpdating}>
                {isUpdating ? (
                  <HugeiconsIcon icon={Loading03Icon} className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <HugeiconsIcon icon={PlusSignIcon} className="w-4 h-4" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
