'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { DataTablePagination } from '@/components/data-table/data-table-pagination'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { useOvertimeEmployeeList } from '@/modules/overtime/hooks/use-overtime'
import { OvertimeCard } from '@/modules/overtime/components/employee-overtime-card'
import { HugeiconsIcon } from '@hugeicons/react'
import { Plus } from '@hugeicons/core-free-icons'
import { PageHeader } from '@/components/layout/page-header'
import { OvertimeTypeSelectionSheet } from '@/modules/overtime/components/overtime-type-selection-sheet'
import { DetailSheet } from '@/modules/overtime/components/employee-overtime-detail-sheet'
import { Overtime } from '@/modules/overtime/types'

export function OvertimeClient() {
    const [isSheetOpen, setIsSheetOpen] = React.useState(false)
    const [selectedOvertimeId, setSelectedOvertimeId] = React.useState<number | null>(null)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [page, setPage] = React.useState(1)
    const { items, meta, isLoading, mutate } = useOvertimeEmployeeList({ page })

    const handleViewDetail = (overtime: Overtime) => {
        setSelectedOvertimeId(overtime.id)
        setIsDetailOpen(true)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Pengajuan Lembur"
                    description="Kelola dan ajukan lembur Anda di sini."
                />
                <Button onClick={() => setIsSheetOpen(true)} className="gap-2">
                    <HugeiconsIcon icon={Plus} className="w-4 h-4" />
                    Ajukan Lembur
                </Button>
            </div>

            {
                isLoading ? (
                    <DataTableSkeleton columnCount={5} rowCount={5} />
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {items.length > 0 ? (
                                items.map((overtime) => (
                                    <OvertimeCard
                                        key={overtime.id}
                                        overtime={overtime}
                                        onClick={handleViewDetail}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full h-32 flex items-center justify-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                                    Tidak ada data pengajuan lembur.
                                </div>
                            )}
                        </div>
                        {meta && (
                            <div className="mt-2">
                                <DataTablePagination
                                    meta={meta}
                                    onPageChange={(p) => setPage(p)}
                                />
                            </div>
                        )}
                    </div>
                )
            }
            <OvertimeTypeSelectionSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
            />
            <DetailSheet
                id={selectedOvertimeId}
                isOpen={isDetailOpen}
                onClose={() => {
                    setIsDetailOpen(false)
                    setSelectedOvertimeId(null)
                }}
            />
        </div >
    )
}
