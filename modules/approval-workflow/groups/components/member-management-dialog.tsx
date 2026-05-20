'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Search01Icon,
  Loading03Icon
} from '@hugeicons/core-free-icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDebounce } from '@/hooks/use-debounce';
import { ApprovalGroup } from '../types';
import { useEffect, useState } from 'react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { useEmployees } from '@/modules/employee/employee/hooks/use-employees';
import { useSyncApprovalGroupMembers } from '../hooks/use-approval-group-mutation';

interface MemberManagementDialogProps {
  group: ApprovalGroup | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function MemberManagementDialog({
  group,
  isOpen,
  onClose,
  onSuccess,
}: MemberManagementDialogProps) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const { employees, isLoading } = useEmployees({ search: debouncedSearch });
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const { syncMembers, isLoading: isSavingMembers } = useSyncApprovalGroupMembers();

  useEffect(() => {
    if (isOpen && group?.employees) {
      setSelectedUserIds(group.employees.map((u) => String(u.id)));
    } else if (!isOpen) {
      setSelectedUserIds([]);
      setSearch('');
    }
  }, [group, isOpen]);

  const toggleUser = (userId: string | number) => {
    const idStr = String(userId);
    setSelectedUserIds((prev) =>
      prev.includes(idStr)
        ? prev.filter((id) => id !== idStr)
        : [...prev, idStr]
    );
  };

  const handleSave = async () => {
    if (!group) return;
    try {
      await syncMembers({ id: group.id, userIds: selectedUserIds });
      onSuccess?.();
      onClose();
    } catch (error) { }
  };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md flex flex-col h-[85vh] max-h-[800px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Kelola Anggota</DialogTitle>
          <DialogDescription>
            Tambah atau hapus pengguna dari grup <strong>{group?.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 mt-4">
          <div className="relative">
            <InputGroup className="flex-1 max-w-sm bg-background">
              <InputGroupAddon>
                <HugeiconsIcon icon={Search01Icon} className="text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Cari grup..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
          </div>
        </div>

        <ScrollArea className="flex-1 min-h-0 mt-4 px-6">
          <div className="space-y-2 pb-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <HugeiconsIcon icon={Loading03Icon} className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : employees.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                Pengguna tidak ditemukan.
              </p>
            ) : (
              employees.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between space-x-4 p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.photo_url || ''} />
                      <AvatarFallback>
                        {user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium leading-none">
                        {user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.position?.name} • {user.department?.name}
                      </span>
                    </div>
                  </div>
                  <Checkbox
                    checked={selectedUserIds.includes(String(user.id))}
                    onCheckedChange={() => toggleUser(user.id)}
                  />
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 border-t mt-auto sm:justify-between flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedUserIds.length} dipilih
            </span>
            <Button variant="link" size="sm" className="h-auto p-0" onClick={() => setSelectedUserIds([])}>
              Hapus semua
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button
              disabled={isSavingMembers}
              onClick={handleSave}
            >
              {isSavingMembers && <HugeiconsIcon icon={Loading03Icon} className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>

          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
