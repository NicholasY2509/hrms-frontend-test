"use client";

import * as React from "react";
import { Clock01Icon, ChevronDown } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TimePickerProps {
  value?: string;
  onChange?: (time: string | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  variant?: "hours" | "minutes" | "seconds";
}

export function TimePicker({
  value,
  onChange,
  placeholder = "Pilih waktu",
  className,
  disabled,
  variant = "seconds",
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const parsedValue = React.useMemo(() => {
    if (!value) return { hour: "00", minute: "00", second: "00" };
    const parts = value.split(":");
    return {
      hour: parts[0] || "00",
      minute: parts[1] || "00",
      second: parts[2] || "00",
    };
  }, [value]);

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));
  const seconds = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

  const handleTimeChange = (type: "hour" | "minute" | "second", newValue: string) => {
    const nextTime = { ...parsedValue, [type]: newValue };

    let timeString = nextTime.hour;
    if (variant === "minutes" || variant === "seconds") {
      timeString += `:${nextTime.minute}`;
    }
    if (variant === "seconds") {
      timeString += `:${nextTime.second}`;
    }

    onChange?.(timeString);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-between text-left font-normal px-3 h-11 rounded-xl bg-background/50 border-border/60",
            !value && "text-muted-foreground",
            className
          )}
        >
          <div className="flex items-center gap-2 truncate">
            <HugeiconsIcon icon={Clock01Icon} size={18} className="shrink-0 text-primary/70" />
            <span className="truncate font-medium">
              {value || placeholder}
            </span>
          </div>
          <HugeiconsIcon
            icon={ChevronDown}
            size={16}
            className="text-muted-foreground shrink-0"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] min-w-fit p-0 rounded-3xl shadow-2xl border-border/40 overflow-hidden bg-background/95 backdrop-blur-xl"
        align="start"
      >
        <div className="flex h-[280px] relative">
          <TimeColumn
            label="JAM"
            items={hours}
            value={parsedValue.hour}
            onChange={(v) => handleTimeChange("hour", v)}
            isOpen={open}
          />
          {(variant === "minutes" || variant === "seconds") && (
            <TimeColumn
              label="MIN"
              items={minutes}
              value={parsedValue.minute}
              onChange={(v) => handleTimeChange("minute", v)}
              isOpen={open}
            />
          )}
          {variant === "seconds" && (
            <TimeColumn
              label="DET"
              items={seconds}
              value={parsedValue.second}
              onChange={(v) => handleTimeChange("second", v)}
              isOpen={open}
            />
          )}
        </div>

        <div className="flex items-center gap-2 border-t border-border/20 p-4 bg-muted/10 backdrop-blur-md">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 py-1 font-medium hover:bg-accent/50 text-foreground/80"
            onClick={() => {
              const now = new Date();
              const h = now.getHours().toString().padStart(2, "0");
              const m = now.getMinutes().toString().padStart(2, "0");
              const s = now.getSeconds().toString().padStart(2, "0");

              let timeString = h;
              if (variant === "minutes" || variant === "seconds") {
                timeString += `:${m}`;
              }
              if (variant === "seconds") {
                timeString += `:${s}`;
              }

              onChange?.(timeString);
            }}
          >
            Sekarang
          </Button>
          <div className="w-px h-4 bg-border/60" />
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 py-1 font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
            onClick={() => onChange?.(undefined)}
          >
            Bersihkan
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface TimeColumnProps {
  label: string;
  items: string[];
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
}

function TimeColumn({ label, items, value, onChange, isOpen }: TimeColumnProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
  const [scrollTop, setScrollTop] = React.useState(0);
  const [containerHeight, setContainerHeight] = React.useState(0);

  // Sync scroll position and container height
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  React.useLayoutEffect(() => {
    if (scrollRef.current) {
      setContainerHeight(scrollRef.current.clientHeight);
    }
  }, []);

  React.useEffect(() => {
    if (isOpen && value) {
      const activeItem = itemRefs.current.get(value);
      if (activeItem && scrollRef.current) {
        const timer = setTimeout(() => {
          activeItem.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          if (scrollRef.current) setScrollTop(scrollRef.current.scrollTop);
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [value, isOpen]);

  const ITEM_HEIGHT = 44;
  const bufferHeight = containerHeight ? (containerHeight - ITEM_HEIGHT) / 2 : 84;

  return (
    <div className="flex flex-col flex-1 min-w-[70px] relative border-r border-border/10 last:border-r-0">
      <div className="h-11 flex items-center justify-center text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/40 bg-muted/5 border-b border-border/20 shrink-0 z-20">
        {label}
      </div>
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto snap-y snap-mandatory no-scrollbar select-none h-full z-0"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          maskImage: 'linear-gradient(to bottom, transparent, black 40%, black 60%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 40%, black 60%, transparent)'
        }}
      >
        <div
          className="flex flex-col items-center"
          style={{ paddingTop: bufferHeight, paddingBottom: bufferHeight }}
        >
          {items.map((val, index) => {
            const itemCenter = index * ITEM_HEIGHT + bufferHeight + ITEM_HEIGHT / 2;
            const viewportCenter = scrollTop + (containerHeight / 2) - 4;
            const distanceFromCenter = Math.abs(itemCenter - viewportCenter);

            const scale = Math.max(0.7, 1.4 - (distanceFromCenter / 150));
            const opacity = Math.max(0.1, 1 - (distanceFromCenter / 120));
            const rotateX = (itemCenter - viewportCenter) / 4;

            return (
              <button
                key={val}
                ref={(el) => {
                  if (el) itemRefs.current.set(val, el);
                  else itemRefs.current.delete(val);
                }}
                type="button"
                className={cn(
                  "w-full h-[44px] shrink-0 flex items-center justify-center font-mono text-4xl transition-colors snap-center outline-none will-change-transform",
                  value === val ? "text-primary font-bold z-10" : "text-foreground z-0"
                )}
                style={{
                  transform: `perspective(600px) scale(${scale * 0.85}) rotateX(${rotateX}deg) translateZ(0)`,
                  opacity: opacity,
                  backfaceVisibility: "hidden",
                  WebkitFontSmoothing: "antialiased",
                }}
                onClick={() => onChange(val)}
              >
                {val}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
