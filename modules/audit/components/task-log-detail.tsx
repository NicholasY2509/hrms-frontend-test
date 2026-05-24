"use client"

import { TaskLog } from "@/modules/audit/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserIcon,
  ActivityIcon,
  Calendar01Icon,
  InformationCircleIcon,
  CodeIcon,
} from "@hugeicons/core-free-icons"

interface TaskLogDetailProps {
  log: TaskLog | null
  isOpen: boolean
  onClose: () => void
}

export function TaskLogDetail({ log, isOpen, onClose }: TaskLogDetailProps) {
  if (!log) return null

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "success"
      case "processing":
        return "warning"
      case "failed":
        return "destructive"
      case "pending":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl">
        <DialogHeader className="border-b bg-muted/30 p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="flex items-center gap-2 text-xl">
                <HugeiconsIcon
                  icon={ActivityIcon}
                  size={20}
                  className="text-primary"
                />
                Task Details
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Detailed information for task #{log.id} ({log.type.replace(/_/g, " ")})
              </p>
            </div>
            <Badge
              variant={getStatusVariant(log.status)}
              className="px-3 py-1 text-xs font-semibold capitalize"
            >
              {log.status}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] flex-1 overflow-y-auto">
          <div className="space-y-8 p-6">
            <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-3 rounded-xl border bg-card p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <HugeiconsIcon icon={UserIcon} size={16} />
                  Triggered By
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold">
                    {log.user?.name || "System"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {log.user?.email || "N/A"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    User ID: {log.user?.id || "-"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 rounded-xl border bg-card p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <HugeiconsIcon icon={Calendar01Icon} size={16} />
                  Timing
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold">Created At: {new Date(log.created_at).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    Updated At: {new Date(log.updated_at).toLocaleString()}
                  </p>
                  {log.completed_at && (
                    <p className="text-xs text-muted-foreground">
                      Completed At: {new Date(log.completed_at).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <HugeiconsIcon
                  icon={InformationCircleIcon}
                  size={16}
                  className="text-muted-foreground"
                />
                Task Message
              </div>
              <div className="rounded-lg border bg-muted/50 p-4 text-sm italic">
                {log.message || "No message provided."}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="flex items-center gap-2 border-b pb-2 text-lg font-bold">
                <HugeiconsIcon icon={CodeIcon} size={20} />
                Payload & Metadata
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-muted-foreground">Payload</div>
                  <div className="overflow-x-auto rounded-xl border border-border/50 bg-[#1e1e1e] p-4 shadow-inner min-h-[150px]">
                    <pre className="text-xs leading-relaxed text-gray-300">
                      {log.payload ? JSON.stringify(log.payload, null, 2) : "{}"}
                    </pre>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-semibold text-muted-foreground">Metadata</div>
                  <div className="overflow-x-auto rounded-xl border border-border/50 bg-[#1e1e1e] p-4 shadow-inner min-h-[150px]">
                    <pre className="text-xs leading-relaxed text-gray-300">
                      {log.metadata ? JSON.stringify(log.metadata, null, 2) : "null"}
                    </pre>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
