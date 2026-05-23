"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/ui/file-upload"
import { Label } from "@/components/ui/label"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle01Icon,
  CancelCircleIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface ApprovalActionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (notes: string, attachment?: File) => void | Promise<void>
  type: "approve" | "reject"
  isLoading?: boolean
}

export function ApprovalActionModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  isLoading = false,
}: ApprovalActionModalProps) {
  const [notes, setNotes] = React.useState("")
  const [attachment, setAttachment] = React.useState<File | undefined>(
    undefined
  )

  const isApprove = type === "approve"

  const handleConfirm = async () => {
    await onConfirm(notes, attachment)
    setNotes("")
    setAttachment(undefined)
  }

  React.useEffect(() => {
    if (!isOpen) {
      setNotes("")
      setAttachment(undefined)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[450px]">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
                isApprove
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-destructive/10 text-destructive"
              )}
            >
              <HugeiconsIcon
                icon={isApprove ? CheckmarkCircle01Icon : CancelCircleIcon}
                className="h-6 w-6"
                strokeWidth={2}
              />
            </div>
            <div className="flex flex-col gap-1 text-left">
              <DialogTitle className="text-base font-bold">
                {isApprove ? "Setujui Pengajuan" : "Tolak Pengajuan"}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {isApprove
                  ? "Apakah Anda yakin ingin menyetujui pengajuan ini? Anda dapat menambahkan catatan dan lampiran di bawah."
                  : "Harap berikan alasan mengapa Anda menolak pengajuan ini."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-sm font-semibold">
              Catatan{" "}
              {!isApprove && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id="notes"
              placeholder={
                isApprove
                  ? "Tambahkan catatan (opsional)..."
                  : "Berikan alasan penolakan..."
              }
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[120px] resize-none focus-visible:ring-primary/20"
            />
            {!isApprove && !notes.trim() && (
              <p className="text-[11px] text-muted-foreground italic">
                Catatan wajib diisi untuk penolakan
              </p>
            )}
          </div>

          {isApprove && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Lampiran (Opsional)
              </Label>
              <FileUpload
                value={attachment || null}
                onChange={(file) => setAttachment(file || undefined)}
                multiple={false}
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-row items-center justify-end gap-3 pt-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 font-medium sm:flex-none"
          >
            Batal
          </Button>
          <Button
            variant={isApprove ? "success" : "destructive"}
            onClick={handleConfirm}
            disabled={isLoading || (!isApprove && !notes.trim())}
          >
            {isLoading ? (
              <HugeiconsIcon
                icon={Loading03Icon}
                className="h-4 w-4 animate-spin"
              />
            ) : isApprove ? (
              "Setujui"
            ) : (
              "Tolak"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
