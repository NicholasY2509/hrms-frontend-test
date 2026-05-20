'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function EmployeeDetailSkeleton() {
  return (
    <div className="space-y-8 pb-12 animate-pulse">
      {/* Top Bar Skeleton */}
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-9 w-32 rounded-lg" />
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>

      {/* Profile Header Skeleton */}
      <div className="relative py-8 flex flex-col items-center text-center bg-muted/5 rounded-5xl border border-muted/10 h-[280px] justify-center">
        <Skeleton className="w-28 h-28 rounded-full border-4 border-background mb-4" />
        <div className="space-y-3 flex flex-col items-center">
          <Skeleton className="h-7 w-56 rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col lg:flex-row gap-4">
        {/* Sidebar Navigation Skeleton */}
        <div className="w-full lg:w-1/5 shrink-0 space-y-8">
          {[1, 2, 3].map((group) => (
            <div key={group} className="space-y-3">
              <div className="flex items-center gap-2 px-2">
                <Skeleton className="w-5 h-5 rounded-md" />
                <Skeleton className="h-3 w-20 rounded-md" />
              </div>
              <div className="ml-4 pl-4 border-l border-muted/10 space-y-3">
                {[1, 2, 3, 4].slice(0, 5 - group).map((item) => (
                  <div key={item} className="flex items-center gap-3 px-3 py-1.5">
                    <Skeleton className="w-3.5 h-3.5 rounded-full" />
                    <Skeleton className="h-4 w-full rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Content Sections Skeleton */}
        <div className="flex-1 space-y-12">
          {[1, 2].map((section) => (
            <div key={section} className="space-y-6">
              <div className="flex items-center gap-2 px-1">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="h-7 w-48 rounded-md" />
              </div>
              <Skeleton className="h-[500px] w-full rounded-3xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
