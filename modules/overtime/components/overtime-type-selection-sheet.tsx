"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  Banknote,
  Calendar01Icon,
} from "@hugeicons/core-free-icons";

interface OvertimeTypeSelectionSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OvertimeTypeSelectionSheet({
  isOpen,
  onClose,
}: OvertimeTypeSelectionSheetProps) {
  const router = useRouter();

  const handleSelectType = (type: string) => {
    onClose();
    router.push(`/employee/overtime/create?type=${type}`);
  };

  const TypeOption = ({
    type,
    title,
    desc,
    icon: Icon,
  }: {
    type: string;
    title: string;
    desc: string;
    icon: any;
  }) => (
    <button
      type="button"
      onClick={() => handleSelectType(type)}
      className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-accent transition-all text-left group active:scale-[0.98]"
    >
      <div className="p-3 rounded-lg text-primary-foreground bg-primary bg-opacity-10 shrink-0">
        <HugeiconsIcon icon={Icon} className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground line-clamp-1">{desc}</p>
      </div>
    </button>
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="rounded-t-[2rem] p-6 outline-none lg:left-1/2! lg:right-auto! lg:-translate-x-1/2! lg:max-w-[440px]! lg:rounded-t-3xl lg:border lg:shadow-2xl"
      >
        <div className="mx-auto w-12 h-1.5 bg-muted rounded-full mb-6 sm:hidden" />

        <SheetHeader className="text-left sm:text-center">
          <SheetTitle className="text-xl">Pilih Jenis Lembur</SheetTitle>
          <SheetDescription>
            Silakan pilih kategori lembur yang ingin Anda ajukan untuk memulai pengisian form.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-3 py-8">
          <TypeOption
            type="UMUM"
            title="Lembur Reguler"
            desc="Lembur di hari kerja biasa (maks. 4 jam)"
            icon={Clock01Icon}
          />
          <TypeOption
            type="DAC"
            title="Lembur DAC"
            desc="Lembur khusus untuk pengerjaan Dac"
            icon={Banknote}
          />
          <TypeOption
            type="NATIONAL"
            title="Lembur Hari Libur"
            desc="Lembur di hari libur nasional atau akhir pekan"
            icon={Calendar01Icon}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
