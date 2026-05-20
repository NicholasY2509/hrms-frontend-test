"use client";

import { useManagementDashboard } from "@/modules/system/hooks/use-management-dashboard";
import { PageHeader } from "@/components/layout/page-header";
import { PageError } from "@/components/layout/page-error";
import { Skeleton } from "@/components/ui/skeleton";

// Components
import { StatCards } from "./stat-cards";
import { GrowthTrendChart } from "./growth-trend-chart";
import { DiversityChart } from "./diversity-chart";
import { OvertimeCard } from "./overtime-card";
import { DepartmentDistributionChart } from "./department-distribution-chart";
import { PayrollBreakdownChart } from "./payroll-breakdown-chart";
import { LocationDistributionChart } from "./location-distribution-chart";
import { AttendanceSnapshot } from "./attendance-snapshot";
import { AttritionAnalysis } from "./attrition-analysis";

export function ManagementDashboardClient() {
  const { data, isLoading, isError } = useManagementDashboard();

  if (isLoading) return <DashboardSkeleton />;
  if (isError || !data) return <PageError />;

  const {
    workforce_overview,
    attendance_productivity,
    attrition_retention,
    payroll_insights,
    pending_requests_count,
  } = data;

  const formatCurrency = (value: number | string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(value));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Manajemen"
        description="Ringkasan komprehensif metrik tenaga kerja, absensi, dan payroll."
      />

      {/* Primary Metrics Row */}
      <StatCards
        headcount={workforce_overview.headcount}
        attendance={attendance_productivity.today}
        payroll={payroll_insights}
        pending={pending_requests_count}
        formatCurrency={formatCurrency}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GrowthTrendChart data={workforce_overview.growth_trend} />
        <div className="space-y-6">
          <DiversityChart data={workforce_overview.distribution.gender} />
          <OvertimeCard monthlyHours={attendance_productivity.monthly_overtime_hours} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepartmentDistributionChart data={workforce_overview.distribution.department} />
        <PayrollBreakdownChart
          data={payroll_insights.department_cost_breakdown}
          formatCurrency={formatCurrency}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LocationDistributionChart data={workforce_overview.distribution.location} />
        <AttendanceSnapshot data={attendance_productivity.today} />
        <AttritionAnalysis
          data={attrition_retention.reasons_distribution}
          totalResigned={attrition_retention.total_resigned_6_months}
        />
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="lg:col-span-2 h-[400px] w-full rounded-xl" />
        <div className="space-y-6">
          <Skeleton className="h-[250px] w-full rounded-xl" />
          <Skeleton className="h-[125px] w-full rounded-xl" />
        </div>
      </div>

      {/* Bottom Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>

      {/* Bottom Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Skeleton className="h-[350px] w-full rounded-xl" />
        <Skeleton className="h-[350px] w-full rounded-xl" />
        <Skeleton className="h-[350px] w-full rounded-xl" />
      </div>
    </div>
  );
}
