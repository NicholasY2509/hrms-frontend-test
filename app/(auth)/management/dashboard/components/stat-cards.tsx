"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserGroup02Icon,
  Clock01Icon,
  Banknote,
  UserWarningIcon
} from "@hugeicons/core-free-icons";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

function StatCard({
  title,
  value,
  description,
  icon,
  highlight = false,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(highlight && "border-red-200 bg-red-50/50")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface StatCardsProps {
  headcount: { total: number; active: number; inactive: number };
  attendance: { attendance_rate: number; present: number; absent: number };
  payroll: { total_monthly_payroll: number };
  pending: { total: number; leave: number; overtime: number };
  formatCurrency: (value: number | string) => string;
}

export function StatCards({
  headcount,
  attendance,
  payroll,
  pending,
  formatCurrency,
}: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Tenaga Kerja"
        value={headcount.total}
        description={`${headcount.active} Aktif, ${headcount.inactive} Tidak Aktif`}
        icon={<HugeiconsIcon icon={UserGroup02Icon} className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
      />
      <StatCard
        title="Kehadiran Hari Ini"
        value={`${attendance.attendance_rate}%`}
        description={`${attendance.present} Hadir / ${attendance.absent} Mangkir`}
        icon={<HugeiconsIcon icon={Clock01Icon} className="h-5 w-5 text-blue-500 dark:text-blue-300" />}
      />
      <StatCard
        title="Payroll Bulan Ini"
        value={formatCurrency(payroll.total_monthly_payroll)}
        description="Total pengeluaran bulan ini"
        icon={<HugeiconsIcon icon={Banknote} className="h-5 w-5 text-blue-700 dark:text-blue-200" />}
      />
      <StatCard
        title="Tindakan Tertunda"
        value={pending.total}
        description={`${pending.leave} Cuti, ${pending.overtime} Lembur`}
        icon={<HugeiconsIcon icon={UserWarningIcon} className="h-5 w-5 text-blue-800 dark:text-blue-100" />}
      />
    </div>
  );
}
