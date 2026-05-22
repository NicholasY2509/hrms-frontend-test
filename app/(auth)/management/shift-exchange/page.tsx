import { Metadata } from "next"
import ShiftExchangeClient from "./components/shift-exchange-client"

export const metadata: Metadata = {
  title: "Manajemen Tukar Shift",
  description: "Kelola dan pantau permintaan tukar shift karyawan.",
}

function page() {
  return <ShiftExchangeClient />
}

export default page
