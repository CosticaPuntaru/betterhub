import { useState, useCallback } from 'react';
import { useSettingsStore } from '../store/settings-store';
import type { AliasItem, AliasType } from '../../features/aliasing/types';
import { generateDeterministicColor } from '../../features/aliasing/utils';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Select } from './ui/select';

interface AliasListProps {
  aliasType: AliasType;
  settingKey: string;
  disabled?: boolean;
}

export function AliasList({ aliasType, disabled }: AliasListProps) {
  const { settings, updateSettings } = useSettingsStore();
  const aliasing = settings.aliasing;
  const aliasList = aliasing?.[`${aliasType}s` as 'users' | 'projects' | 'orgs'] || [];
  const [adding, setAdding] = useState(false);
  const [newOriginal, setNewOriginal] = useState('');
  const [newAlias, setNewAlias] = useState('');

  const updateAlias = useCallback((original: string, updates: Partial<AliasItem>) => {
    if (!aliasing) return;
    const list = [...(aliasing[`${aliasType}s` as 'users' | 'projects' | 'orgs'] || [])];
    const index = list.findIndex(a => a.original === original);
    if (index === -1) return;
    list[index] = { ...list[index], ...updates };
    updateSettings({
      aliasing: {
        ...aliasing,
        [`${aliasType}s`]: list,
      },
    });
  }, [aliasing, aliasType, updateSettings]);

  const deleteAlias = useCallback((original: string) => {
    if (!aliasing) return;
    const list = (aliasing[`${aliasType}s` as 'users' | 'projects' | 'orgs'] || []).filter(a => a.original !== original);
    updateSettings({
      aliasing: {
        ...aliasing,
        [`${aliasType}s`]: list,
      },
    });
  }, [aliasing, aliasType, updateSettings]);

  const handleAdd = useCallback(() => {
    if (!newOriginal.trim() || !newAlias.trim()) return;
    if (!aliasing) return;
    
    const list = aliasing[`${aliasType}s` as 'users' | 'projects' | 'orgs'] || [];
    if (list.some(a => a.original.toLowerCase() === newOriginal.toLowerCase())) {
      alert(`This ${aliasType} already exists.`);
      return;
    }

    const color = aliasType === 'user' ? undefined : generateDeterministicColor(newOriginal);
    const icon = aliasType === 'user' ? '' : undefined;

    updateSettings({
      aliasing: {
        ...aliasing,
        [`${aliasType}s`]: [...list, {
          original: newOriginal.trim(),
          alias: newAlias.trim(),
          enabled: true,
          color,
          icon,
        }],
      },
    });

    setNewOriginal('');
    setNewAlias('');
    setAdding(false);
  }, [newOriginal, newAlias, aliasing, aliasType, updateSettings]);

  if (!aliasing) return null;

  return (
    <div className="my-5 p-4 border border-border rounded-md bg-card">
      <div className="mb-4 overflow-x-auto">
        <table className="w-full border-collapse bg-card border border-border rounded-md overflow-hidden">
          <thead className="bg-muted">
            <tr>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-foreground border-b border-border w-20">Enabled</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-foreground border-b border-border w-36 whitespace-nowrap">Original</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-foreground border-b border-border w-36 whitespace-nowrap">Alias</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-foreground border-b border-border w-32 whitespace-nowrap">Display</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-foreground border-b border-border whitespace-nowrap">Color/Icon</th>
              <th className="px-3 py-2.5 text-right text-xs font-semibold text-foreground border-b border-border w-24 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="[&_tr:not(:last-child)]:border-b [&_tr:not(:last-child)]:border-border [&_tr:hover]:bg-muted/50">
            {aliasList.map((alias) => (
              <AliasRow
                key={alias.original}
                alias={alias}
                onUpdate={updateAlias}
                onDelete={deleteAlias}
                disabled={disabled}
              />
            ))}
          </tbody>
        </table>
      </div>

      {adding ? (
        <div className="space-y-2 p-3 border border-border rounded-md bg-muted/50">
          <Input
            placeholder={`Original ${aliasType} name`}
            value={newOriginal}
            onChange={(e) => setNewOriginal(e.target.value)}
            disabled={disabled}
          />
          <Input
            placeholder="Alias name"
            value={newAlias}
            onChange={(e) => setNewAlias(e.target.value)}
            disabled={disabled}
          />
          <div className="flex gap-2">
            <Button onClick={handleAdd} size="sm" disabled={disabled}>Add</Button>
            <Button onClick={() => { setAdding(false); setNewOriginal(''); setNewAlias(''); }} size="sm" variant="outline">Cancel</Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setAdding(true)} disabled={disabled} size="sm">
          Add {aliasType}
        </Button>
      )}
    </div>
  );
}

interface AliasRowProps {
  alias: AliasItem;
  onUpdate: (original: string, updates: Partial<AliasItem>) => void;
  onDelete: (original: string) => void;
  disabled?: boolean;
}

function AliasRow({ alias, onUpdate, onDelete, disabled }: AliasRowProps) {
  const [displayType, setDisplayType] = useState<'color' | 'icon'>(alias.color ? 'color' : 'icon');

  const handleDisplayTypeChange = (value: string) => {
    const newType = value as 'color' | 'icon';
    setDisplayType(newType);
    if (newType === 'color') {
      onUpdate(alias.original, {
        color: alias.color || generateDeterministicColor(alias.original),
        icon: undefined,
      });
    } else {
      onUpdate(alias.original, {
        icon: alias.icon || '',
        color: undefined,
      });
    }
  };

  return (
    <tr className="whitespace-nowrap">
      <td className="px-3 py-2.5 align-middle whitespace-nowrap">
        <label className="flex items-center gap-1.5 text-sm cursor-pointer">
          <Switch
            checked={alias.enabled}
            onChange={(e) => onUpdate(alias.original, { enabled: e.target.checked })}
            disabled={disabled}
          />
        </label>
      </td>
      <td className="px-3 py-2.5 align-middle whitespace-nowrap text-sm text-foreground">
        {alias.original}
      </td>
      <td className="px-3 py-2.5 align-middle whitespace-nowrap">
        <Input
          type="text"
          value={alias.alias}
          onChange={(e) => onUpdate(alias.original, { alias: e.target.value })}
          placeholder="Text to display"
          className="w-full px-2 py-1 text-sm"
          disabled={disabled}
        />
      </td>
      <td className="px-3 py-2.5 align-middle whitespace-nowrap">
        <Select
          value={displayType}
          onChange={(e) => handleDisplayTypeChange(e.target.value)}
          disabled={disabled}
          className="w-full px-2 py-1 text-sm"
        >
          <option value="color">Color + Text</option>
          <option value="icon">Icon</option>
        </Select>
      </td>
      <td className="px-3 py-2.5 align-middle whitespace-nowrap">
        {displayType === 'color' ? (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={alias.color || '#000000'}
              onChange={(e) => onUpdate(alias.original, { color: e.target.value })}
              className="w-12 h-7 p-0.5 border border-input rounded cursor-pointer"
              disabled={disabled}
            />
            <span className="text-sm text-muted-foreground">Color</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {alias.icon ? (
              <img src={alias.icon} alt="" className="w-6 h-6 rounded" />
            ) : (
              <span className="text-sm text-muted-foreground">No icon</span>
            )}
          </div>
        )}
      </td>
      <td className="px-3 py-2.5 align-middle whitespace-nowrap text-right">
        <Button
          onClick={() => onDelete(alias.original)}
          size="sm"
          variant="destructive"
          disabled={disabled}
        >
          Delete
        </Button>
      </td>
    </tr>
  );
}

