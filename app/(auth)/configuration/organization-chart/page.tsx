import { Metadata } from "next"
import { OrganizationChartClient } from "./components/organization-chart-client"

export const metadata: Metadata = {
  title: "Organization Chart | HRMS",
  description: "View the organization position hierarchy",
}

export default function OrganizationChartPage() {
  return <OrganizationChartClient />
}
