'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PassportRoleSelector } from '@/modules/system/passport/components/passport-role-selector';
import { useGlobalPassportRoles, useUpdateGlobalPassportRoles } from '@/modules/system/passport/hooks/use-passport';
import { PassportRole } from '@/modules/system/passport/types';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading02Icon, InformationCircleIcon, GlobalIcon } from '@hugeicons/core-free-icons';

export function GlobalPassportRolesClient() {
  const { items: globalRoles, isLoading: isLoadingRoles } = useGlobalPassportRoles();
  const { saveGlobalRoles, isLoading: isSaving } = useUpdateGlobalPassportRoles();

  const [selectedRoles, setSelectedRoles] = React.useState<PassportRole[]>([]);

  // Initialize state when data is loaded
  React.useEffect(() => {
    if (globalRoles) {
      setSelectedRoles(globalRoles);
    }
  }, [globalRoles]);

  const handleSave = async () => {
    await saveGlobalRoles({ roles: selectedRoles });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="flex flex-row gap-3 pt-6">
          <HugeiconsIcon icon={InformationCircleIcon} className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm">
            <span className="font-semibold text-foreground">Peran Global</span> akan diberikan secara otomatis kepada <span className="font-semibold text-foreground">seluruh karyawan baru</span> di dalam sistem. Peran ini berfungsi sebagai hak akses dasar untuk layanan-layanan yang terhubung.
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/10 shadow-sm">
        <CardHeader className="pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={GlobalIcon} className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Konfigurasi Peran Dasar</CardTitle>
              <CardDescription>
                Pilih peran-peran (roles) dari aplikasi terintegrasi yang harus dimiliki oleh semua karyawan.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoadingRoles ? (
            <div className="flex justify-center items-center h-32">
              <HugeiconsIcon icon={Loading02Icon} className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <PassportRoleSelector
                selectedRoles={selectedRoles}
                onChange={setSelectedRoles}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-end border-t bg-muted/20 pt-6">
          <Button
            onClick={handleSave}
            disabled={isSaving || isLoadingRoles}
            className="min-w-[140px]"
          >
            {isSaving && <HugeiconsIcon icon={Loading02Icon} className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Konfigurasi
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
