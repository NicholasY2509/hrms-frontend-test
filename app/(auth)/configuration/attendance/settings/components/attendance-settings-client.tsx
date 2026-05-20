"use client";

import { useAttendanceGeneralSettings } from "@/modules/attendance/settings/hooks/use-attendance-settings";
import { SettingsForm } from "@/modules/attendance/settings/components/settings-form";
import { SettingsSkeleton } from "@/modules/attendance/settings/components/settings-skeleton";
import { PageError } from "@/components/layout/page-error";
import { Clock01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function AttendanceSettingsClient() {
  const { settings, isLoading, isError } = useAttendanceGeneralSettings();

  if (isLoading) {
    return <SettingsSkeleton count={8} />;
  }

  if (isError) {
    return <PageError />;
  }

  return (
    <div className="py-6">
      <SettingsForm
        settings={settings}
        title="Pengaturan Umum Absensi"
        description="Konfigurasi parameter operasional untuk sistem absensi harian."
        icon={<HugeiconsIcon icon={Clock01Icon} className="h-6 w-6" />}
      />
    </div>
  );
}
