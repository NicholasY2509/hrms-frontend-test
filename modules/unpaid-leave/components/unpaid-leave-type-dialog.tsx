"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UnpaidLeaveTypeForm } from "./unpaid-leave-type-form";
import { UnpaidLeaveType } from "../types";

interface UnpaidLeaveTypeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem?: UnpaidLeaveType;
}

export function UnpaidLeaveTypeDialog({
  isOpen,
  onOpenChange,
  selectedItem,
}: UnpaidLeaveTypeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-6">
          <DialogTitle>
            {selectedItem ? "Edit Tipe Izin" : "Tambah Tipe Izin Baru"}
          </DialogTitle>
          <DialogDescription>
            Isi formulir di bawah ini untuk {selectedItem ? "memperbarui" : "menambahkan"} tipe izin.
          </DialogDescription>
        </DialogHeader>
        <UnpaidLeaveTypeForm
          initialData={selectedItem}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
