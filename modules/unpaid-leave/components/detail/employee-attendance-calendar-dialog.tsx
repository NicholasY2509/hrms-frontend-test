import { useState } from "react"
import { format, startOfMonth, endOfMonth } from "date-fns"
import { id } from "date-fns/locale"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { useEmployeeAttendanceStatus } from "@/modules/attendance/attendances/hooks/use-attendance"
import { Loading03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

interface EmployeeAttendanceCalendarDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employeeId: number | null
}

export function EmployeeAttendanceCalendarDialog({
  open,
  onOpenChange,
  employeeId,
}: EmployeeAttendanceCalendarDialogProps) {
  const [month, setMonth] = useState<Date>(new Date())

  const now = new Date()
  const isCurrentMonth =
    month.getFullYear() === now.getFullYear() &&
    month.getMonth() === now.getMonth()

  const startDate = format(startOfMonth(month), "yyyy-MM-dd")
  const endDate = isCurrentMonth
    ? format(now, "yyyy-MM-dd")
    : format(endOfMonth(month), "yyyy-MM-dd")

  const { records, isLoading } = useEmployeeAttendanceStatus(employeeId, {
    start_date: startDate,
    end_date: endDate,
  })

  const statusMap = new Map<string, string>()
  records?.forEach((record: any) => {
    statusMap.set(record.attendance_at, record.status)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Daftar Kehadiran Pegawai</DialogTitle>
        </DialogHeader>

        <div className="relative min-h-[400px] w-full py-4">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-background/50 backdrop-blur-sm">
              <HugeiconsIcon
                icon={Loading03Icon}
                className="h-8 w-8 animate-spin text-primary"
              />
            </div>
          )}

          <div className="flex w-full justify-center overflow-x-auto">
            <div className="w-full min-w-[500px]">
              <Calendar
                mode="single"
                month={month}
                onMonthChange={setMonth}
                locale={id}
                className="w-full rounded-md border p-4 shadow [&_.rdp-month]:w-full [&_.rdp-months]:w-full [&_.rdp-table]:w-full"
                classNames={{
                  day: "relative flex items-center justify-center p-1 w-full h-16",
                }}
                components={{
                  DayButton: (props) => {
                    const dateStr = format(props.day.date, "yyyy-MM-dd")
                    const status = statusMap.get(dateStr)

                    let statusColor = "bg-transparent"
                    let textColor = "text-foreground"

                    const s = status?.toLowerCase()

                    if (s === "hadir") {
                      statusColor = "bg-green-100 dark:bg-green-900/30"
                      textColor = "text-green-700 dark:text-green-400"
                    } else if (s === "absen" || s === "alpha") {
                      statusColor = "bg-red-100 dark:bg-red-900/30"
                      textColor = "text-red-700 dark:text-red-400"
                    } else if (s === "sakit") {
                      statusColor = "bg-yellow-100 dark:bg-yellow-900/30"
                      textColor = "text-yellow-700 dark:text-yellow-400"
                    } else if (s === "izin") {
                      statusColor = "bg-blue-100 dark:bg-blue-900/30"
                      textColor = "text-blue-700 dark:text-blue-400"
                    } else if (s === "cuti") {
                      statusColor = "bg-purple-100 dark:bg-purple-900/30"
                      textColor = "text-purple-700 dark:text-purple-400"
                    } else if (s === "training" || s === "dinas luar kota") {
                      statusColor = "bg-indigo-100 dark:bg-indigo-900/30"
                      textColor = "text-indigo-700 dark:text-indigo-400"
                    } else if (s === "libur" || s === "off") {
                      statusColor = "bg-slate-100 dark:bg-slate-800"
                      textColor = "text-slate-600 dark:text-slate-400"
                    } else if (
                      s?.includes("terlambat") ||
                      s?.includes("tap") ||
                      s?.includes("tidak absen pulang")
                    ) {
                      statusColor = "bg-orange-100 dark:bg-orange-900/30"
                      textColor = "text-orange-700 dark:text-orange-400"
                    } else if (status) {
                      statusColor = "bg-muted"
                      textColor = "text-muted-foreground"
                    }

                    return (
                      <button
                        {...props}
                        className={`relative flex h-full w-full flex-col items-center justify-center gap-1 rounded-md border border-transparent hover:border-border hover:bg-accent/50 ${statusColor} ${textColor} transition-colors ${
                          props.className || ""
                        }`}
                      >
                        <span className="text-sm font-medium">
                          {props.day.date.getDate()}
                        </span>
                        {status && status !== "-" && (
                          <span className="max-w-[90%] truncate text-[10px] leading-none font-semibold">
                            {status}
                          </span>
                        )}
                      </button>
                    )
                  },
                }}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-green-100 dark:bg-green-900/30"></div>
              <span>Hadir</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-red-100 dark:bg-red-900/30"></div>
              <span>Absen</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-yellow-100 dark:bg-yellow-900/30"></div>
              <span>Sakit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-blue-100 dark:bg-blue-900/30"></div>
              <span>Izin</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-purple-100 dark:bg-purple-900/30"></div>
              <span>Cuti</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-orange-100 dark:bg-orange-900/30"></div>
              <span>Terlambat/TAP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-slate-100 dark:bg-slate-800"></div>
              <span>Libur/OFF</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
