'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick01Icon, ArrowUpDownIcon, Briefcase01Icon, Loading03Icon } from '@hugeicons/core-free-icons';
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
import { useWorkPositions, useWorkPositionDetail } from '../hooks/use-work-positions';
import { useDebounce } from '@/hooks/use-debounce';
import { WorkPosition } from '../types';

interface WorkPositionPickerProps {
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  onSelect?: (position: WorkPosition) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function WorkPositionPicker({
  value,
  onChange,
  onSelect,
  placeholder = 'Pilih jabatan...',
  disabled,
  className
}: WorkPositionPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const { items: paginatedPositions, isLoading: isLoadingList } = useWorkPositions({ params: { search: debouncedSearch } });
  const { position: selectedItem, isLoading: isLoadingDetail } = useWorkPositionDetail(value?.toString() || '');

  const positions = React.useMemo(() => {
    if (!selectedItem) return paginatedPositions;

    const exists = paginatedPositions.some((p) => p.id === selectedItem.id);
    return exists ? paginatedPositions : [selectedItem, ...paginatedPositions];
  }, [paginatedPositions, selectedItem]);

  const selectedPosition = selectedItem;
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
              <HugeiconsIcon icon={Briefcase01Icon} size={14} className="text-muted-foreground shrink-0" />
              {selectedPosition ? (
                <span className="truncate">{selectedPosition.name}</span>
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
            placeholder="Cari jabatan..."
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
                <CommandEmpty>Jabatan tidak ditemukan.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="all"
                    onSelect={() => {
                      onChange(null);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between py-2"
                  >
                    <span>Semua Jabatan</span>
                    <HugeiconsIcon
                      icon={Tick01Icon}
                      className={cn(
                        'ml-2 h-4 w-4',
                        !value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                  {positions.map((pos: any) => (
                    <CommandItem
                      key={pos.id}
                      value={pos.name}
                      onSelect={() => {
                        onChange(pos.id);
                        onSelect?.(pos);
                        setOpen(false);
                      }}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="truncate">{pos.name}</span>
                      <HugeiconsIcon
                        icon={Tick01Icon}
                        className={cn(
                          'ml-2 h-4 w-4',
                          Number(value) === pos.id ? 'opacity-100' : 'opacity-0'
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
