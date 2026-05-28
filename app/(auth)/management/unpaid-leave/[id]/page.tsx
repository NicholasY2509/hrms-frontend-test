import { Metadata } from "next"
import { UnpaidLeaveDetailClient } from "./components/unpaid-leave-detail-client"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id
  return {
    title: `Detail Izin #${id}`,
    description: `Rincian pengajuan izin/cuti karyawan dengan ID #${id}.`,
  }
}

export default function UnpaidLeaveDetailPage() {
  return <UnpaidLeaveDetailClient />
}
