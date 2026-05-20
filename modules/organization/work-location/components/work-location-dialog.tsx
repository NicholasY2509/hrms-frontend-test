'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { WorkLocationForm } from './work-location-form';
import { WorkLocation } from '../types';

interface WorkLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: WorkLocation | null;
}

export function WorkLocationDialog({ open, onOpenChange, initialData }: WorkLocationDialogProps) {
  const isEdit = !!initialData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Lokasi Kerja' : 'Tambah Lokasi Kerja'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Perbarui informasi lokasi kerja di bawah ini.'
              : 'Isi formulir di bawah ini untuk menambahkan lokasi kerja baru.'}
          </DialogDescription>
        </DialogHeader>
        <WorkLocationForm
          initialData={initialData}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
