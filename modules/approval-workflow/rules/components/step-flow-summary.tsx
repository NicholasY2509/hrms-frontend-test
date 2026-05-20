'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { ApprovalRuleStep } from '../types';
import { cn } from '@/lib/utils';

interface StepFlowItemProps {
  step: ApprovalRuleStep;
  index: number;
  variant?: 'default' | 'compact';
}

export function StepFlowItem({ step, index, variant = 'default' }: StepFlowItemProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1 bg-muted/50 rounded-md px-1.5 py-0.5 border border-border/50 max-w-[150px]">
        <span className="text-[9px] font-bold text-muted-foreground/70">{index + 1}</span>
        <span className="text-[9px] text-foreground/70 truncate">
          {step.target_name || step.type_slug.replace(/_/g, ' ')}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 shrink-0 bg-background border rounded-md px-2.5 py-1.5 min-w-[120px]">
      <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
        {index + 1}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] leading-tight truncate">
          {step.target_name || step.type_slug.replace(/_/g, ' ')}
        </span>
      </div>
    </div>
  );
}

interface StepFlowSummaryProps {
  steps: ApprovalRuleStep[];
  className?: string;
  title?: string;
  variant?: 'default' | 'compact';
  direction?: 'horizontal' | 'vertical';
}

export function StepFlowSummary({
  steps,
  className,
  title = "Ringkasan Alur",
  variant = 'default',
  direction = 'horizontal'
}: StepFlowSummaryProps) {
  const isCompact = variant === 'compact';
  const isVertical = direction === 'vertical';

  return (
    <div className={cn(
      isCompact ? "p-0 bg-transparent border-none" : isVertical ? "p-0" : "px-6 pb-4 border-b",
      className
    )}>
      {!isCompact && title && (
        <h3 className={cn(
          "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
          isVertical ? "mb-4" : "mb-3"
        )}>
          {title}
        </h3>
      )}
      <div className={cn(
        "flex gap-2 no-scrollbar pb-1",
        isVertical ? "flex-col items-start" : "flex-row items-center overflow-x-auto"
      )}>
        {steps.length === 0 ? (
          <span className="text-xs text-muted-foreground italic">
            Belum ada tahapan yang dikonfigurasi.
          </span>
        ) : (
          steps.map((step, index) => (
            <React.Fragment key={index}>
              <StepFlowItem step={step} index={index} variant={variant} />
              {index < steps.length - 1 && (
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className={cn(
                    "shrink-0 text-muted-foreground/30",
                    isCompact ? "h-2.5 w-2.5" : "h-3 w-3",
                    isVertical && "rotate-90 ml-3.5 my-1"
                  )}
                />
              )}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
}
