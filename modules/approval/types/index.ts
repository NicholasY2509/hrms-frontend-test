
export interface ApprovalStep {
    id: number | string;
    approver_id?: number | number[];
    approver_name: string | null;
    role?: string | null;
    status: string;
    note?: string | null;
    updated_at: string;
    is_current?: boolean;
    actor?: {
        id: number;
        name: string;
        profileUrl?: string | null;
    } | null;
}
