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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle01Icon, CancelCircleIcon, Loading03Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

interface ApprovalActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes: string, attachment?: File) => void | Promise<void>;
  type: 'approve' | 'reject';
  isLoading?: boolean;
}

export function ApprovalActionModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  isLoading = false,
}: ApprovalActionModalProps) {
  const [notes, setNotes] = React.useState('');
  const [attachment, setAttachment] = React.useState<File | undefined>(undefined);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isApprove = type === 'approve';

  const handleConfirm = async () => {
    await onConfirm(notes, attachment);
    setNotes('');
    setAttachment(undefined);
  };

  React.useEffect(() => {
    if (!isOpen) {
      setNotes('');
      setAttachment(undefined);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[450px]">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
              isApprove ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive"
            )}>
              <HugeiconsIcon
                icon={isApprove ? CheckmarkCircle01Icon : CancelCircleIcon}
                className="h-6 w-6"
                strokeWidth={2}
              />
            </div>
            <div className="flex flex-col gap-1 text-left">
              <DialogTitle className="text-base font-bold">
                {isApprove ? 'Setujui Pengajuan' : 'Tolak Pengajuan'}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {isApprove
                  ? 'Apakah Anda yakin ingin menyetujui pengajuan ini? Anda dapat menambahkan catatan dan lampiran di bawah.'
                  : 'Harap berikan alasan mengapa Anda menolak pengajuan ini.'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader >

        <div className="py-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-sm font-semibold">
              Catatan {!isApprove && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id="notes"
              placeholder={isApprove ? 'Tambahkan catatan (opsional)...' : 'Berikan alasan penolakan...'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[120px] resize-none focus-visible:ring-primary/20"
            />
            {!isApprove && !notes.trim() && (
              <p className="text-[11px] text-muted-foreground italic">Catatan wajib diisi untuk penolakan</p>
            )}
          </div>

          {isApprove && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Lampiran (Opsional)</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-9 px-3 text-xs gap-2"
                >
                  Pilih File
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
                {attachment ? (
                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {attachment.name}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground italic">Belum ada file dipilih</span>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-row items-center justify-end gap-3 pt-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 sm:flex-none font-medium"
          >
            Batal
          </Button>
          <Button
            variant={isApprove ? 'success' : 'destructive'}
            onClick={handleConfirm}
            disabled={isLoading || (!isApprove && !notes.trim())}
          >
            {isLoading ? (
              <HugeiconsIcon icon={Loading03Icon} className="h-4 w-4 animate-spin" />
            ) : (
              isApprove ? 'Setujui' : 'Tolak'
            )}
          </Button>
        </DialogFooter>
      </DialogContent >
    </Dialog >
  );
}

