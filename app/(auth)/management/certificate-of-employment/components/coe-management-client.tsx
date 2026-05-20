'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Search01Icon,
  Loading03Icon,
} from '@hugeicons/core-free-icons';
import { DataTable } from '@/components/data-table/data-table';
import { PageHeader } from '@/components/layout/page-header';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { useDebounce } from '@/hooks/use-debounce';
import { useCertificateOfEmploymentList } from '@/modules/employee/certificate-of-employment/hooks/use-certificate';
import { getCertificateColumns } from '../columns';
import { CertificateOfEmploymentModel } from '@/modules/employee/certificate-of-employment/types';
import { FilterCard, FilterGrid } from '@/components/layout/filter-card';

export function CoEManagementClient() {
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState('15');

  const debouncedSearch = useDebounce(search, 500);

  const { items, meta, isLoading } = useCertificateOfEmploymentList({
    search: debouncedSearch,
    page,
    per_page: Number(perPage),
  });

  const handleView = (item: CertificateOfEmploymentModel) => {
    router.push(`/management/certificate-of-employment/${item.id}`);
  };

  const handleResetFilters = () => {
    setSearch('');
    setPage(1);
  };

  const columns = React.useMemo(
    () => getCertificateColumns(handleView),
    []
  );

  const hasActiveFilters = search !== '';

  return (
    <div className="space-y-6 w-full min-w-0">
      <PageHeader
        title="Surat Keterangan Kerja"
        description="Kelola dan pantau pengajuan Surat Keterangan Kerja karyawan."
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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 bg-card/50 rounded-xl border border-dashed">
          <HugeiconsIcon icon={Loading03Icon} className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">Memuat data surat keterangan...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={items}
          pagination={
            meta
              ? {
                ...meta,
                onPageChange: (p) => setPage(p),
              }
              : undefined
          }
        />
      )}
    </div>
  );
}
