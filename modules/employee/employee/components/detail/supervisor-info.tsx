'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { HierarchyIcon } from '@hugeicons/core-free-icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Employee } from '../../types';

interface SupervisorInfoProps {
  supervisor: Employee['supervisor'];
}

export function SupervisorInfo({ supervisor }: SupervisorInfoProps) {
  return (
    <Card className="shadow-sm pt-0 border-muted/60 overflow-hidden">
      <CardHeader className="pb-3 border-b border-muted/40 bg-muted/20 py-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <HugeiconsIcon icon={HierarchyIcon} className="w-4 h-4 text-primary" />
          Atasan Langsung
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {supervisor ? (
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 rounded-xl border border-muted shadow-xs">
              <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                {supervisor.name?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{supervisor.name}</p>
              <p className="text-xs text-muted-foreground">{supervisor.nik}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">Tidak ada atasan terdaftar</p>
        )}
      </CardContent>
    </Card>
  );
}
