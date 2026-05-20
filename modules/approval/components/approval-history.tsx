
'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    CheckmarkCircle01Icon,
    CancelCircleIcon,
    Clock01Icon
} from '@hugeicons/core-free-icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApprovalStep } from '../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useApproveRequest, useRejectRequest } from '@/modules/approval-workflow/actions/hooks/use-approvals';
import { ApprovalActionModal } from '@/modules/approval-workflow/actions/components/approval-action-modal';
import { formatDateTime } from '@/lib/utils';

interface ApprovalHistoryProps {
    approvals?: ApprovalStep[];
    title?: string;
    onActionSuccess?: () => void;
    currentUserId?: number | null;
    userRoles?: string[];
}

export function ApprovalHistory({
    approvals,
    title = "Riwayat Persetujuan",
    onActionSuccess,
    currentUserId,
    userRoles = []
}: ApprovalHistoryProps) {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [modalType, setModalType] = React.useState<'approve' | 'reject'>('approve');
    const [selectedApprovalId, setSelectedApprovalId] = React.useState<number | string | null>(null);

    const { approve, isLoading: isApproving } = useApproveRequest({
        onSuccess: () => {
            setModalOpen(false);
            onActionSuccess?.();
        },
    });

    const { reject, isLoading: isRejecting } = useRejectRequest({
        onSuccess: () => {
            setModalOpen(false);
            onActionSuccess?.();
        },
    });

    const handleAction = (id: number | string, type: 'approve' | 'reject') => {
        setSelectedApprovalId(id);
        setModalType(type);
        setModalOpen(true);
    };

    const handleConfirm = async (notes: string) => {
        if (!selectedApprovalId) return;
        if (modalType === 'approve') {
            await approve({ id: selectedApprovalId, notes });
        } else {
            await reject({ id: selectedApprovalId, notes });
        }
    };

    const getStatusIcon = (status: string) => {
        const s = status.toLowerCase();
        if (s.includes('approved') || s.includes('disetujui'))
            return <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-5 w-5 text-green-600" />;
        if (s.includes('rejected') || s.includes('ditolak'))
            return <HugeiconsIcon icon={CancelCircleIcon} className="h-5 w-5 text-destructive" />;
        return <HugeiconsIcon icon={Clock01Icon} className="h-5 w-5 text-amber-600" />;
    };

    const getStatusBadge = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'approved' || s === 'disetujui')
            return <Badge variant="success" size={'sm'} className="px-3 py-1  capitalize">{s}</Badge>;
        if (s === 'rejected' || s === 'ditolak')
            return <Badge variant="destructive" size={'sm'} className="px-3 py-1  capitalize">{s}</Badge>;
        if (s === 'pending' || s === 'menunggu')
            return <Badge variant="warning" size={'sm'} className="px-3 py-1  capitalize">{s}</Badge>;
        return <Badge variant="secondary" size={'sm'} className="px-3 py-1  capitalize">{s}</Badge>;
    };



    return (
        <Card className="overflow-hidden border-none pt-0 shadow-sm ring-1 ring-muted">
            <CardHeader className="bg-muted/30 py-4">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                    <HugeiconsIcon icon={Clock01Icon} className="h-4 w-4 text-primary" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="">
                <div className="relative space-y-0 before:absolute before:inset-y-0 before:left-[15px] before:w-0.5 before:bg-muted">
                    {approvals && approvals.length > 0 ? (
                        approvals.map((approval, index) => (
                            <div key={index} className="relative pl-10 pb-8 last:pb-0">
                                <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border bg-background shadow-sm ring-4 ring-background z-10 scale-90">
                                    {getStatusIcon(approval.status)}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm leading-tight text-foreground/90">
                                                {approval.approver_name || (approval.role ? (approval.role.replace('_', ' ').toUpperCase()) : 'Menunggu Persetujuan')}
                                            </span>
                                            {approval.actor && (
                                                <span className="text-[10px] text-muted-foreground font-medium">
                                                    Oleh <span className="font-bold">{approval.actor.name}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getStatusBadge(approval.status)}
                                        <span className="text-[10px] text-muted-foreground font-medium">
                                            {formatDateTime(approval.updated_at)}
                                        </span>
                                    </div>
                                    {approval.note && (
                                        <p className="text-[11px] text-muted-foreground p-2.5 bg-muted/30 rounded-xl border border-dashed italic">
                                            "{approval.note}"
                                        </p>
                                    )}

                                    {approval.status === 'pending' && (() => {
                                        const isAuthorized = (userRoles.includes('IT') || (
                                            currentUserId && approval.approver_id && (
                                                Array.isArray(approval.approver_id)
                                                    ? approval.approver_id.includes(currentUserId)
                                                    : approval.approver_id === currentUserId
                                            )
                                        )) && (approval.is_current !== false);

                                        if (!isAuthorized) return null;

                                        return (
                                            <div className="flex items-center gap-2 pt-2">
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleAction(approval.id, 'reject')}
                                                >
                                                    <HugeiconsIcon icon={CancelCircleIcon} className="h-3.5 w-3.5" />
                                                    Tolak
                                                </Button>
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => handleAction(approval.id, 'approve')}
                                                >
                                                    <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-3.5 w-3.5" />
                                                    Setujui
                                                </Button>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="pl-4 py-4 text-xs text-muted-foreground italic">
                            Belum ada riwayat persetujuan.
                        </div>
                    )}
                </div>
            </CardContent>

            <ApprovalActionModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleConfirm}
                type={modalType}
                isLoading={isApproving || isRejecting}
            />
        </Card>
    );
}
