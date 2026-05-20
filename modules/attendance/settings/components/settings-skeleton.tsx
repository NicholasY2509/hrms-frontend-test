import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function SettingsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      {/* Header Skeleton */}
      <div className="relative overflow-hidden rounded-3xl bg-muted/20 p-8 border border-border/50">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <Skeleton className="h-16 w-16 rounded-2xl" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-6 w-full max-w-lg" />
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="rounded-2xl border-border/50 bg-card/40">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                  <Skeleton className="h-4 w-32 rounded-full" />
                </div>
                <div className="md:w-72">
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Bar Skeleton */}
      <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4">
        <Skeleton className="h-16 w-full max-w-2xl rounded-2xl" />
      </div>
    </div>
  );
}
