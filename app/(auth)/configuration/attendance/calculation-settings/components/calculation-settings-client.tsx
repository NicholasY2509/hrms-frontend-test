"use client"

import { useAttendanceCalculationSettings } from "@/modules/attendance/settings/hooks/use-attendance-settings"
import { SettingsForm } from "@/modules/attendance/settings/components/settings-form"
import { SettingsSkeleton } from "@/modules/attendance/settings/components/settings-skeleton"
import { PageError } from "@/components/layout/page-error"
import { CalculatorIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export function CalculationSettingsClient() {
  const { settings, isLoading, isError } = useAttendanceCalculationSettings()

  if (isLoading) {
    return <SettingsSkeleton count={10} />
  }

  if (isError) {
    return <PageError />
  }

  return (
    <div className="py-6">
      <SettingsForm
        settings={settings}
        title="Pengaturan Kalkulasi"
        description="Konfigurasi parameter untuk logika perhitungan dan status absensi."
        icon={<HugeiconsIcon icon={CalculatorIcon} className="h-6 w-6" />}
      />
    </div>
  )
}
