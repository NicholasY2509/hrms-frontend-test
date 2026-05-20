'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { EmployeePicker } from '@/modules/employee/employee/components/employee-picker';
import { useCreateSupervisor, useUpdateSupervisor } from '@/modules/employee/supervisor/hooks/use-supervisor-mutation';
import { SupervisorModel } from '@/modules/employee/supervisor/types';

interface SupervisorFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  supervisor: SupervisorModel | null;
  onSuccess?: () => void;
}

export function SupervisorFormDialog({
  isOpen,
  onClose,
  supervisor,
  onSuccess,
}: SupervisorFormDialogProps) {
  const [employeeId, setEmployeeId] = React.useState<number | null>(null);
  const isEdit = !!supervisor;

  const { createSupervisor, isLoading: isCreating } = useCreateSupervisor({
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
  });

  const { updateSupervisor, isLoading: isUpdating } = useUpdateSupervisor({
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      setEmployeeId(supervisor?.employee_id || null);
    }
  }, [isOpen, supervisor]);

  const handleSubmit = async () => {
    if (!employeeId) return;

    if (isEdit && supervisor) {
      await updateSupervisor({ id: supervisor.id, data: { employee_id: employeeId } });
    } else {
      await createSupervisor({ employee_id: employeeId });
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Ubah Data Atasan' : 'Tambah Atasan Baru'}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <Field>
            <FieldLabel required>Pilih Karyawan</FieldLabel>
            <EmployeePicker
              value={employeeId}
              onChange={setEmployeeId}
              placeholder="Cari karyawan..."
            />
            {!employeeId && <p className="text-[10px] text-muted-foreground mt-1 italic">* Karyawan ini akan didaftarkan sebagai atasan/SPV yang bisa dipilih oleh karyawan lain.</p>}
          </Field>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={!employeeId || isLoading}>
            {isLoading ? 'Mohon Tunggu...' : (isEdit ? 'Simpan Perubahan' : 'Daftarkan Atasan')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
