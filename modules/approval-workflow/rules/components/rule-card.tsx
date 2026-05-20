import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Settings02Icon, Delete02Icon, HierarchyIcon } from "@hugeicons/core-free-icons";
import { StepFlowSummary } from "./step-flow-summary";

export default function RuleCard({ rule, onEdit, onDelete, type }: {
    rule: any;
    onEdit: (rule: any) => void;
    onDelete: (rule: any) => void;
    type: 'position' | 'department';
}) {
    const title = type === 'position' ? rule.work_position?.name : rule.department?.name;

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 flex-row items-start justify-between space-y-0">
                <div className="space-y-1">
                    <CardTitle className="text-base font-bold">{title}</CardTitle>
                    <CardDescription className="text-xs flex items-center gap-1">
                        {rule.work_location ? rule.work_location.name : "Semua Lokasi"}
                    </CardDescription>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(rule)}>
                        <HugeiconsIcon icon={Settings02Icon} className="h-4 w-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(rule)}>
                        <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5 font-medium">
                            <HugeiconsIcon icon={HierarchyIcon} className="h-3.5 w-3.5" />
                            {rule.steps?.length || 0} Tahapan
                        </div>
                    </div>

                    <StepFlowSummary steps={rule.steps || []} variant="compact" />
                </div>
            </CardContent>
        </Card>
    );
}