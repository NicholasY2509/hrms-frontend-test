import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  IdCardLanyardIcon,
  Briefcase01Icon,
  BuildingIcon,
  UserIcon
} from "@hugeicons/core-free-icons";
import { EmployeeDashboardData } from "@/modules/system/types/dashboard";

interface SleekHeroBannerProps {
  employee: EmployeeDashboardData["employee"];
  tenure: string;
  getGreeting: string;
}

export function SleekHeroBanner({ employee, tenure, getGreeting }: SleekHeroBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-6 shadow-xs backdrop-blur-xs">
      <div className="absolute -right-16 -top-16 size-48 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 size-60 rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4.5">
          <Avatar className="size-16 border-2 border-primary/20 shadow-md" size="lg">
            <AvatarImage src={employee.profileUrl || undefined} alt={employee.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
              {employee.first_name[0]}
              {employee.last_name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-primary leading-none">
                {getGreeting},
              </span>
              <Badge variant="success" size="sm" className="font-semibold text-[10px] py-0.5">
                {employee.work_employee_status.name}
              </Badge>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              {employee.name}
            </h1>
            <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5 flex-wrap">
              <span className="flex items-center gap-1">
                <HugeiconsIcon icon={IdCardLanyardIcon} className="size-3.5 text-muted-foreground/70" />
                NIK: <strong className="text-foreground">{employee.nik}</strong>
              </span>
              <span className="text-muted-foreground/35">•</span>
              <span className="flex items-center gap-1">
                <HugeiconsIcon icon={Briefcase01Icon} className="size-3.5 text-muted-foreground/70" />
                {employee.position.name}
              </span>
              <span className="text-muted-foreground/35">•</span>
              <span className="flex items-center gap-1">
                <HugeiconsIcon icon={BuildingIcon} className="size-3.5 text-muted-foreground/70" />
                {employee.department.name}
              </span>
            </p>
          </div>
        </div>

        {/* Quick Stats Panel */}
        <div className="flex items-center gap-5 md:border-l border-border/45 md:pl-6 shrink-0 flex-wrap">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-muted-foreground/80">
              Masa Kerja
            </span>
            <span className="font-bold text-sm text-foreground">
              {tenure}
            </span>
          </div>
          <div className="w-px h-8 bg-border/45" />
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-muted-foreground/80">
              Supervisor
            </span>
            <span className="font-bold text-sm text-foreground flex items-center gap-1">
              <HugeiconsIcon icon={UserIcon} className="size-3.5 text-primary shrink-0" />
              {employee.supervisor?.name || "Tidak ada"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
