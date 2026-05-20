"use client";

import * as React from "react";
import { ConfirmModal } from "@/components/ui/confirm-modal";

export function useConfirm() {
  const [promise, setPromise] = React.useState<{
    resolve: (value: boolean) => void;
  } | null>(null);
  const [config, setConfig] = React.useState<{
    title: string;
    message: string;
    variant?: "destructive" | "default";
  } | null>(null);

  const confirm = (data: {
    title: string;
    message: string;
    variant?: "destructive" | "default";
  }): Promise<boolean> => {
    return new Promise((resolve) => {
      setPromise({ resolve });
      setConfig(data);
    });
  };

  const handleClose = () => {
    setPromise(null);
    setConfig(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmDialog = () => (
    <ConfirmModal
      isOpen={promise !== null}
      onClose={handleCancel}
      onConfirm={handleConfirm}
      title={config?.title || ""}
      description={config?.message || ""}
      variant={config?.variant}
    />
  );

  return [ConfirmDialog, confirm] as const;
}
