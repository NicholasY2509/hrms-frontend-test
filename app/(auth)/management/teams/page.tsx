import { Metadata } from "next"
import { TeamManagementClient } from "./components/team-management-client"

export const metadata: Metadata = {
  title: "Tim",
  description: "Kelola tim organisasi dan kepalanya.",
}

export default function TeamsPage() {
  return <TeamManagementClient />
}
