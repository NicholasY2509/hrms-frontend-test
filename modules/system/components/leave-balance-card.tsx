import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { EmployeeDashboardData } from "@/modules/system/types/dashboard";

interface LeaveBalanceCardProps {
  employee: EmployeeDashboardData["employee"];
}

export function LeaveBalanceCard({ employee }: LeaveBalanceCardProps) {
  return (
    <Card className="border border-border/40 bg-card shadow-xs flex flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground/80">
          Saldo Cuti Tahunan
        </CardTitle>
        <CardDescription className="text-[10.5px] font-medium text-muted-foreground/75 mt-0.5">
          Kuota cuti Anda yang aktif & tersedia
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3.5">
          {/* Leave active 2 */}
          <div className="p-3 rounded-lg border border-border/35 bg-linear-to-br from-card to-muted/20 relative overflow-hidden flex flex-col gap-1 shadow-2xs">
            <span className="text-xs font-medium text-muted-foreground">
              Periode 2
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={cn(
                "font-bold text-2xl tracking-tight leading-none",
                employee.annual_leave_2 < 0 ? "text-rose-500" : "text-foreground"
              )}>
                {employee.annual_leave_2}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground">Hari</span>
            </div>
            {employee.annual_leave_2 < 0 && (
              <span className="text-[9px] font-semibold text-rose-500 mt-1 block">
                Melebihi Kuota (Hutang)
              </span>
            )}
          </div>

          {/* Leave active 3 */}
          <div className="p-3 rounded-lg border border-border/35 bg-linear-to-br from-card to-muted/20 relative overflow-hidden flex flex-col gap-1 shadow-2xs">
            <span className="text-xs font-medium text-muted-foreground">
              Periode 3
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-bold text-2xl text-foreground tracking-tight leading-none">
                {employee.annual_leave_3}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground">Hari</span>
            </div>
            <span className="text-[9px] font-semibold text-muted-foreground/60 mt-1 block">
              Tersedia
            </span>
          </div>
        </div>

        <div className="flex justify-between gap-2 pt-2 border-t border-border/30">
          <Link href="/employee/unpaid-leave" className="w-full">
            <Button variant="outline" size="sm" className="w-full text-[11px] font-semibold h-8 gap-1.5 border-border/50">
              <HugeiconsIcon icon={Calendar01Icon} className="size-3.5" />
              Ajukan Cuti
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
