import React from "react"
import ShiftExchangeClient from "./components/shift-exchange-client"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pertukaran Shift",
  description: "Pertukaran Shift Karyawan.",
}

function Page() {
  return <ShiftExchangeClient />
}

export default Page
