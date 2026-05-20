export interface SupervisorModel {
    id: number;
    employee_id: number;
    employee: {
        id: number;
        name: string;
        nik: string;
    } | null;
    created_at: string;
    updated_at: string;
}