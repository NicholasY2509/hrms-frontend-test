'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, FilterIcon } from '@hugeicons/core-free-icons';
import { FilterCard, FilterGrid } from '@/components/layout/filter-card';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getModuleConfig } from './approval-inbox-constants';

interface ApprovalInboxFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  type: string;
  setType: (value: string) => void;
}

export function ApprovalInboxFilters({
  search,
  setSearch,
  type,
  setType,
}: ApprovalInboxFiltersProps) {
  return (
    <FilterCard
      onReset={() => {
        setSearch('');
        setType('all');
      }}
      hasActiveFilters={search !== '' || type !== 'all'}
    >
      <FilterGrid cols={4}>
        <InputGroup className="bg-background col-span-1 lg:col-span-3">
          <InputGroupAddon>
            <HugeiconsIcon icon={Search01Icon} className="text-muted-foreground" size={14} />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Cari nama atau nomor referensi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 text-sm"
          />
        </InputGroup>

        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="bg-background h-9 border-border shadow-none">
            <SelectValue>
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={FilterIcon} className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-xs">
                  {type === 'all' ? 'Semua Tipe' : getModuleConfig(type).label}
                </span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tipe</SelectItem>
            {['UnpaidLeave', 'Overtime', 'Career', 'WarningLetter', 'CertificateOfEmployment'].map((key) => (
              <SelectItem key={key} value={key}>
                <span className="text-xs">{getModuleConfig(key).label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterGrid>
    </FilterCard>
  );
}
