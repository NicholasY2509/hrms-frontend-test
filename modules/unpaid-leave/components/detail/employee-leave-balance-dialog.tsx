import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface EmployeeLeaveBalanceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  annualLeave2: number
  annualLeave3: number
  employeeName?: string
}

export function EmployeeLeaveBalanceDialog({
  open,
  onOpenChange,
  annualLeave2,
  annualLeave3,
  employeeName,
}: EmployeeLeaveBalanceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {employeeName
              ? `Sisa Cuti - ${employeeName}`
              : "Informasi Sisa Cuti Pegawai"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="rounded-xl border bg-card p-4 text-center shadow-sm">
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              Cuti Tahun Lalu ({new Date().getFullYear() - 1})
            </p>
            <p className="text-3xl font-bold">{annualLeave2}</p>
            <p className="mt-1 text-xs text-muted-foreground">Hari</p>
          </div>
          <div className="rounded-xl border bg-card p-4 text-center shadow-sm">
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              Cuti Tahun Ini ({new Date().getFullYear()})
            </p>
            <p className="text-3xl font-bold">{annualLeave3}</p>
            <p className="mt-1 text-xs text-muted-foreground">Hari</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
