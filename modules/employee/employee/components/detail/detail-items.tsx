'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@/lib/utils';

export function ContactItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="p-4 flex items-start gap-4 hover:bg-muted/30 transition-colors group">
      <div className="p-2.5 rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
        <HugeiconsIcon icon={Icon} className="w-5 h-5" />
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

export function DetailItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 p-2 rounded-lg bg-muted/40 text-muted-foreground shadow-xs">
        <HugeiconsIcon icon={Icon} className="w-4 h-4" />
      </div>
      <div className="space-y-0.5">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold tracking-tight text-foreground/90">{value}</p>
      </div>
    </div>
  );
}

export function LeaveCard({ label, value, color }: { label: string; value: number; total?: number; color: string }) {
  const colors = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    orange: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  } as any;

  return (
    <div className={cn("p-6 rounded-2xl border flex flex-col items-center justify-center gap-3", colors[color])}>
      <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-black leading-none">{value}</span>
        <span className="text-sm font-bold opacity-60">Hari</span>
      </div>
    </div>
  );
}
