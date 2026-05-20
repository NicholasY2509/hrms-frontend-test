'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { DataTable } from '@/components/data-table/data-table';
import { PageHeader } from '@/components/layout/page-header';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { useDebounce } from '@/hooks/use-debounce';
import { getCareerColumns } from '../columns';
import { CareerModel } from '@/modules/employee/career/types';
import { useCareerList } from '@/modules/employee/career/hooks/use-career';
import { FilterCard, FilterGrid } from '@/components/layout/filter-card';

export function CareerManagementClient() {
  // Filters State
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState('15');

  const debouncedSearch = useDebounce(search, 500);

  // Fetch Careers
  const { items, meta, isLoading } = useCareerList({
    params: {
      search: debouncedSearch,
      page,
      per_page: Number(perPage),
    }
  });

  const router = useRouter();

  const handleView = (career: CareerModel) => {
    router.push(`/management/career/${career.id}`);
  };

  const handleResetFilters = () => {
    setSearch('');
    setPage(1);
  };

  const columns = React.useMemo(
    () => getCareerColumns(handleView),
    []
  );

  const hasActiveFilters = search !== '';

  return (
    <div className="space-y-6 w-full min-w-0">
      <PageHeader
        title="Riwayat Karir"
        description="Kelola mutasi, promosi, dan perubahan jabatan karyawan."
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
              placeholder="Cari nama karyawan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </FilterGrid>
      </FilterCard >

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
    </div >
  );
}
