import React from "react"
import { Metadata } from "next"
import OrgChartFlow from "@/components/org-chart/OrgChartFlow"
import { PageHeader } from "@/components/layout/page-header"

export const metadata: Metadata = {
  title: "Organization Chart | HRMS",
  description: "View the organization position hierarchy",
}

export default function OrganizationChartPage() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Diagram Perusahaan" />

      <div className="w-full overflow-hidden rounded-lg shadow-sm">
        <OrgChartFlow />
      </div>
    </div>
  )
}
