"use client";

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

interface AttendanceSnapshotProps {
  data: {
    present: number;
    late: number;
    absent: number;
    attendance_rate: number;
  };
}

export function AttendanceSnapshot({ data }: AttendanceSnapshotProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Kehadiran Langsung</CardTitle>
        <CardDescription>Status tenaga kerja hari ini</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col h-[300px] justify-between">
        <div className="space-y-3">
          <div className="flex justify-between items-center px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
              Hadir
            </span>
            <span className="text-lg font-bold text-blue-800 dark:text-blue-300">
              {data.present}
            </span>
          </div>
          <div className="flex justify-between items-center px-3 py-2 bg-slate-50 dark:bg-slate-900/20 rounded-lg border border-slate-100 dark:border-slate-800">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-400">
              Terlambat
            </span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-300">
              {data.late}
            </span>
          </div>
          <div className="flex justify-between items-center px-3 py-2 bg-slate-100 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-sm font-medium text-slate-800 dark:text-slate-400">
              Mangkir
            </span>
            <span className="text-lg font-bold text-slate-900 dark:text-slate-200">
              {data.absent}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center pt-4 border-t">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
            Tingkat Kehadiran
          </span>
          <div className="text-4xl font-black text-blue-600 dark:text-blue-400">
            {data.attendance_rate}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
