'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { SaveIcon, Loading03Icon, Settings02Icon, HierarchyIcon } from '@hugeicons/core-free-icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StepBuilder } from '../../rules/components/step-builder';
import { ApprovalRuleStep } from '../../rules/types';
import { Badge } from '@/components/ui/badge';
import { useUpdateRuleSteps } from '../../rules/hooks/use-rules-mutation';
import { StepFlowSummary } from '../../rules/components/step-flow-summary';
import { useState, useEffect } from 'react';

interface PolicyStepDialogProps {
  isOpen: boolean;
  onClose: () => void;
  policy: any;
}

export function PolicyStepDialog({ isOpen, onClose, policy }: PolicyStepDialogProps) {
  const { updateSteps, isLoading } = useUpdateRuleSteps({
    schemeId: policy?.approval_scheme_id
  });
  const [steps, setSteps] = useState<ApprovalRuleStep[]>([]);
  const [workLocationId, setWorkLocationId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && policy) {
      setSteps(policy.steps || []);
      setWorkLocationId(policy.work_location_id || null);
    }
  }, [isOpen, policy]);

  const handleSave = async () => {
    if (!policy) return;
    try {
      await updateSteps({ id: policy.id, steps, work_location_id: workLocationId });
      onClose();
    } catch (error) { }
  };


  if (!policy) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[1000px] gap-0 flex flex-row p-0 h-[90vh] max-h-[900px] overflow-hidden border-none shadow-2xl">
        <aside className="hidden md:flex w-72 border-r flex-col shrink-0">
          <DialogHeader className="p-6 border-b shrink-0 flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3 text-left">
              <div className="p-2 bg-primary/10 rounded-lg">
                <HugeiconsIcon icon={HierarchyIcon} className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">Preview Alur</DialogTitle>
                <DialogDescription className="line-clamp-1">
                  {policy.name}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <StepFlowSummary steps={steps} direction="vertical" title="" />
          </div>
          <div className="p-6 border-t bg-background/50 space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Kategori</label>
              <p className="text-xs font-semibold line-clamp-1">{policy.approvable_type_name}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Target Aturan</label>
              <div className="flex items-center gap-2">
                {policy.is_default ? (
                  <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-none">Global Default</Badge>
                ) : (
                  <Badge variant="secondary" className="text-[10px]">
                    {policy.work_position?.name || policy.department?.name}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0 bg-background">
          <DialogHeader className="p-6 border-b shrink-0 flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3 text-left">
              <div className="p-2 bg-primary/10 rounded-lg">
                <HugeiconsIcon icon={Settings02Icon} className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">Atur Tahapan Persetujuan</DialogTitle>
                <DialogDescription className="line-clamp-1">
                  {policy.name}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-8 scrollbar-hide bg-muted/5">
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Konfigurasi Tahapan</h3>
                <p className="text-sm text-muted-foreground">Tambah, hapus, atau atur ulang urutan persetujuan untuk aturan ini.</p>
              </div>
              <StepBuilder
                steps={steps}
                onChange={setSteps}
                workLocationId={workLocationId}
                onWorkLocationChange={setWorkLocationId}
                isDefault={policy.is_default}
              />
            </div>
          </div>

          <DialogFooter className="p-6 border-t bg-background shrink-0 flex items-center justify-between sm:justify-between">
            <Button variant="ghost" onClick={onClose} disabled={isLoading}>
              Batal
            </Button>
            <Button onClick={handleSave} disabled={isLoading} className="gap-2 min-w-[160px] shadow-lg shadow-primary/20">
              {isLoading ? (
                <HugeiconsIcon icon={Loading03Icon} className="h-4 w-4 animate-spin" />
              ) : (
                <HugeiconsIcon icon={SaveIcon} className="h-4 w-4" />
              )}
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
