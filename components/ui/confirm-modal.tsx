'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { AlertCircleIcon, Loading03Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'default';
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  variant = 'destructive',
  isLoading = false,
}: ConfirmModalProps) {
  const [isPending, setIsPending] = React.useState(false);

  const handleConfirm = async () => {
    try {
      setIsPending(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Confirm action failed:', error);
    } finally {
      setIsPending(false);
    }
  };

  const activeLoading = isLoading || isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
              variant === 'destructive' ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
            )}>
              <HugeiconsIcon icon={AlertCircleIcon} className="h-6 w-6" strokeWidth={2} />
            </div>
            <div className="flex flex-col gap-1 text-left">
              <DialogTitle className="text-base">{title}</DialogTitle>
              <DialogDescription className="text-sm">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="mt-2 flex flex-row items-center justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={activeLoading}
            className="flex-1 sm:flex-none"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirm}
            disabled={activeLoading}
            className="flex-1 sm:flex-none min-w-[100px]"
          >
            {activeLoading ? (
              <HugeiconsIcon icon={Loading03Icon} className="h-4 w-4 animate-spin" />
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
