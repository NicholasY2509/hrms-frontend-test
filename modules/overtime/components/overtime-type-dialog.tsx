"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OvertimeTypeForm } from "./overtime-type-form";
import { OvertimeType } from "../types";

interface OvertimeTypeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem?: OvertimeType;
}

export function OvertimeTypeDialog({
  isOpen,
  onOpenChange,
  selectedItem,
}: OvertimeTypeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-6">
          <DialogTitle>
            {selectedItem ? "Edit Tipe Lembur" : "Tambah Tipe Lembur Baru"}
          </DialogTitle>
          <DialogDescription>
            Isi formulir di bawah ini untuk {selectedItem ? "memperbarui" : "menambahkan"} tipe lembur.
          </DialogDescription>
        </DialogHeader>
        <OvertimeTypeForm
          initialData={selectedItem}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
