'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Add01Icon,
  Delete02Icon,
  DragDropIcon,
  InformationCircleIcon,
  GlobalIcon,
  Loading03Icon
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { WorkLocationPicker } from '@/modules/organization/work-location/components/work-location-picker';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ApprovalRuleStep,
} from '../types';
import { ApprovalStepType } from '../../step-types/types';
import { ApprovalGroup } from '../../groups/types';
import { useApprovalGroups } from '../../groups/hooks/use-approval-groups';
import { useApprovalStepTypes } from '../../step-types/hooks/use-step-types';
import { EmployeePicker } from '@/modules/employee/employee/components/employee-picker';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { cn } from '@/lib/utils';
import { WorkPositionPicker } from '@/modules/organization/work-position/components/work-position-picker';

interface StepBuilderProps {
  steps: ApprovalRuleStep[];
  onChange: (steps: ApprovalRuleStep[]) => void;
  workLocationId?: number | null;
  onWorkLocationChange?: (id: number | null) => void;
  isDefault?: boolean;
}

interface SortableItemProps {
  step: ApprovalRuleStep;
  index: number;
  onRemove: (index: number) => void;
  onUpdate: (index: number, updates: Partial<ApprovalRuleStep>) => void;
  groups: ApprovalGroup[];
  stepTypes: ApprovalStepType[];
}

function SortableStepItem({
  step,
  index,
  onRemove,
  onUpdate,
  groups,
  stepTypes
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: step.id || `temp-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative pl-12 transition-all",
        isDragging && "opacity-50 scale-[1.02]"
      )}
    >
      {/* Sequence Indicator */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 bg-background z-10 p-1 rounded-full border shadow-sm">
        <div
          {...attributes}
          {...listeners}
          className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-accent cursor-grab active:cursor-grabbing text-muted-foreground"
        >
          <HugeiconsIcon icon={DragDropIcon} className="h-4 w-4" />
        </div>
        <span className="text-[10px] font-bold h-6 w-6 flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
          {index + 1}
        </span>
      </div>

      <Card className={cn(
        "overflow-hidden border-l-3 border-l-primary shadow-sm hover:shadow-md transition-all bg-card",
        isDragging && "shadow-xl border-primary"
      )}>
        <CardContent className="p-5 flex flex-col sm:flex-row items-start gap-4">
          <div className="flex-1 w-full space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tipe Tahapan</label>
                <Select
                  value={step.type_slug}
                  onValueChange={(val: string) => onUpdate(index, { type_slug: val, target_id: null })}
                >
                  <SelectTrigger className="h-9 bg-background border-muted-foreground/20 hover:border-primary/50 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stepTypes.map((type) => (
                      <SelectItem key={type.id} value={type.slug}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {step.type_slug === 'user' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pilih Karyawan</label>
                  <EmployeePicker
                    value={step.target_id}
                    onChange={(val) => onUpdate(index, { target_id: val })}
                  />
                </div>
              )}

              {step.type_slug === 'group' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pilih Grup</label>
                  <Select
                    value={step.target_id?.toString() || ''}
                    onValueChange={(val) => onUpdate(index, { target_id: parseInt(val) })}
                  >
                    <SelectTrigger className="h-9 bg-background border-muted-foreground/20 hover:border-primary/50 transition-colors">
                      <SelectValue placeholder="Pilih grup..." />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((g) => (
                        <SelectItem key={g.id} value={g.id.toString()}>{g.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {step.type_slug === 'work_position' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pilih Posisi</label>
                  <WorkPositionPicker
                    value={step.target_id}
                    onChange={(val: any) => onUpdate(index, { target_id: typeof val === 'string' ? parseInt(val) : val })}
                  />
                </div>
              )}
            </div>

            {stepTypes.find(t => t.slug === step.type_slug)?.description && (
              <div className="flex items-start gap-2.5 text-[12px] text-muted-foreground bg-muted/40 p-3 rounded-lg border border-border/40">
                <HugeiconsIcon icon={InformationCircleIcon} className="h-3.5 w-3.5 mt-0.5 text-primary/60 shrink-0" />
                <p className="leading-normal">
                  {stepTypes.find(t => t.slug === step.type_slug)?.description}
                </p>
              </div>
            )}
          </div>

          <div className="flex sm:flex-col items-center gap-2 self-stretch justify-end border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 sm:pl-3 mt-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              onClick={() => onRemove(index)}
            >
              <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StepItemSkeleton() {
  return (
    <div className="relative pl-12">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 bg-background z-10 p-1 rounded-full border shadow-sm">
        <div className="h-8 w-8 flex items-center justify-center rounded-full text-muted-foreground/20">
          <HugeiconsIcon icon={DragDropIcon} className="h-4 w-4" />
        </div>
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>

      <Card className="overflow-hidden border-l-4 border-l-muted shadow-sm bg-card">
        <CardContent className="p-5 flex flex-col sm:flex-row items-start gap-4">
          <div className="flex-1 w-full space-y-4">
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-9 w-full" />
            </div>
            <Skeleton className="h-14 w-full rounded-lg" />
          </div>
          <div className="flex sm:flex-col items-center gap-2 self-stretch justify-end pt-3 sm:pt-0 sm:pl-3 mt-1">
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function StepBuilder({
  steps,
  onChange,
  workLocationId,
  onWorkLocationChange,
  isDefault = false
}: StepBuilderProps) {
  const { items: groups, mutate: mutateGroups, isLoading: isLoadingGroups } = useApprovalGroups();
  const { stepTypes, mutate: mutateStepTypes, isLoading: isLoadingStepTypes } = useApprovalStepTypes();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addStep = () => {
    const newStep: ApprovalRuleStep = {
      type_slug: 'supervisor',
      sequence: steps.length + 1,
      target_id: null,
    };
    onChange([...steps, newStep]);
  };

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index).map((step, i) => ({
      ...step,
      sequence: i + 1,
    }));
    onChange(newSteps);
  };

  const updateStep = (index: number, updates: Partial<ApprovalRuleStep>) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], ...updates };
    onChange(newSteps);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = steps.findIndex((step, i) => (step.id || `temp-${i}`) === active.id);
      const newIndex = steps.findIndex((step, i) => (step.id || `temp-${i}`) === over.id);

      const movedSteps = arrayMove(steps, oldIndex, newIndex).map((step, i) => ({
        ...step,
        sequence: i + 1,
      }));

      onChange(movedSteps);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-accent/30 p-5 rounded-2xl border border-border/50 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Alur Persetujuan</h3>
            <p className="text-sm text-muted-foreground">Tentukan urutan dan siapa yang berhak menyetujui pengajuan ini.</p>
          </div>
          <Button onClick={addStep} size="sm" className="gap-2 shadow-lg shadow-primary/20">
            <HugeiconsIcon icon={Add01Icon} className="h-4 w-4" /> Tambah Tahapan
          </Button>
        </div>

        {!isDefault && onWorkLocationChange && (
          <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="shrink-0 flex items-center gap-2 text-sm font-medium">
              <HugeiconsIcon icon={GlobalIcon} className="h-4 w-4 text-primary" />
              Lokasi Kerja:
            </div>
            <div className="w-full sm:max-w-[250px]">
              {isLoadingGroups || isLoadingStepTypes ? (
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Loading03Icon} className="h-3 w-3 animate-spin" />
                  <span className="text-muted-foreground">Memuat...</span>
                </div>
              ) : (
                <WorkLocationPicker
                  value={workLocationId || null}
                  onChange={(val: any) => onWorkLocationChange(val ? (typeof val === 'string' ? parseInt(val) : val) : null)}
                  placeholder="Semua Lokasi"
                />
              )}
            </div>
            <p className="text-[11px] text-muted-foreground italic">
              * Aturan ini hanya berlaku untuk karyawan di lokasi yang dipilih.
            </p>
          </div>
        )}
      </div>

      {isLoadingGroups || isLoadingStepTypes ? (
        <div className="relative space-y-4 before:absolute before:left-[21px] before:top-6 before:bottom-6 before:w-0.5 before:bg-linear-to-b before:from-muted/20 before:via-muted/50 before:to-muted/20">
          <StepItemSkeleton />
          <StepItemSkeleton />
        </div>
      ) : steps.length === 0 ? (
        <div className="border-2 border-dashed border-muted-foreground/20 rounded-2xl p-12 text-center bg-muted/10">
          <div className="bg-background w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <HugeiconsIcon icon={Add01Icon} className="h-8 w-8 text-muted-foreground" />
          </div>
          <h4 className="text-lg font-medium mb-1">Belum ada tahapan</h4>
          <p className="text-muted-foreground text-sm max-w-[280px] mx-auto">
            Klik "Tambah Tahapan" untuk mulai membangun alur persetujuan Anda.
          </p>
        </div>
      ) : (
        <div className="relative space-y-4 before:absolute before:left-[21px] before:top-6 before:bottom-6 before:w-0.5 before:bg-linear-to-b before:from-primary/20 before:via-primary/50 before:to-primary/20">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={steps.map((s, i) => s.id || `temp-${i}`)}
              strategy={verticalListSortingStrategy}
            >
              {steps.map((step, index) => (
                <SortableStepItem
                  key={step.id || `temp-${index}`}
                  step={step}
                  index={index}
                  onRemove={removeStep}
                  onUpdate={updateStep}
                  groups={groups}
                  stepTypes={stepTypes}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}
