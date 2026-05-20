'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HugeiconsIcon } from '@hugeicons/react';
import { Briefcase01Icon, PlusSignIcon, Delete01Icon, Loading03Icon, Calendar01Icon, Tag01Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

import { useSalaryComponents } from '../../salary-components/hooks';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DetailTabContainer } from '@/modules/employee/employee/components/detail/tabs/detail-tab-container';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { useAssignEmployeeSalaryComponent, useEmployeeSalaryComponents, useRemoveEmployeeSalaryComponent } from '../hooks/use-emplyoee-salary-component';
import { EmployeeSalaryComponentFormValues } from '../types';
import { employeeSalaryComponentSchema } from '../schemas/employee-salary-component-schema';

interface SalaryComponentsCardProps {
  employeeId: number;
}

export function SalaryComponentsCard({ employeeId }: SalaryComponentsCardProps) {
  const { items, isLoading, mutate } = useEmployeeSalaryComponents(employeeId);
  const { items: allComponents } = useSalaryComponents({ is_active: true });

  const { assignComponent, isLoading: isAssigning } = useAssignEmployeeSalaryComponent({
    onSuccess: () => mutate()
  });

  const { removeComponent, isLoading: isRemoving } = useRemoveEmployeeSalaryComponent({
    onSuccess: () => mutate()
  });
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  const { control, handleSubmit, reset, watch, setValue } = useForm<EmployeeSalaryComponentFormValues>({
    resolver: zodResolver(employeeSalaryComponentSchema) as any,
    defaultValues: {
      employee_id: employeeId,
      salary_component_id: 0,
      amount: 0,
      effective_date: new Date().toISOString().split('T')[0],
      is_calculated: false,
    },
  });

  const selectedComponentId = watch('salary_component_id');

  React.useEffect(() => {
    if (selectedComponentId) {
      const comp = allComponents.find(c => c.id === Number(selectedComponentId));
      if (comp) {
        setValue('amount', comp.default_amount);
      }
    }
  }, [selectedComponentId, allComponents, setValue]);

  const onSubmit = async (data: EmployeeSalaryComponentFormValues) => {
    try {
      await assignComponent(data);
      setIsDialogOpen(false);
      reset();
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await removeComponent({ id: deletingId, employeeId });
      setIsConfirmOpen(false);
      setDeletingId(null);
    } catch (error) {
      // Error handled by hook
    }
  };

  const currencyFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <HugeiconsIcon icon={Briefcase01Icon} className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight">Komponen Gaji Khusus (Overrides)</span>
            <span className="text-xs font-medium text-muted-foreground">Komponen gaji tambahan atau potongan khusus untuk karyawan ini</span>
          </div>
        </div>
        <Button size="sm" className="gap-2 rounded-lg" onClick={() => setIsDialogOpen(true)}>
          <HugeiconsIcon icon={PlusSignIcon} className="w-4 h-4" />
          Tambah Komponen
        </Button>
      </div>

      <div className="rounded-2xl border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-[10px] font-bold uppercase tracking-wider">Komponen</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-wider">Kategori</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-wider">Nominal</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-wider">Tgl Efektif</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-wider text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/30 transition-colors group">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm leading-tight">{item.salary_component?.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">{item.salary_component?.code}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={item.salary_component?.category === 'allowance' ? 'success' : item.salary_component?.category === 'deduction' ? 'destructive' : 'outline'} className="text-[10px] uppercase font-bold tracking-wider">
                    {item.salary_component?.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  {item.is_calculated ? (
                    <Badge variant="secondary" className="gap-1.5 py-0.5">
                      <HugeiconsIcon icon={Tag01Icon} className="w-3 h-3" />
                      Calculated
                    </Badge>
                  ) : (
                    <span className="text-sm font-semibold">{currencyFormatter.format(item.amount)}</span>
                  )}
                </TableCell>
                <TableCell className="text-xs font-medium text-muted-foreground">
                  {format(new Date(item.effective_date), 'dd MMM yyyy', { locale: idLocale })}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      setDeletingId(item.id);
                      setIsConfirmOpen(true);
                    }}
                    disabled={isRemoving}
                  >
                    <HugeiconsIcon icon={Delete01Icon} className="w-3.5 h-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Belum ada komponen gaji khusus (overrides) untuk karyawan ini.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tambah Komponen Gaji Karyawan</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            <Controller
              name="salary_component_id"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name} required>Pilih Komponen</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value.toString()}>
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder="Pilih Komponen" />
                    </SelectTrigger>
                    <SelectContent>
                      {allComponents.map(comp => (
                        <SelectItem key={comp.id} value={comp.id.toString()}>
                          {comp.name} ({comp.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="amount"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name} required>Nominal</FieldLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">Rp</span>
                    <Input {...field} type="number" id={field.name} className="pl-9" placeholder="0" />
                  </div>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

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
              name="is_calculated"
              control={control}
              render={({ field }) => (
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="is_calculated"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <label
                    htmlFor="is_calculated"
                    className="text-xs font-bold leading-none text-muted-foreground cursor-pointer"
                  >
                    Gunakan Rumus Kalkulasi (Jika ada)
                  </label>
                </div>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isAssigning}>
                Batal
              </Button>
              <Button type="submit" className="gap-2" disabled={isAssigning}>
                {isAssigning ? (
                  <HugeiconsIcon icon={Loading03Icon} className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <HugeiconsIcon icon={PlusSignIcon} className="w-4 h-4" />
                    Simpan Komponen
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Komponen Gaji"
        description="Apakah Anda yakin ingin menghapus komponen gaji khusus ini dari karyawan? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        variant="destructive"
        isLoading={isRemoving}
      />
    </div>
  );
}

