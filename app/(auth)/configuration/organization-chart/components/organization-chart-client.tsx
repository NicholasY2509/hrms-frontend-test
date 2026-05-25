"use client"

import React from "react"
import { PageHeader } from "@/components/layout/page-header"
import OrgChartFlow from "@/components/org-chart/OrgChartFlow"

export function OrganizationChartClient() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Diagram Perusahaan" />

      <div className="w-full overflow-hidden rounded-lg shadow-sm">
        <OrgChartFlow />
      </div>
    </div>
  )
}
