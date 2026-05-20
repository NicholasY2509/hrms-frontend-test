"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ReportModel } from "@/modules/system/types/report";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon, InformationCircleIcon, Tick01Icon, Loading03Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { reportService } from "@/modules/system/services/report-service";
import { toast } from "sonner";

export const columns: ColumnDef<ReportModel>[] = [
  {
    accessorKey: "user.email",
    header: "Pelaku",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="">{user?.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nama Laporan",
    cell: ({ row }) => {
      const report = row.original;
      return (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-foreground">{report.name}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
            {report.type.replace(/_/g, " ")} • {report.format.toUpperCase()}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const progress = row.original.progress;

      if (status === "processing" || status === "pending") {
        return (
          <div className="flex flex-col gap-2 w-32">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase">
              <span className="text-primary animate-pulse flex items-center gap-1">
                <HugeiconsIcon icon={Loading03Icon} className="h-3 w-3 animate-spin" />
                {status === "pending" ? "Menunggu" : "Memproses"}
              </span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>
        );
      }

      const variants: Record<string, { label: string; className: string; icon: any }> = {
        completed: {
          label: "Selesai",
          className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
          icon: Tick01Icon
        },
        failed: {
          label: "Gagal",
          className: "bg-rose-500/10 text-rose-600 border-rose-500/20",
          icon: Cancel01Icon
        },
      };

      const variant = variants[status] || { label: status, className: "", icon: InformationCircleIcon };

      return (
        <Badge variant="outline" className={cn("gap-1 py-0.5 px-2 rounded-full font-bold uppercase text-[10px]", variant.className)}>
          <HugeiconsIcon icon={variant.icon} className="h-3 w-3" />
          {variant.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Tanggal Permintaan",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-muted-foreground font-medium">
          {format(new Date(row.original.created_at), "dd MMM yyyy, HH:mm", { locale: id })}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Aksi</div>,
    cell: ({ row }) => {
      const report = row.original;
      const isCompleted = report.status === "completed";

      const handleDownload = async () => {
        try {
          const detail = await reportService.getReportDetail(report.id);
          if (detail.data.download_url) {
            window.open(detail.data.download_url, "_blank");
          } else {
            toast.error("URL download tidak tersedia");
          }
        } catch (error) {
          toast.error("Gagal mendapatkan link download");
        }
      };

      return (
        <div className="flex justify-end gap-2">
          {isCompleted && report.file_path && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDownload}
            >
              <HugeiconsIcon icon={Download01Icon} size={14} />
              Download
            </Button>
          )}
        </div>
      );
    },
  },
];
