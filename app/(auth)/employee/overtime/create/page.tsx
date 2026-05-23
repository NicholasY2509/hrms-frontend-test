import { OvertimeForm } from "@/modules/overtime/components/overtime-form"
import { Metadata } from "next"
import { Suspense } from "react"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"

export const metadata: Metadata = {
  title: "Ajukan Lembur - HRMS",
  description: "Form pengajuan lembur karyawan",
}

export default function CreateOvertimePage() {
  return (
    <div className="">
      <Suspense fallback={<DataTableSkeleton columnCount={1} rowCount={10} />}>
        <OvertimeForm />
      </Suspense>
    </div>
  )
}
