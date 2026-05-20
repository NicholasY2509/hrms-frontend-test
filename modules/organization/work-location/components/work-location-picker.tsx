'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick01Icon, ArrowUpDownIcon, Location01Icon, Loading03Icon } from '@hugeicons/core-free-icons';
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
import { useWorkLocations, useWorkLocationDetail } from '../hooks/use-work-locations';
import { useDebounce } from '@/hooks/use-debounce';
import { WorkLocation } from '../types';

interface WorkLocationPickerProps {
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  onSelect?: (location: WorkLocation) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function WorkLocationPicker({
  value,
  onChange,
  onSelect,
  placeholder = 'Pilih lokasi...',
  disabled,
  className
}: WorkLocationPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const { items: paginatedLocations, isLoading: isLoadingList } = useWorkLocations({ params: { search: debouncedSearch } });
  const { workLocation: selectedItem, isLoading: isLoadingDetail } = useWorkLocationDetail(value?.toString() || '');

  const workLocations = React.useMemo(() => {
    if (!selectedItem) return paginatedLocations;

    const exists = paginatedLocations.some((l) => l.id === selectedItem.id);
    return exists ? paginatedLocations : [selectedItem, ...paginatedLocations];
  }, [paginatedLocations, selectedItem]);

  const selectedLocation = selectedItem;
  const isLoading = isLoadingList || isLoadingDetail;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-background font-normal h-7 px-2 text-xs"
          disabled={disabled || isLoadingDetail}
        >
          {isLoadingDetail ? (
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Loading03Icon} className="h-3 w-3 animate-spin" />
              <span className="text-muted-foreground">Memuat...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 truncate">
              <HugeiconsIcon icon={Location01Icon} size={14} className="text-muted-foreground shrink-0" />
              {selectedLocation ? (
                <span className="truncate">{selectedLocation.name}</span>
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
            placeholder="Cari lokasi kerja..."
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
                <CommandEmpty>Lokasi tidak ditemukan.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="all"
                    onSelect={() => {
                      onChange(null);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between py-2"
                  >
                    <span>Semua Lokasi</span>
                    <HugeiconsIcon
                      icon={Tick01Icon}
                      className={cn(
                        'ml-2 h-4 w-4',
                        !value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                  {workLocations.map((loc: any) => (
                    <CommandItem
                      key={loc.id}
                      value={loc.name}
                      onSelect={() => {
                        onChange(loc.id);
                        onSelect?.(loc);
                        setOpen(false);
                      }}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="truncate">{loc.name}</span>
                      <HugeiconsIcon
                        icon={Tick01Icon}
                        className={cn(
                          'ml-2 h-4 w-4',
                          Number(value) === loc.id ? 'opacity-100' : 'opacity-0'
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
