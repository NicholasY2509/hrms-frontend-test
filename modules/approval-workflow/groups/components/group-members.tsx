'use client';

import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage, AvatarGroup, AvatarGroupCount } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ApprovalGroup } from '../types';

interface GroupMembersProps {
  group: ApprovalGroup;
}

export function GroupMembers({ group }: GroupMembersProps) {
  const employees = group.employees || [];
  const count = group.members_count || 0;
  const visibleEmployees = employees.slice(0, 3);
  const remainingCount = Math.max(0, count - visibleEmployees.length);

  if (count === 0) {
    return (
      <span className="text-xs text-muted-foreground">0 Anggota</span>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer outline-none group/trigger">
          <AvatarGroup>
            {visibleEmployees.map((emp) => (
              <Avatar key={emp.id} size="sm">
                <AvatarImage src={emp.photo_url ?? undefined} alt={emp.name} />
                <AvatarFallback className="text-[10px]">
                  {emp.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {remainingCount > 0 && (
              <AvatarGroupCount className="text-[10px] size-6">
                +{remainingCount}
              </AvatarGroupCount>
            )}
          </AvatarGroup>
          <span className="text-xs font-medium text-muted-foreground group-hover/trigger:text-primary transition-colors">
            {count} Anggota
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <ScrollArea className="h-full max-h-[300px]">
          <div className="p-2">
            {employees.length > 0 ? (
              employees.map((emp) => (
                <div key={emp.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-accent">
                  <Avatar size="sm">
                    <AvatarImage src={emp.photo_url ?? undefined} />
                    <AvatarFallback className="text-[10px]">
                      {emp.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate">{emp.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{emp.position.name}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-xs text-muted-foreground">
                Daftar anggota tidak tersedia
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
