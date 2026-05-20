'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UserForm } from './user-form';
import { UserModel } from '../types';
import { UserFormValues } from '../schemas/user-schema';
import { useCreateUser, useUpdateUser } from '../hooks/use-user-mutation';

interface UserFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserModel | null;
  onSuccess?: () => void;
}

export function UserFormDialog({
  isOpen,
  onClose,
  user,
  onSuccess,
}: UserFormDialogProps) {
  const isEdit = !!user;

  const { createUser, isLoading: isCreating } = useCreateUser({
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
  });

  const { updateUser, isLoading: isUpdating } = useUpdateUser({
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
  });

  const handleSubmit = async (values: UserFormValues) => {
    const payload = { ...values };
    if (!payload.password) {
      delete payload.password;
      delete payload.password_confirmation;
    }

    if (isEdit && user) {
      await updateUser({ id: user.id, data: payload });
    } else {
      await createUser(payload);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Ubah Data Pengguna' : 'Tambah Pengguna Baru'}
          </DialogTitle>
        </DialogHeader>
        <div className="">
          <UserForm
            initialData={user || undefined}
            onSubmit={handleSubmit}
            isLoading={isCreating || isUpdating}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
