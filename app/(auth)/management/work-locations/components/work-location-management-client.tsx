'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, Search01Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { DataTable } from '@/components/data-table/data-table';
import { PageHeader } from '@/components/layout/page-header';
import { getWorkLocationColumns } from '../columns';
import { useWorkLocations } from '@/modules/organization/work-location/hooks/use-work-locations';
import { useDeleteWorkLocation } from '@/modules/organization/work-location/hooks/use-work-location-mutation';
import { useDebounce } from '@/hooks/use-debounce';
import { WorkLocation } from '@/modules/organization/work-location/types';
import { WorkLocationDialog } from '@/modules/organization/work-location/components/work-location-dialog';
import { ConfirmModal } from '@/components/ui/confirm-modal';

export function WorkLocationManagementClient() {
    const [search, setSearch] = React.useState('');
    const [page, setPage] = React.useState(1);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedLocation, setSelectedLocation] = React.useState<WorkLocation | null>(null);
    const [confirmModal, setConfirmModal] = React.useState<{
        isOpen: boolean;
        location: WorkLocation | null;
    }>({
        isOpen: false,
        location: null,
    });
    const debouncedSearch = useDebounce(search, 500);

    const { items: workLocations, meta, isLoading, mutate } = useWorkLocations({
        params: {
            search: debouncedSearch,
            page
        }
    });

    const { deleteWorkLocation } = useDeleteWorkLocation();

    const handleAdd = () => {
        setSelectedLocation(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (location: WorkLocation) => {
        setSelectedLocation(location);
        setIsDialogOpen(true);
    };

    const handleDelete = (location: WorkLocation) => {
        setConfirmModal({
            isOpen: true,
            location,
        });
    };

    const onConfirmDelete = async () => {
        if (!confirmModal.location) return;
        try {
            await deleteWorkLocation(confirmModal.location.id);
            setConfirmModal({ isOpen: false, location: null });
            mutate();
        } catch (error) {
            // Error handled by hook
        }
    };

    const columns = React.useMemo(
        () => getWorkLocationColumns(handleEdit, handleDelete),
        []
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Lokasi Kerja"
                description="Kelola daftar lokasi kerja organisasi."
            >
                <Button className="gap-2" variant="default" onClick={handleAdd}>
                    <HugeiconsIcon icon={Add01Icon} className="h-4 w-4" /> Tambah Lokasi
                </Button>
            </PageHeader>

            <div className="flex items-center gap-4">
                <InputGroup className="flex-1 max-w-sm bg-background">
                    <InputGroupAddon>
                        <HugeiconsIcon icon={Search01Icon} className="text-muted-foreground" />
                    </InputGroupAddon>
                    <InputGroupInput
                        placeholder="Cari lokasi..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </InputGroup>
            </div>

            <DataTable
                columns={columns}
                data={workLocations}
                isLoading={isLoading}
                pagination={
                    meta
                        ? {
                            ...meta,
                            onPageChange: (p) => setPage(p),
                        }
                        : undefined
                }
            />

            <WorkLocationDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                initialData={selectedLocation}
            />

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, location: null })}
                onConfirm={onConfirmDelete}
                title="Hapus Lokasi Kerja"
                description={`Apakah Anda yakin ingin menghapus lokasi kerja "${confirmModal.location?.name}"? Tindakan ini tidak dapat dibatalkan.`}
            />
        </div>
    );
}
