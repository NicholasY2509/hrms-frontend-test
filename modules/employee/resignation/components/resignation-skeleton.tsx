"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ResignationSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex flex-col gap-2">
                <Skeleton className="h-8 w-64 rounded-lg" />
                <Skeleton className="h-4 w-96 rounded" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
                {/* Left side skeleton */}
                <div className="col-span-12 lg:col-span-5 space-y-4">
                    <Skeleton className="h-[320px] w-full rounded-2xl" />
                </div>
                {/* Right side skeleton */}
                <div className="col-span-12 lg:col-span-7">
                    <Skeleton className="h-[420px] w-full rounded-2xl" />
                </div>
            </div>
        </div>
    );
}
