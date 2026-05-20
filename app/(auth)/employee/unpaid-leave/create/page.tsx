import { UnpaidLeaveForm } from "@/modules/unpaid-leave/components/unpaid-leave-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengajuan Cuti - HRMS",
  description: "Form pengajuan cuti karyawan",
};

export default function CreateUnpaidLeavePage() {
  return (
    <div className="">
      <UnpaidLeaveForm />
    </div>
  );
}
