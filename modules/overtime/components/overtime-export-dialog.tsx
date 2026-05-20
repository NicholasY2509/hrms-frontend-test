'use client';

import * as React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PrinterIcon, Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DepartmentPicker } from "@/modules/organization/department/components/department-picker";
import { EmployeePicker } from "@/modules/employee/employee/components/employee-picker";
import { WorkLocationPicker } from "@/modules/organization/work-location/components/work-location-picker";
import { WorkPositionPicker } from "@/modules/organization/work-position/components/work-position-picker";
import { format } from "date-fns";
import { useExportOvertime } from "../hooks/use-overtime";

interface OvertimeExportDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function OvertimeExportDialog({ isOpen, onClose }: OvertimeExportDialogProps) {
    const [departmentId, setDepartmentId] = React.useState<number | null>(null);
    const [employeeId, setEmployeeId] = React.useState<number | null>(null);
    const [workLocationId, setWorkLocationId] = React.useState<number | null>(null);
    const [workPositionId, setWorkPositionId] = React.useState<number | null>(null);
    const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);
    const [type, setType] = React.useState<string>("all");

    const { exportOvertime, isLoading } = useExportOvertime({
        onSuccess: () => {
            onClose();
        }
    });

    const handleExport = async () => {
        const params: Record<string, any> = {};
        if (departmentId) params.department_id = departmentId;
        if (employeeId) params.employee_id = employeeId;
        if (workLocationId) params.work_location_id = workLocationId;
        if (workPositionId) params.work_position_id = workPositionId;
        if (startDate) params.start_date = format(startDate, 'yyyy-MM-dd');
        if (endDate) params.end_date = format(endDate, 'yyyy-MM-dd');
        if (type !== "all") params.type = type;

        await exportOvertime(params);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cetak Laporan Lembur</DialogTitle>
                    <DialogDescription>
                        Data akan diexport sesuai dengan filter yang Anda pilih. Laporan akan diproses di latar belakang.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Tanggal Mulai</Label>
                            <DatePicker
                                value={startDate}
                                onChange={setStartDate}
                                placeholder="Pilih Tanggal"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Tanggal Selesai</Label>
                            <DatePicker
                                value={endDate}
                                onChange={setEndDate}
                                placeholder="Pilih Tanggal"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Departemen</Label>
                        <DepartmentPicker
                            value={departmentId}
                            onChange={setDepartmentId}
                            placeholder="Semua Departemen"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Karyawan</Label>
                        <EmployeePicker
                            value={employeeId}
                            onChange={setEmployeeId}
                            placeholder="Semua Karyawan"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Lokasi Kerja</Label>
                            <WorkLocationPicker
                                value={workLocationId}
                                onChange={setWorkLocationId}
                                placeholder="Semua Lokasi"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Jabatan</Label>
                            <WorkPositionPicker
                                value={workPositionId}
                                onChange={setWorkPositionId}
                                placeholder="Semua Jabatan"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Tipe Lembur</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Semua Tipe" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Tipe</SelectItem>
                                <SelectItem value="UMUM">UMUM</SelectItem>
                                <SelectItem value="DAC">DAC</SelectItem>
                                <SelectItem value="NATIONAL">NATIONAL</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>Batal</Button>
                    <Button onClick={handleExport} disabled={isLoading} className="gap-2">
                        {isLoading ? (
                            <HugeiconsIcon icon={Loading03Icon} className="h-4 w-4 animate-spin" />
                        ) : (
                            <HugeiconsIcon icon={PrinterIcon} className="h-4 w-4" />
                        )}
                        Cetak Laporan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
