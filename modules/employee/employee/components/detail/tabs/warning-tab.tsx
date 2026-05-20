'use client';

import * as React from 'react';
import {
  AlertCircleIcon,
  Calendar01Icon,
  Download01Icon,
  EyeIcon,
  File01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Doc01Icon
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { useEmployeeDetails } from '../../../hooks/use-employee-detail';
import { DetailTabContainer } from './detail-tab-container';
import { HugeiconsIcon } from '@hugeicons/react';
import { EmployeeWarning } from '../../../types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface WarningTabProps {
  employeeId: string | number;
}

export function WarningTab({ employeeId }: WarningTabProps) {
  const { items, isLoading } = useEmployeeDetails(employeeId, 'warning');

  const getStatus = (item: EmployeeWarning) => {
    if (item.settled_at) return { label: 'Selesai', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckmarkCircle02Icon };
    if (item.confirmed_at) return { label: 'Dikonfirmasi', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckmarkCircle02Icon };
    return { label: 'Berjalan', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock01Icon };
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    try {
      return format(new Date(date), 'dd MMMM yyyy', { locale: id });
    } catch (e) {
      return date;
    }
  };

  return (
    <DetailTabContainer
      title="Surat Peringatan (SP)"
      icon={AlertCircleIcon}
      isLoading={isLoading}
      isEmpty={items.length === 0}
    >
      <div className="grid grid-cols-1 gap-6">
        {items.map((item: EmployeeWarning) => {
          const status = getStatus(item);
          return (
            <div key={item.id} className="bg-card border rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                    <HugeiconsIcon icon={AlertCircleIcon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-foreground">
                      {item.warning_letter_type.name}
                    </h4>
                    <span className="text-xs text-muted-foreground font-mono">
                      {item.document_no}
                    </span>
                  </div>
                </div>
                <div className={cn("px-3 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5", status.color)}>
                  <HugeiconsIcon icon={status.icon} className="w-3 h-3" />
                  {status.label}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Period Section */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <HugeiconsIcon icon={Calendar01Icon} className="w-3 h-3" />
                      Masa Berlaku
                    </span>
                    <div className="flex flex-col gap-0.5 pt-1">
                      <span className="text-sm font-bold text-foreground">
                        {formatDate(item.start_date)}
                      </span>
                      <span className="text-[10px] text-muted-foreground px-2">sampai</span>
                      <span className="text-sm font-bold text-foreground">
                        {formatDate(item.end_date)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline Section */}
                <div className="space-y-4 border-l border-dashed pl-8">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Diterbitkan</p>
                        <p className="text-xs font-semibold">{formatDate(item.warning_at)}</p>
                      </div>
                    </div>
                    {item.confirmed_at && (
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">Dikonfirmasi</p>
                          <p className="text-xs font-semibold">{formatDate(item.confirmed_at)}</p>
                        </div>
                      </div>
                    )}
                    {item.settled_at && (
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">Diselesaikan</p>
                          <p className="text-xs font-semibold">{formatDate(item.settled_at)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action/Attachment Section */}
                <div className="flex flex-col justify-center gap-3 border-l border-dashed pl-8">
                  {item.attachment_url ? (
                    <div className="flex flex-col gap-2">
                      <div className="p-3 rounded-xl border bg-muted/30 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-primary border shadow-sm">
                          <HugeiconsIcon icon={Doc01Icon} className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate">Dokumen Pendukung</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-mono">Attachment</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 gap-2 rounded-xl" asChild>
                          <a href={item.attachment_url} target="_blank" rel="noopener noreferrer">
                            <HugeiconsIcon icon={EyeIcon} className="w-3.5 h-3.5" />
                            Lihat
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 gap-2 rounded-xl text-primary border-primary/20 hover:bg-primary/5" asChild>
                          <a href={item.attachment_url} download>
                            <HugeiconsIcon icon={Download01Icon} className="w-3.5 h-3.5" />
                            Unduh
                          </a>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4 bg-muted/20 rounded-2xl border border-dashed">
                      <HugeiconsIcon icon={File01Icon} className="w-8 h-8 text-muted-foreground/30 mb-2" />
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Tidak ada lampiran</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DetailTabContainer>
  );
}
