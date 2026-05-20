'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft01Icon,
  Loading03Icon,
  PlusSignIcon,
  Settings02Icon,
  GlobalIcon,
  HierarchyIcon,
  Briefcase02FreeIcons,
  Building04Icon,
  InformationCircleIcon
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApprovalSchemeDetail } from '@/modules/approval-workflow/schemes/hooks/use-schemes';
import { useDeleteRule } from '@/modules/approval-workflow/rules/hooks/use-rules-mutation';
import { RuleFormDialog } from '@/modules/approval-workflow/rules/components/rule-form-dialog';
import { PageError } from "@/components/layout/page-error";
import { PolicyStepDialog } from '@/modules/approval-workflow/policies/components/policy-step-dialog';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import RuleCard from '@/modules/approval-workflow/rules/components/rule-card';
import { StepFlowSummary } from '@/modules/approval-workflow/rules/components/step-flow-summary';

export function PolicyRulesClient() {
  const params = useParams();
  const router = useRouter();
  const schemeId = params.id as string;

  const { scheme, isLoading, mutate } = useApprovalSchemeDetail(schemeId);
  const { deleteRule } = useDeleteRule();

  const [configuringRule, setConfiguringRule] = React.useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [isRuleDialogOpen, setIsRuleDialogOpen] = React.useState(false);
  const [confirmModal, setConfirmModal] = React.useState<{
    isOpen: boolean;
    rule: any | null;
  }>({
    isOpen: false,
    rule: null,
  });

  const handleEditSteps = (rule: any) => {
    if (!scheme) return;
    setConfiguringRule({
      ...rule,
      approvable_type_name: scheme.name
    });
    setIsSheetOpen(true);
  };

  const handleDeleteRule = (rule: any) => {
    setConfirmModal({
      isOpen: true,
      rule,
    });
  };

  const onConfirmDelete = async () => {
    if (!confirmModal.rule) return;
    try {
      await deleteRule(confirmModal.rule.id);
      mutate();
      setConfirmModal({ isOpen: false, rule: null });
    } catch (error) { }
  };


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <HugeiconsIcon icon={Loading03Icon} className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Memuat konfigurasi...</p>
      </div>
    );
  }

  if (!scheme) return <PageError />;

  const defaultRule = scheme.rules?.find((r: any) => r.is_default);
  const positionRules = scheme.rules?.filter((r: any) => !r.is_default && r.work_position_id) || [];
  const departmentRules = scheme.rules?.filter((r: any) => !r.is_default && r.department_id) || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <HugeiconsIcon icon={ArrowLeft01Icon} className="h-5 w-5" />
        </Button>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{scheme.name}</h1>
            <Badge variant="outline" className="font-mono text-[10px] opacity-70">
              {scheme.model_class}
            </Badge>
          </div>
          <p className="text-muted-foreground">{scheme.description || 'Kelola alur persetujuan untuk kategori ini.'}</p>
        </div>
      </div>

      <Card>
        <CardContent className='flex flex-row gap-3'>
          <HugeiconsIcon icon={InformationCircleIcon} className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
          <p>
            Sistem akan memprioritaskan aturan yang paling spesifik. Jika karyawan memiliki alur khusus berdasarkan <span className="text-foreground font-semibold">Jabatan</span> atau <span className="text-foreground font-semibold">Departemen</span>, maka alur tersebut akan digunakan. Jika tidak ada aturan khusus yang cocok, sistem akan secara otomatis menggunakan <span className="text-foreground font-semibold">Alur Utama (Default)</span> sebagai standar.
          </p>
        </CardContent>
      </Card>


      <div className="grid gap-8 lg:grid-cols-3">
        {/* LEFT: Default Flow */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <HugeiconsIcon icon={GlobalIcon} className="h-5 w-5 text-primary" />
              Alur Utama
            </h2>
          </div>

          <Card className="border-primary/20 shadow-sm overflow-hidden bg-primary/2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Aktif</Badge>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditSteps(defaultRule)}>
                    <HugeiconsIcon icon={Settings02Icon} className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-base mt-2">Alur Global</CardTitle>
              <CardDescription>Digunakan jika tidak ada aturan khusus jabatan atau departemen.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <HugeiconsIcon icon={HierarchyIcon} className="h-4 w-4" />
                  {defaultRule?.steps?.length || 0} Tahapan Persetujuan
                </div>

                <StepFlowSummary
                  steps={defaultRule?.steps || []}
                  className="p-3 bg-background/50 rounded-xl border border-primary/10"
                  title=""
                />

                <Button
                  className="w-full gap-2 mt-2"
                  variant="outline"
                  onClick={() => handleEditSteps(defaultRule)}
                >
                  <HugeiconsIcon icon={Settings02Icon} className="h-4 w-4" />
                  Konfigurasi Alur
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Specific Rules */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <HugeiconsIcon icon={Settings02Icon} className="h-5 w-5 text-muted-foreground" />
              Aturan Khusus
            </h2>
            <Button size="sm" className="gap-2" onClick={() => setIsRuleDialogOpen(true)}>
              <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4" />
              Tambah Pengecualian
            </Button>
          </div>

          {/* Position Rules */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <HugeiconsIcon icon={Briefcase02FreeIcons} className="h-4 w-4" />
              Berdasarkan Jabatan ({positionRules.length})
            </h3>

            {positionRules.length === 0 ? (
              <div className="py-8 border-2 border-dashed rounded-xl bg-muted/20 flex flex-col items-center justify-center text-center">
                <p className="text-xs text-muted-foreground">Tidak ada aturan khusus jabatan.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {positionRules.map((rule: any) => (
                  <RuleCard key={rule.id} rule={rule} onEdit={handleEditSteps} onDelete={handleDeleteRule} type="position" />
                ))}
              </div>
            )}
          </div>

          {/* Department Rules */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <HugeiconsIcon icon={Building04Icon} className="h-4 w-4" />
              Berdasarkan Departemen ({departmentRules.length})
            </h3>

            {departmentRules.length === 0 ? (
              <div className="py-8 border-2 border-dashed rounded-xl bg-muted/20 flex flex-col items-center justify-center text-center">
                <p className="text-xs text-muted-foreground">Tidak ada aturan khusus departemen.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {departmentRules.map((rule: any) => (
                  <RuleCard key={rule.id} rule={rule} onEdit={handleEditSteps} onDelete={handleDeleteRule} type="department" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <PolicyStepDialog
        isOpen={isSheetOpen}
        onClose={() => {
          setIsSheetOpen(false);
          setConfiguringRule(null);
        }}
        policy={configuringRule}
      />

      <RuleFormDialog
        isOpen={isRuleDialogOpen}
        onClose={() => setIsRuleDialogOpen(false)}
        schemeId={schemeId}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, rule: null })}
        onConfirm={onConfirmDelete}
        title="Hapus Aturan"
        description="Apakah Anda yakin ingin menghapus aturan persetujuan ini? Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
}
