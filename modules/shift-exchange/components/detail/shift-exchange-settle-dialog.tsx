"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useSettleShiftExchange } from "../../hooks/use-shift-exchange"
import { ShiftExchange } from "../../types"

interface ShiftExchangeSettleDialogProps {
  item: ShiftExchange
  trigger: React.ReactNode
  onSuccess?: () => void
}

export function ShiftExchangeSettleDialog({
  item,
  trigger,
  onSuccess,
}: ShiftExchangeSettleDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { settleShiftExchange, isLoading } = useSettleShiftExchange(item.id, {
    onSuccess: () => {
      setOpen(false)
      onSuccess?.()
    },
  })

  const handleSettle = async (e: React.MouseEvent) => {
    e.preventDefault()
    await settleShiftExchange()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Settle Tukar Shift</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin melakukan settle untuk pengajuan tukar shift
            ini? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleSettle}
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : "Ya, Settle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
