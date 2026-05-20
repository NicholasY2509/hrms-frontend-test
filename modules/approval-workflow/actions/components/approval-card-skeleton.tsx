import * as React from 'react';

export function ApprovalCardSkeleton() {
  return (
    <div className="rounded-lg border border-border/50 bg-card animate-pulse p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div className="h-3 w-20 bg-muted rounded" />
        <div className="h-3 w-10 bg-muted rounded" />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-3/4 bg-muted rounded" />
          <div className="h-2.5 w-1/2 bg-muted rounded" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-full bg-muted rounded" />
        <div className="h-8 w-full bg-muted rounded" />
      </div>
    </div>
  );
}
