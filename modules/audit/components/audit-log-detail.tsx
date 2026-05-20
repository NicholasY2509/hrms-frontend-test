"use client";

import { AuditLog } from "@/modules/audit/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  Database01Icon,
  ActivityIcon,
  Calendar01Icon,
  InformationCircleIcon,
  ArrowRight01Icon,
  CodeIcon,
} from "@hugeicons/core-free-icons";

interface AuditLogDetailProps {
  log: AuditLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AuditLogDetail({ log, isOpen, onClose }: AuditLogDetailProps) {
  if (!log) return null;

  const changes = log.attribute_changes;

  const getEventVariant = (event: string) => {
    switch (event) {
      case "created": return "success";
      case "updated": return "warning";
      case "deleted": return "destructive";
      default: return "outline";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] flex flex-col p-0 overflow-hidden gap-0">
        <DialogHeader className="p-6 pb-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-xl flex items-center gap-2">
                <HugeiconsIcon icon={ActivityIcon} size={20} className="text-primary" />
                Audit Log Details
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Detailed information for log record #{log.id}
              </p>
            </div>
            <Badge variant={getEventVariant(log.event)} className="px-3 py-1 capitalize text-xs font-semibold">
              {log.event}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8">
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3 p-4 rounded-xl border bg-card">
                <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                  <HugeiconsIcon icon={UserIcon} size={16} />
                  Causer Information
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold">{log.causer?.name || "System"}</p>
                  <p className="text-xs text-muted-foreground truncate">{log.causer?.type || "N/A"}</p>
                  <p className="text-xs text-muted-foreground">ID: {log.causer?.id || "-"}</p>
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-xl border bg-card">
                <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                  <HugeiconsIcon icon={Database01Icon} size={16} />
                  Subject Information
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold">{log.subject_type.split("\\").pop()}</p>
                  <p className="text-xs text-muted-foreground truncate">{log.subject_type}</p>
                  <p className="text-xs text-muted-foreground">ID: {log.subject_id}</p>
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-xl border bg-card">
                <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                  <HugeiconsIcon icon={Calendar01Icon} size={16} />
                  Timestamp
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold">{log.human_time}</p>
                  <p className="text-xs text-muted-foreground">{log.created_at}</p>
                  <p className="text-xs text-muted-foreground">Log Name: <span className="capitalize">{log.log_name}</span></p>
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <HugeiconsIcon icon={InformationCircleIcon} size={16} className="text-muted-foreground" />
                Activity Description
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border text-sm italic">
                "{log.description}"
              </div>
            </section>

            {/* Attribute Changes */}
            {changes && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <HugeiconsIcon icon={ArrowRight01Icon} size={20} className="text-success" />
                    Attribute Changes
                  </h3>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-muted">Old</Badge>
                    <Badge variant="outline" className="bg-success/20 text-success border-success/30">New</Badge>
                  </div>
                </div>

                <div className="rounded-xl border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="text-left py-3 px-4 font-semibold w-1/4">Attribute</th>
                        <th className="text-left py-3 px-4 font-semibold w-[37.5%]">Before</th>
                        <th className="text-left py-3 px-4 font-semibold w-[37.5%]">After</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {Array.from(new Set([
                        ...Object.keys(changes.old || {}),
                        ...Object.keys(changes.attributes || {})
                      ])).map((key) => (
                        <tr key={key} className="hover:bg-muted/20 transition-colors">
                          <td className="py-3 px-4 font-medium text-primary bg-muted/5">
                            {key}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-muted-foreground line-through decoration-destructive/50 break-all block">
                              {renderValue(changes.old?.[key])}
                            </span>
                          </td>
                          <td className="py-3 px-4 bg-success/5">
                            <span className="text-success font-semibold break-all block">
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
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <HugeiconsIcon icon={CodeIcon} size={14} />
                    Raw Payload
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="bg-[#1e1e1e] p-4 rounded-lg overflow-x-auto border border-border/50 shadow-inner">
                        <pre className="text-[10px] text-gray-300 leading-relaxed">
                          {JSON.stringify(changes.old, null, 2)}
                        </pre>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-[#1e1e1e] p-4 rounded-lg overflow-x-auto border border-success/20 shadow-inner">
                        <pre className="text-[10px] text-green-400 leading-relaxed">
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
                <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
                  <HugeiconsIcon icon={CodeIcon} size={20} />
                  Extended Properties
                </h3>
                <div className="bg-[#1e1e1e] p-4 rounded-xl overflow-x-auto border border-border/50 shadow-inner">
                  <pre className="text-xs text-gray-300 leading-relaxed">
                    {JSON.stringify(log.properties, null, 2)}
                  </pre>
                </div>
              </section>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t bg-muted/30 flex justify-end">
          <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground border-none">
            Generated by Spatie Activity Log
          </Badge>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function renderValue(value: any) {
  if (value === null || value === undefined) return <span className="text-muted-foreground/50 italic">null</span>;
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
