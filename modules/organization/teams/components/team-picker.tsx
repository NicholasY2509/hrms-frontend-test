'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick01Icon, Loading03Icon, Search01Icon, UserGroupIcon, ArrowUpDown } from '@hugeicons/core-free-icons';
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
import { useDebounce } from '@/hooks/use-debounce';
import { useTeamDetail, useTeams } from '../hooks/use-teams';
import { Team } from '../types';

interface TeamPickerProps {
  value: string | number | null;
  onChange: (value: number | null) => void;
  onSelect?: (team: Team) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function TeamPicker({
  value,
  onChange,
  onSelect,
  placeholder = 'Pilih tim...',
  disabled,
  className
}: TeamPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const { items: paginatedTeams, isLoading: isLoadingList } = useTeams({ params: { search: debouncedSearch } });
  const { item: selectedItem, isLoading: isLoadingDetail } = useTeamDetail(value?.toString() || '');

  const teams = React.useMemo(() => {
    if (!selectedItem) return paginatedTeams;

    const exists = paginatedTeams.some((t) => t.id === selectedItem.id);
    return exists ? paginatedTeams : [selectedItem, ...paginatedTeams];
  }, [paginatedTeams, selectedItem]);

  const selectedTeam = React.useMemo(() => {
    if (!value || value === 'all') return null;
    return teams.find((t) => t.id.toString() === value.toString()) || selectedItem;
  }, [teams, value, selectedItem]);

  const isLoading = isLoadingList || isLoadingDetail;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between bg-background text-muted-foreground", className)}
          disabled={disabled || isLoadingDetail}
        >
          {isLoadingDetail ? (
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Loading03Icon} className="h-3 w-3 animate-spin" />
              <span className="text-muted-foreground">Memuat...</span>
            </div>
          ) : value === 'all' || !value ? (
            <div className="flex items-center gap-2 truncate">
              <HugeiconsIcon icon={UserGroupIcon} size={14} className="text-muted-foreground shrink-0" />
              <span className="truncate">Semua Tim</span>
            </div>
          ) : selectedTeam ? (
            <div className="flex items-center gap-2 truncate">
              <HugeiconsIcon icon={UserGroupIcon} size={14} className="text-muted-foreground shrink-0" />
              <span className="truncate">{selectedTeam.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <HugeiconsIcon icon={ArrowUpDown} className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Cari tim..."
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
                <CommandEmpty>Tim tidak ditemukan.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="all"
                    onSelect={() => {
                      onChange(null);
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 py-2"
                  >
                    <span className="truncate">Semua Tim</span>
                    <HugeiconsIcon
                      icon={Tick01Icon}
                      className={cn(
                        'ml-auto h-4 w-4',
                        !value || value === 'all' ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                  {teams.map((team: any) => (
                    <CommandItem
                      key={team.id}
                      value={team.id.toString()}
                      onSelect={() => {
                        onChange(team.id);
                        onSelect?.(team);
                        setOpen(false);
                      }}
                      className="flex items-center gap-3 py-2"
                    >
                      <div className="flex flex-col ">
                        <span className="truncate">{team.name}</span>
                        <span className="truncate text-[10px] text-muted-foreground">{team?.head?.name || '-'}</span>
                      </div>
                      <HugeiconsIcon
                        icon={Tick01Icon}
                        className={cn(
                          'ml-auto h-4 w-4',
                          Number(value) === team.id ? 'opacity-100' : 'opacity-0'
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
