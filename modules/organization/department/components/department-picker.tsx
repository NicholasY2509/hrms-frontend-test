'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick01Icon, ArrowUpDownIcon, Building01Icon, Loading03Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useDepartments, useDepartmentDetail } from '../hooks/use-departments';
import { useDebounce } from '@/hooks/use-debounce';
import { Department } from '../types';

interface DepartmentPickerProps {
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  onSelect?: (department: Department) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DepartmentPicker({
  value,
  onChange,
  onSelect,
  placeholder = 'Pilih departemen...',
  disabled,
  className
}: DepartmentPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const { items: paginatedDepartments, isLoading: isLoadingList } = useDepartments({ params: { search: debouncedSearch } });
  const { department: selectedItem, isLoading: isLoadingDetail } = useDepartmentDetail(value);

  const departments = React.useMemo(() => {
    if (!selectedItem) return paginatedDepartments;

    const exists = paginatedDepartments.some((d) => d.id === selectedItem.id);
    return exists ? paginatedDepartments : [selectedItem, ...paginatedDepartments];
  }, [paginatedDepartments, selectedItem]);

  const selectedDepartment = selectedItem;
  const isLoading = isLoadingList || isLoadingDetail;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between bg-background font-normal h-7 px-2 text-xs", className)}
          disabled={disabled || isLoadingDetail}
        >
          {isLoadingDetail ? (
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Loading03Icon} className="h-3 w-3 animate-spin" />
              <span className="text-muted-foreground">Memuat...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 truncate">
              <HugeiconsIcon icon={Building01Icon} size={14} className="text-muted-foreground shrink-0" />
              {selectedDepartment ? (
                <span className="truncate">{selectedDepartment.name}</span>
              ) : (
                <span className="text-muted-foreground truncate">{placeholder}</span>
              )}
            </div>
          )}
          <HugeiconsIcon icon={ArrowUpDownIcon} className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Cari departemen..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {isLoading ? (
              <div className="p-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <HugeiconsIcon icon={Loading03Icon} className="h-4 w-4 animate-spin" />
                <span>Memuat...</span>
              </div>
            ) : (
              <>
                <CommandEmpty>Departemen tidak ditemukan.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="all"
                    onSelect={() => {
                      onChange(null);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between py-2"
                  >
                    <span>Semua Departemen</span>
                    <HugeiconsIcon
                      icon={Tick01Icon}
                      className={cn(
                        'ml-2 h-4 w-4',
                        !value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                  {departments.map((dept: any) => (
                    <CommandItem
                      key={dept.id}
                      value={dept.name}
                      onSelect={() => {
                        onChange(dept.id);
                        onSelect?.(dept);
                        setOpen(false);
                      }}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="truncate">{dept.name}</span>
                      <HugeiconsIcon
                        icon={Tick01Icon}
                        className={cn(
                          'ml-2 h-4 w-4',
                          Number(value) === dept.id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
