'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HugeiconsIcon } from '@hugeicons/react';
import { Download01Icon } from '@hugeicons/core-free-icons';
import { useActivityStore } from '@/hooks/use-activity-store';
import apiClient from '@/lib/api-client';

interface ExportEmployeeDialogProps {
    currentFilters: Record<string, any>;
}

export function ExportEmployeeDialog({ currentFilters }: ExportEmployeeDialogProps) {
    const [open, setOpen] = React.useState(false);
    const [format, setFormat] = React.useState('excel');
    const [isLoading, setIsLoading] = React.useState(false);
    const addActivity = useActivityStore((state) => state.addActivity);

    const handleExport = async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.post('/v1/system/reports', {
                name: `Daftar Karyawan (${new Date().toLocaleDateString('id-ID')})`,
                type: 'employee_list',
                format: format,
                filters: currentFilters,
            });

            if (res.data?.data?.task_id) {
                addActivity(res.data.data.task_id, {
                    name: res.data.data.name,
                    type: 'report_generation'
                });
            }
            setOpen(false);
        } catch (error) {
            console.error('Failed to trigger export', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <HugeiconsIcon icon={Download01Icon} size={16} />
                    Export Data
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Export Data Karyawan</DialogTitle>
                    <DialogDescription>
                        Data akan diexport sesuai dengan filter yang sedang aktif di halaman ini. Silakan pilih format file yang diinginkan.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Format File</label>
                        <Select value={format} onValueChange={setFormat}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                                <SelectItem value="csv">CSV (.csv)</SelectItem>
                                <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                                <SelectItem value="txt">Text (.txt)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
                    <Button onClick={handleExport} disabled={isLoading}>
                        {isLoading ? 'Memproses...' : 'Mulai Export'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
