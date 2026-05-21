"use client"

import { AuditLog } from "@/modules/audit/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserIcon,
  Database01Icon,
  ActivityIcon,
  Calendar01Icon,
  InformationCircleIcon,
  ArrowRight01Icon,
  CodeIcon,
} from "@hugeicons/core-free-icons"

interface AuditLogDetailProps {
  log: AuditLog | null
  isOpen: boolean
  onClose: () => void
}

export function AuditLogDetail({ log, isOpen, onClose }: AuditLogDetailProps) {
  if (!log) return null

  const changes = log.attribute_changes

  const getEventVariant = (event: string) => {
    switch (event) {
      case "created":
        return "success"
      case "updated":
        return "warning"
      case "deleted":
        return "destructive"
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
                Audit Log Details
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Detailed information for log record #{log.id}
              </p>
            </div>
            <Badge
              variant={getEventVariant(log.event)}
              className="px-3 py-1 text-xs font-semibold capitalize"
            >
              {log.event}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] flex-1 overflow-y-auto">
          <div className="space-y-8 p-6">
            <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-3 rounded-xl border bg-card p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <HugeiconsIcon icon={UserIcon} size={16} />
                  Causer Information
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold">
                    {log.causer?.name || "System"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {log.causer?.type || "N/A"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ID: {log.causer?.id || "-"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 rounded-xl border bg-card p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <HugeiconsIcon icon={Database01Icon} size={16} />
                  Subject Information
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold">
                    {log.subject_type.split("\\").pop()}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {log.subject_type}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ID: {log.subject_id}
                  </p>
                </div>
              </div>

              <div className="space-y-3 rounded-xl border bg-card p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <HugeiconsIcon icon={Calendar01Icon} size={16} />
                  Timestamp
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold">{log.human_time}</p>
                  <p className="text-xs text-muted-foreground">
                    {log.created_at}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Log Name: <span className="capitalize">{log.log_name}</span>
                  </p>
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <HugeiconsIcon
                  icon={InformationCircleIcon}
                  size={16}
                  className="text-muted-foreground"
                />
                Activity Description
              </div>
              <div className="rounded-lg border bg-muted/50 p-4 text-sm italic">
                "{log.description}"
              </div>
            </section>

            {/* Attribute Changes */}
            {changes && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="flex items-center gap-2 text-lg font-bold">
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={20}
                      className="text-success"
                    />
                    Attribute Changes
                  </h3>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-muted">
                      Old
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-success/20 text-success border-success/30"
                    >
                      New
                    </Badge>
                  </div>
                </div>

                <div className="overflow-hidden rounded-xl border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="w-1/4 px-4 py-3 text-left font-semibold">
                          Attribute
                        </th>
                        <th className="w-[37.5%] px-4 py-3 text-left font-semibold">
                          Before
                        </th>
                        <th className="w-[37.5%] px-4 py-3 text-left font-semibold">
                          After
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {Array.from(
                        new Set([
                          ...Object.keys(changes.old || {}),
                          ...Object.keys(changes.attributes || {}),
                        ])
                      ).map((key) => (
                        <tr
                          key={key}
                          className="transition-colors hover:bg-muted/20"
                        >
                          <td className="bg-muted/5 px-4 py-3 font-medium text-primary">
                            {key}
                          </td>
                          <td className="px-4 py-3">
                            <span className="block break-all text-muted-foreground line-through decoration-destructive/50">
                              {renderValue(changes.old?.[key])}
                            </span>
                          </td>
                          <td className="bg-success/5 px-4 py-3">
                            <span className="text-success block font-semibold break-all">
                              {renderValue(changes.attributes?.[key])}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Raw JSON Toggle/View */}
                <div className="space-y-2 pt-4">
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    <HugeiconsIcon icon={CodeIcon} size={14} />
                    Raw Payload
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="overflow-x-auto rounded-lg border border-border/50 bg-[#1e1e1e] p-4 shadow-inner">
                        <pre className="text-[10px] leading-relaxed text-gray-300">
                          {JSON.stringify(changes.old, null, 2)}
                        </pre>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="border-success/20 overflow-x-auto rounded-lg border bg-[#1e1e1e] p-4 shadow-inner">
                        <pre className="text-[10px] leading-relaxed text-green-400">
                          {JSON.stringify(changes.attributes, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {!changes && log.properties && log.properties.length > 0 && (
              <section className="space-y-3">
                <h3 className="flex items-center gap-2 border-b pb-2 text-lg font-bold">
                  <HugeiconsIcon icon={CodeIcon} size={20} />
                  Extended Properties
                </h3>
                <div className="overflow-x-auto rounded-xl border border-border/50 bg-[#1e1e1e] p-4 shadow-inner">
                  <pre className="text-xs leading-relaxed text-gray-300">
                    {JSON.stringify(log.properties, null, 2)}
                  </pre>
                </div>
              </section>
            )}
          </div>
        </ScrollArea>
        <div className="flex justify-end border-t bg-muted/30 p-4">
          <Badge
            variant="outline"
            className="border-none font-mono text-[10px] text-muted-foreground"
          >
            Generated by Spatie Activity Log
          </Badge>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function renderValue(value: any) {
  if (value === null || value === undefined)
    return <span className="text-muted-foreground/50 italic">null</span>
  if (typeof value === "boolean") return value ? "true" : "false"
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}
