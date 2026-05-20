'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { ApprovalRequest } from '@/modules/approval-workflow/actions/types';
import { getModuleConfig } from './approval-inbox-constants';
import { ApprovalCategory } from '@/modules/approval-workflow/actions/hooks/use-approvals';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/hooks/use-permission';

interface ApprovalCardProps {
  task: ApprovalRequest;
  activeTab: ApprovalCategory;
  isActioning: boolean;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}



export function ApprovalCard({
  task,
  activeTab,
  isActioning,
  onApprove,
  onReject,
}: ApprovalCardProps) {
  const router = useRouter();
  const { hasRole } = usePermission();
  const config = getModuleConfig(task.approvable_type);
  const employee = task.approvable?.employee;

  const isOvertime = task.approvable_type.includes('Overtime');
  const isLeave = task.approvable_type.includes('UnpaidLeave');

  const isIT = hasRole('IT');
  const canAction = (task.approvable_request_step_id !== null && task.user_step_status === 'pending') || (isIT && task.status === 'pending');

  const goToDetail = () => {
    const path = `${config.detailPath}/${task.approvable_id}`;
    router.push(path);
  };

  const getBadgeVariant = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("settled")) return "default" as const;
    if (s.includes("approved")) return "success" as const;
    if (s.includes("rejected")) return "destructive" as const;
    if (s.includes("pending") || s.includes("waiting")) return "warning" as const;
    return "outline" as const;
  };

  return (
    <Card className="group border-border/50 py-0 gap-0 hover:border-border transition-all duration-300 rounded-lg shadow-none overflow-hidden bg-card flex flex-col h-full">
      {/* Module Stripe */}
      <div className={cn("h-1 w-full", config.accent)} />

      <CardContent className="p-4 flex flex-col flex-1">
        {/* Top Meta */}
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className={cn("text-[9px] font-bold h-5 px-2 bg-transparent border-border uppercase tracking-widest", config.color)}>
            {task.category || config.label}
          </Badge>
          <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-tighter">
            Step {task.current_step_sequence}
          </span>
        </div>

        {/* Requester Profile */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={employee?.avatar_url} />
            <AvatarFallback className=" text-xs text-muted-foreground uppercase">
              {employee?.full_name?.[0] || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="text-[13px] font-bold text-foreground truncate leading-none mb-1.5">
              {employee?.full_name}
            </h3>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium truncate">
              <span className="truncate">{employee?.department?.name || 'Departemen'}</span>
              <span className="text-muted-foreground/30">•</span>
              <span className="truncate">{employee?.position?.name || 'Jabatan'}</span>
            </div>
          </div>
        </div>

        {/* Request Status Badge */}
        <div className="mb-5 flex">
          <Badge
            variant={getBadgeVariant(task.status)}
            className="text-[10px] font-bold h-6 px-2.5 uppercase tracking-wide border-dashed"
          >
            {task.status}
          </Badge>
        </div>

        {/* Core Data Bar */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-border/40 mb-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">Diajukan</span>
            <span className="text-[11px] font-bold text-foreground tabular-nums">
              {format(new Date(task.created_at), 'd MMM yyyy', { locale: id })}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">Detail</span>
            <div className="flex items-center gap-1">
              {isOvertime && task.approvable?.total_time && (
                <span className="text-[11px] font-bold text-amber-600">
                  {task.approvable.total_time} Jam
                </span>
              )}
              {isLeave && (
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-blue-600 leading-none">
                    {task.approvable?.total_days} Hari
                  </span>
                  {task.approvable?.start_date && task.approvable?.end_date && (
                    <span className="text-[9px] text-muted-foreground font-medium mt-1">
                      {format(new Date(task.approvable.start_date), 'd MMM', { locale: id })} - {format(new Date(task.approvable.end_date), 'd MMM', { locale: id })}
                    </span>
                  )}
                </div>
              )}
              {!isOvertime && !isLeave && (
                <span className="text-[11px] font-bold text-slate-600">—</span>
              )}
            </div>
          </div>
        </div>

        {/* Notes (Conditional) */}
        <div className="flex-1">
          <p className="text-[10.5px] text-muted-foreground/70 leading-relaxed italic line-clamp-2">
            "{task.approvable?.note ?? '-'}"
          </p>
        </div>

        {/* User Step Status Badge for non-pending tabs */}
        {activeTab !== 'pending' && task.user_step_status && task.user_step_status !== 'pending' && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">Approval Anda:</span>
            <Badge variant={task.user_step_status === 'approved' ? 'success' : 'destructive'} className="text-[9px] font-bold h-4 px-1.5 uppercase">
              {task.user_step_status}
            </Badge>
          </div>
        )}

        {/* Actions */}
        {canAction ? (
          <div className="flex gap-2 mt-5">
            <Button
              variant="destructive"
              size="sm"
              disabled={isActioning}
              onClick={() => task.approvable_request_step_id && onReject(task.approvable_request_step_id)}
              className="flex-1"
            >
              Tolak
            </Button>
            <Button
              variant="success"
              size="sm"
              disabled={isActioning}
              onClick={() => task.approvable_request_step_id && onApprove(task.approvable_request_step_id)}
              className="flex-1"
            >
              Setujui
            </Button>
          </div>
        ) : (
          <div className="mt-5">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-[10px] font-bold uppercase tracking-widest h-8"
              onClick={goToDetail}
            >
              Lihat Rincian
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
