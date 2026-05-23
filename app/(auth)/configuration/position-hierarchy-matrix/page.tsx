import { Metadata } from "next"
import { PositionHierarchyMatrixClient } from "./components/position-hierarchy-matrix-client"

export const metadata: Metadata = {
  title: "Position Hierarchy Matrix Configuration | HRMS",
  description: "Manage position hierarchy mappings",
}

export default function PositionHierarchyMatrixPage() {
  return <PositionHierarchyMatrixClient />
}
