'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BankIcon,
  Add01Icon,
  Edit01Icon,
  Delete01Icon,
  CreditCardIcon,
  UserIcon,
  InformationCircleIcon,
  ChipIcon
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { useEmployeeDetails, useUpdateEmployeeDetails } from '../../../hooks/use-employee-detail';
import { DetailTabContainer } from './detail-tab-container';
import { HugeiconsIcon } from '@hugeicons/react';
import { EmployeeBank } from '../../../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { bankSchema, BankFormValues } from '../../../schemas';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { cn } from '@/lib/utils';

interface BankTabProps {
  employeeId: string | number;
}

export function BankTab({ employeeId }: BankTabProps) {
  const { items, isLoading, mutate } = useEmployeeDetails(employeeId, 'bank');
  const { update, isLoading: isUpdating } = useUpdateEmployeeDetails(employeeId, 'bank');

  const [isOpen, setIsOpen] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<EmployeeBank | null>(null);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  const { control, handleSubmit, reset } = useForm<BankFormValues>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      bank_name: '',
      account_number: '',
      account_name: '',
    },
  });

  const handleAdd = () => {
    setEditingItem(null);
    reset({
      bank_name: '',
      account_number: '',
      account_name: '',
    });
    setIsOpen(true);
  };

  const handleEdit = (item: EmployeeBank) => {
    setEditingItem(item);
    reset({
      bank_name: item.bank_name,
      account_number: item.account_number,
      account_name: item.account_name,
    });
    setIsOpen(true);
  };

  const handleDeleteRequest = (id: number) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const onSubmit = async (data: BankFormValues) => {
    try {
      let newItems;
      if (editingItem) {
        newItems = items.map((item: any) =>
          item.id === editingItem.id ? { ...data, id: item.id } : {
            id: item.id,
            bank_name: item.bank_name,
            account_number: item.account_number,
            account_name: item.account_name
          }
        );
      } else {
        newItems = [
          ...items.map((item: any) => ({
            id: item.id,
            bank_name: item.bank_name,
            account_number: item.account_number,
            account_name: item.account_name
          })),
          data
        ];
      }

      await update(newItems);
      mutate();
      setIsOpen(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  const onConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      const newItems = items
        .filter((item: any) => item.id !== deletingId)
        .map((item: any) => ({
          id: item.id,
          bank_name: item.bank_name,
          account_number: item.account_number,
          account_name: item.account_name
        }));

      await update(newItems);
      mutate();
      setIsConfirmOpen(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <DetailTabContainer
      title="Rekening Bank"
      icon={BankIcon}
      isLoading={isLoading}
      isEmpty={items.length === 0}
      extra={
        <Button size="sm" className="gap-2" onClick={handleAdd}>
          <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" />
          Tambah Rekening
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item: EmployeeBank) => (
          <div
            key={item.id}
            className={cn(
              "group relative flex flex-col p-6 rounded-3xl border bg-gradient-to-br from-card to-muted/20 hover:border-primary/40 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md",
            )}
          >
            {/* Header: Bank Name and Actions */}
            <div className="flex justify-between items-start mb-8 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                  <HugeiconsIcon icon={BankIcon} className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-2xl font-bold text-foreground tracking-tight uppercase ">
                    {item.bank_name}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full shadow-sm bg-background/80 backdrop-blur-sm"
                  onClick={() => handleEdit(item)}
                >
                  <HugeiconsIcon icon={Edit01Icon} className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full shadow-sm bg-background/80 backdrop-blur-sm text-rose-600 hover:bg-rose-50"
                  onClick={() => handleDeleteRequest(item.id)}
                >
                  <HugeiconsIcon icon={Delete01Icon} className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="mb-8 z-10">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">
                Nomor Rekening
              </p>
              <h3 className="text-xl font-mono font-bold tracking-widest text-foreground">
                {item.account_number}
              </h3>
            </div>

            <div className="flex justify-between items-end z-10">
              <div className="flex flex-col gap-1">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  Pemilik Rekening
                </p>
                <p className="text-sm font-bold text-foreground">
                  {item.account_name}
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-green-500/5 border border-green-500/10 text-green-600">
                <HugeiconsIcon icon={InformationCircleIcon} className="w-3 h-3" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Aktif</span>
              </div>
            </div>

            {/* Subtle background glow */}
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Rekening' : 'Tambah Rekening'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <Controller
              name="bank_name"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel required>Nama Bank</FieldLabel>
                  <Input {...field} placeholder="Contoh: BCA, Mandiri, BNI, dll" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="account_number"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel required>Nomor Rekening</FieldLabel>
                  <Input {...field} placeholder="Masukkan nomor rekening" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="account_name"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel required>Nama Pemilik Rekening</FieldLabel>
                  <Input {...field} placeholder="Masukkan nama sesuai di buku tabungan" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={onConfirmDelete}
        title="Hapus Rekening"
        description="Apakah Anda yakin ingin menghapus data rekening bank ini?"
        confirmText="Hapus"
        variant="destructive"
        isLoading={isUpdating}
      />
    </DetailTabContainer>
  );
}
