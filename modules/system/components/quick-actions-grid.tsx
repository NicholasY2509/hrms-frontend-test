import * as React from "react";
import { Card } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { User03Icon, Calendar01Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

export function QuickActionsGrid() {
  const actions = [
    {
      href: "/employee/attendance",
      title: "Riwayat Presensi",
      icon: User03Icon,
    },
    {
      href: "/employee/unpaid-leave",
      title: "Cuti & Izin",
      icon: Calendar01Icon,
    },
    {
      href: "/employee/overtime",
      title: "Lembur Kerja",
      icon: Clock01Icon,
    },
  ];

  return (
    <div className="space-y-3 select-none">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold text-muted-foreground/80">
          Akses Cepat Layanan
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {actions.map((act, idx) => (
          <Link key={idx} href={act.href} className="group block select-none">
            <Card className="border border-primary/10 hover:border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-300 hover:-translate-y-0.5 py-2.5 px-4 flex items-center justify-center gap-2 cursor-pointer rounded-xl shadow-none">
              <HugeiconsIcon
                icon={act.icon}
                className="size-4 text-primary shrink-0 transition-transform duration-300 group-hover:scale-105"
              />
              <span className="text-[11.5px] font-semibold text-primary truncate">
                {act.title}
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
