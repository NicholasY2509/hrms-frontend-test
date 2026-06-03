'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PassportRoleSelector } from '@/modules/system/passport/components/passport-role-selector';
import { WorkPositionPicker } from '@/modules/organization/work-position/components/work-position-picker';
import { useWorkPositions, useWorkPositionPassportRoles, useUpdateWorkPositionPassportRoles } from '@/modules/organization/work-position/hooks/use-work-positions';
import { PassportRole } from '@/modules/system/passport/types';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading02Icon, InformationCircleIcon, Briefcase02Icon } from '@hugeicons/core-free-icons';
import { Badge } from '@/components/ui/badge';

export function WorkPositionRolesClient() {
  const [selectedPositionId, setSelectedPositionId] = React.useState<number | null>(null);
  const [selectedRoles, setSelectedRoles] = React.useState<PassportRole[]>([]);

  const { items: positions, isLoading: isLoadingPositions } = useWorkPositions();

  const { items: mappedRoles, isLoading: isLoadingRoles } = useWorkPositionPassportRoles(selectedPositionId?.toString() || '');
  const { savePassportRoles, isLoading: isSaving } = useUpdateWorkPositionPassportRoles(selectedPositionId?.toString() || '');

  React.useEffect(() => {
    if (selectedPositionId && mappedRoles) {
      setSelectedRoles(mappedRoles);
    } else {
      setSelectedRoles([]);
    }
  }, [selectedPositionId, mappedRoles]);

  const handleSave = async () => {
    if (!selectedPositionId) return;
    await savePassportRoles({ roles: selectedRoles });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="flex flex-row gap-3 pt-6">
          <HugeiconsIcon icon={InformationCircleIcon} className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm">
            <span className="font-semibold text-foreground">Peran Khusus Jabatan</span> akan ditambahkan ke atas Peran Global untuk karyawan yang menjabat posisi tertentu. Gunakan konfigurasi ini untuk memberikan hak akses lebih tinggi, seperti akses menu manajemen atau fungsi spesifik jabatan.
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/10 shadow-sm">
        <CardHeader className="pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={Briefcase02Icon} className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Konfigurasi Berdasarkan Jabatan</CardTitle>
              <CardDescription>
                Pilih jabatan terlebih dahulu untuk melihat dan mengatur perannya.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="max-w-md mb-8">
            <label className="text-sm font-medium mb-1.5 block">Pilih Posisi Kerja</label>
            <WorkPositionPicker
              value={selectedPositionId}
              onChange={setSelectedPositionId}
              className="h-10 text-sm" // Make it match default select size
            />
          </div>

          {selectedPositionId && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-medium">Hak Akses Jabatan</h3>
                <Badge variant="secondary" className="font-normal text-xs bg-primary/10 text-primary hover:bg-primary/20 border-0">Spesifik</Badge>
              </div>
              {isLoadingRoles ? (
                <div className="flex justify-center items-center h-32 border rounded-xl bg-muted/10">
                  <HugeiconsIcon icon={Loading02Icon} className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <PassportRoleSelector
                  selectedRoles={selectedRoles}
                  onChange={setSelectedRoles}
                />
              )}
            </div>
          )}
        </CardContent>
        {selectedPositionId && (
          <CardFooter className="justify-end border-t bg-muted/20 pt-6 animate-in fade-in">
            <Button
              onClick={handleSave}
              disabled={isSaving || isLoadingRoles}
              className="min-w-[140px]"
            >
              {isSaving && <HugeiconsIcon icon={Loading02Icon} className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Konfigurasi
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
