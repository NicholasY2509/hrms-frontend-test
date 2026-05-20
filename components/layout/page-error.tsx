import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { InformationCircleIcon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

interface PageErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export function PageError({
  title = 'Terjadi Kesalahan',
  description = 'Data tidak dapat dimuat. Silakan coba lagi atau hubungi administrator.',
  className,
  ...props
}: PageErrorProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-24 gap-4 text-center',
        className
      )}
      {...props}
    >
      <div className="p-4 rounded-full bg-destructive/10">
        <HugeiconsIcon
          icon={InformationCircleIcon}
          className="h-10 w-10 text-destructive"
        />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      </div>
    </div>
  );
}
