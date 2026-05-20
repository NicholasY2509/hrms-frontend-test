import { Metadata } from "next";
import { HolidayClient } from "./holiday-client";

export const metadata: Metadata = {
  title: "Daftar Hari Libur",
};

export default function HolidaysPage() {
  return <HolidayClient />;
}