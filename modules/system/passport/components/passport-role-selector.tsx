'use client';

import * as React from 'react';
import { PassportRole } from '../types';
import { usePassportClients, usePassportRoles } from '../hooks/use-passport';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';

interface PassportRoleSelectorProps {
  selectedRoles: PassportRole[];
  onChange: (roles: PassportRole[]) => void;
}

export function PassportRoleSelector({ selectedRoles, onChange }: PassportRoleSelectorProps) {
  const [selectedClientId, setSelectedClientId] = React.useState<string>('');
  const [selectedRoleId, setSelectedRoleId] = React.useState<string>('');

  const { items: clients, isLoading: clientsLoading } = usePassportClients();
  const { items: roles, isLoading: rolesLoading } = usePassportRoles(selectedClientId);

  const handleAddRole = () => {
    if (!selectedClientId || !selectedRoleId) return;
    
    const roleToAdd = roles.find(r => r.id.toString() === selectedRoleId);
    if (!roleToAdd) return;

    // Check if already added
    if (selectedRoles.some(r => r.id === roleToAdd.id)) {
      return;
    }

    const clientName = clients.find(c => c.id.toString() === selectedClientId)?.name || `Client #${roleToAdd.client_id}`;

    onChange([...selectedRoles, { ...roleToAdd, client_name: clientName }]);
    setSelectedRoleId(''); // Reset role selection after adding
  };

  const handleRemoveRole = (roleId: number) => {
    onChange(selectedRoles.filter(r => r.id !== roleId));
  };

  const groupedRoles = React.useMemo(() => {
    const groups: Record<number, { clientName: string; roles: PassportRole[] }> = {};
    
    selectedRoles.forEach(role => {
      if (!groups[role.client_id]) {
        const clientName = clients.find(c => c.id === role.client_id)?.name || `Client #${role.client_id}`;
        groups[role.client_id] = { clientName, roles: [] };
      }
      groups[role.client_id].roles.push(role);
    });

    return groups;
  }, [selectedRoles, clients]);

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <div className="grid gap-2 flex-1">
          <label className="text-sm font-medium">Aplikasi (Client)</label>
          <Select 
            value={selectedClientId} 
            onValueChange={(val) => {
              setSelectedClientId(val);
              setSelectedRoleId(''); // reset role
            }}
          >
            <SelectTrigger disabled={clientsLoading}>
              <SelectValue placeholder="Pilih Aplikasi..." />
            </SelectTrigger>
            <SelectContent>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id.toString()}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-2 flex-1">
          <label className="text-sm font-medium">Peran (Role)</label>
          <Select 
            value={selectedRoleId} 
            onValueChange={setSelectedRoleId}
            disabled={!selectedClientId || rolesLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={!selectedClientId ? 'Pilih Client dulu...' : 'Pilih Peran...'} />
            </SelectTrigger>
            <SelectContent>
              {roles.map(role => (
                <SelectItem key={role.id} value={role.id.toString()}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          type="button" 
          onClick={handleAddRole} 
          disabled={!selectedRoleId}
        >
          <HugeiconsIcon icon={Add01Icon} className="w-4 h-4 mr-2" />
          Tambah
        </Button>
      </div>

      <div className="mt-4 border rounded-md p-4 min-h-[100px] bg-background">
        {selectedRoles.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-4">
            Belum ada peran yang dipilih.
          </div>
        ) : (
          <div className="space-y-4">
            {Object.values(groupedRoles).map(group => (
              <div key={group.clientName} className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground">{group.clientName}</h4>
                <div className="flex flex-wrap gap-2">
                  {group.roles.map(role => (
                    <Badge key={role.id} variant="secondary" className="pr-1 gap-1 py-1 h-auto">
                      {role.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleRemoveRole(role.id)}
                      >
                        <HugeiconsIcon icon={Cancel01Icon} className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
