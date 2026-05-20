'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { DataTable } from '@/components/data-table/data-table';
import { PageHeader } from '@/components/layout/page-header';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { useDebounce } from '@/hooks/use-debounce';
import { useWarningLetterList } from '@/modules/employee/warning-letter/hooks/use-warning-letter';
import { getWarningLetterColumns } from '../columns';
import { WarningLetterModel } from '@/modules/employee/warning-letter/types';
import { FilterCard, FilterGrid } from '@/components/layout/filter-card';

export function WarningLettersManagementClient() {
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState('15');

  const debouncedSearch = useDebounce(search, 500);

  const { items, meta, isLoading } = useWarningLetterList({
    search: debouncedSearch,
    page,
    per_page: Number(perPage),
  });

  const handleView = (item: WarningLetterModel) => {
    router.push(`/management/warning-letters/${item.id}`);
  };

  const handleResetFilters = () => {
    setSearch('');
    setPage(1);
  };

  const columns = React.useMemo(
    () => getWarningLetterColumns(handleView),
    []
  );

  const hasActiveFilters = search !== '';

  return (
    <div className="space-y-6 w-full min-w-0">
      <PageHeader
        title="Surat Peringatan"
        description="Kelola dan pantau surat peringatan (SP) karyawan."
      />

      <FilterCard
        onReset={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        perPage={perPage}
        onPerPageChange={setPerPage}
      >
        <FilterGrid cols={4}>
          <InputGroup className="">
            <InputGroupAddon>
              <HugeiconsIcon icon={Search01Icon} className="text-muted-foreground" size={14} />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Cari nama karyawan atau no dokumen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </FilterGrid>
      </FilterCard>

      <DataTable
        columns={columns}
        data={items}
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
    </div>
  );
}
