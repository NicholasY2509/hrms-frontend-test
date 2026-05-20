"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon } from "@hugeicons/core-free-icons";

interface OvertimeCardProps {
  monthlyHours: number;
}

export function OvertimeCard({ monthlyHours }: OvertimeCardProps) {
  return (
    <Card className="shadow-sm bg-linear-to-br from-blue-50 to-white dark:from-slate-900 dark:to-slate-800 border-blue-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Lembur Bulanan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
            <HugeiconsIcon
              icon={Clock01Icon}
              className="h-8 w-8 text-blue-700 dark:text-blue-400"
            />
          </div>
          <div>
            <div className="text-3xl font-black">{monthlyHours}</div>
            <p className="text-sm text-muted-foreground font-medium">
              Total Jam Bulan Ini
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
