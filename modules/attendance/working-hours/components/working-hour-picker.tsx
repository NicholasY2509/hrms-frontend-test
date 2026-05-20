'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick01Icon, ArrowUpDownIcon, Clock01Icon, Loading03Icon } from '@hugeicons/core-free-icons';
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
import { useMasterWorkingHourList, useMasterWorkingHourDetail } from '../hooks/use-working-hours';
import { useDebounce } from '@/hooks/use-debounce';
import { MasterWorkingHourModel } from '../types';

interface WorkingHourPickerProps {
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  onSelect?: (workingHour: MasterWorkingHourModel) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showAllOption?: boolean;
}

export function WorkingHourPicker({
  value,
  onChange,
  onSelect,
  placeholder = 'Pilih jam kerja...',
  disabled,
  className,
  showAllOption = true,
}: WorkingHourPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const { items: paginatedItems, isLoading: isLoadingList } = useMasterWorkingHourList({ search: debouncedSearch });
  const { item: selectedItem, isLoading: isLoadingDetail } = useMasterWorkingHourDetail(Number(value));

  const items = React.useMemo(() => {
    if (!selectedItem) return paginatedItems;

    const exists = paginatedItems.some((item) => item.id === selectedItem.id);
    return exists ? paginatedItems : [selectedItem, ...paginatedItems];
  }, [paginatedItems, selectedItem]);

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
              <HugeiconsIcon icon={Clock01Icon} size={14} className="text-muted-foreground shrink-0" />
              {selectedItem ? (
                <span className="truncate">{selectedItem.name} ({selectedItem.clock_in} - {selectedItem.clock_out})</span>
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
            placeholder="Cari jam kerja..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {isLoadingList ? (
              <div className="p-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <HugeiconsIcon icon={Loading03Icon} className="h-4 w-4 animate-spin" />
                <span>Memuat...</span>
              </div>
            ) : (
              <>
                <CommandEmpty>Jam kerja tidak ditemukan.</CommandEmpty>
                <CommandGroup>
                  {showAllOption && (
                    <CommandItem
                      value="all"
                      onSelect={() => {
                        onChange(null);
                        setOpen(false);
                      }}
                      className="flex items-center justify-between py-2"
                    >
                      <span>Semua Jam Kerja</span>
                      <HugeiconsIcon
                        icon={Tick01Icon}
                        className={cn(
                          'ml-2 h-4 w-4',
                          !value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  )}
                  {items.map((item: MasterWorkingHourModel) => (
                    <CommandItem
                      key={item.id}
                      value={item.name}
                      onSelect={() => {
                        onChange(item.id);
                        onSelect?.(item);
                        setOpen(false);
                      }}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex flex-col">
                        <span className="truncate font-medium">{item.name}</span>
                        <span className="text-[10px] text-muted-foreground">{item.clock_in} - {item.clock_out}</span>
                      </div>
                      <HugeiconsIcon
                        icon={Tick01Icon}
                        className={cn(
                          'ml-2 h-4 w-4',
                          Number(value) === item.id ? 'opacity-100' : 'opacity-0'
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
