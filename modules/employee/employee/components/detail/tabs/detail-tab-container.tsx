'use client';

import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { HugeiconsIcon } from '@hugeicons/react';
import { Skeleton } from '@/components/ui/skeleton';

interface DetailTabContainerProps {
  title: string;
  icon: any;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
  extra?: React.ReactNode;
}

export function DetailTabContainer({
  title,
  icon,
  isLoading,
  isEmpty,
  emptyMessage = "Tidak ada data tersedia.",
  children,
  extra
}: DetailTabContainerProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <HugeiconsIcon icon={icon} className="w-5 h-5 text-primary" />
          {title}
        </CardTitle>
        {extra && <CardAction>{extra}</CardAction>}
      </CardHeader>
      <CardContent className={isEmpty ? "" : "space-y-6"}>
        {isEmpty && (
          <div className="min-h-[250px] flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-5">
              <HugeiconsIcon icon={icon} className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold mb-2">{title}</h4>
            <p className="text-sm text-muted-foreground mb-8 max-w-[280px]">{emptyMessage}</p>
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
