"use client";

import { useSystemSettings } from "@/modules/system/settings/hooks/use-system-settings";
import { SettingsForm } from "@/modules/attendance/settings/components/settings-form";
import { SettingsSkeleton } from "@/modules/attendance/settings/components/settings-skeleton";
import { PageError } from "@/components/layout/page-error";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function ApprovalSettingsClient() {
  const { settings, isLoading, isError, updateSettings, isUpdating } = useSystemSettings("approval");

  if (isLoading) {
    return <SettingsSkeleton count={3} />;
  }

  if (isError) {
    return <PageError />;
  }

  return (
    <div className="py-6">
      <SettingsForm
        settings={settings}
        title="Pengaturan Persetujuan"
        description="Konfigurasi batas waktu otomatis dan parameter alur kerja persetujuan."
        icon={<HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-6 w-6" />}
        onSubmit={async (data) => {
          updateSettings(data);
        }}
        isLoading={isUpdating}
      />
    </div>
  );
}
