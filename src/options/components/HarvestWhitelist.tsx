import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../store/settings-store';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Switch } from './ui/switch';

interface HarvestWhitelistProps {
  whitelistType: 'org' | 'repo';
  settingKey: string;
  disabled?: boolean;
}

export function HarvestWhitelist({ whitelistType, disabled }: HarvestWhitelistProps) {
  const { t } = useTranslation();
  const { settings, updateSettings } = useSettingsStore();
  const aliasing = settings.aliasing;
  const whitelistKey = whitelistType === 'org' ? 'harvestOrgWhitelist' : 'harvestRepoWhitelist';
  const currentWhitelist = aliasing?.[whitelistKey];
  const isAllowAll = currentWhitelist === 'all';
  const list = Array.isArray(currentWhitelist) ? currentWhitelist : [];

  const [newItem, setNewItem] = useState('');

  const handleAllowAllChange = useCallback((checked: boolean) => {
    if (!aliasing) return;
    updateSettings({
      aliasing: {
        ...aliasing,
        [whitelistKey]: checked ? 'all' : [],
      },
    });
  }, [aliasing, whitelistKey, updateSettings]);

  const handleAdd = useCallback(() => {
    if (!newItem.trim()) return;
    if (!aliasing) return;

    const currentList = Array.isArray(aliasing[whitelistKey]) ? (aliasing[whitelistKey] as string[]) : [];
    if (currentList.some(item => item.toLowerCase() === newItem.toLowerCase())) {
      alert(t('features.aliasing.ui.alertWhitelistExists', { type: whitelistType }));
      return;
    }

    updateSettings({
      aliasing: {
        ...aliasing,
        [whitelistKey]: [...currentList, newItem.trim()],
      },
    });

    setNewItem('');
  }, [newItem, aliasing, whitelistKey, whitelistType, updateSettings, t]);

  const handleDelete = useCallback((item: string) => {
    if (!aliasing) return;
    const currentList = Array.isArray(aliasing[whitelistKey]) ? (aliasing[whitelistKey] as string[]) : [];
    const filtered = currentList.filter(i => i.toLowerCase() !== item.toLowerCase());
    updateSettings({
      aliasing: {
        ...aliasing,
        [whitelistKey]: filtered,
      },
    });
  }, [aliasing, whitelistKey, updateSettings]);

  if (!aliasing) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Switch
          checked={isAllowAll}
          onChange={(e) => handleAllowAllChange(e.target.checked)}
          disabled={disabled}
        />
        <Label>{t('features.aliasing.ui.allowAll')}</Label>
      </div>

      {!isAllowAll && (
        <>
          <div className="mb-3 overflow-x-auto">
            <table className="w-full border-collapse bg-card border border-border rounded-md overflow-hidden">
              <thead className="bg-muted">
                <tr>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-foreground border-b border-border whitespace-nowrap">{t('features.aliasing.ui.name')}</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-foreground border-b border-border w-24 whitespace-nowrap">{t('features.aliasing.ui.actions')}</th>
                </tr>
              </thead>
              <tbody className="[&_tr:not(:last-child)]:border-b [&_tr:not(:last-child)]:border-border [&_tr:hover]:bg-muted/50">
                {list.map((item) => (
                  <tr key={item} className="harvest-whitelist-row">
                    <td className="px-3 py-2.5 align-middle whitespace-nowrap text-sm text-foreground">
                      {item}
                    </td>
                    <td className="px-3 py-2.5 align-middle whitespace-nowrap text-right">
                      <Button
                        onClick={() => handleDelete(item)}
                        size="sm"
                        variant="destructive"
                        disabled={disabled}
                      >
                        {t('features.aliasing.ui.delete')}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAdd();
            }}
            className="flex gap-2 items-end"
          >
            <div className="flex-1 space-y-1">
              <Label className="text-sm">
                {whitelistType === 'org' ? t('features.aliasing.ui.orgName') : t('features.aliasing.ui.repoName')}
              </Label>
              <Input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder={whitelistType === 'repo' ? t('features.aliasing.ui.ownerRepoPlaceholder') : t('features.aliasing.ui.orgNamePlaceholder')}
                disabled={disabled}
              />
            </div>
            <Button type="submit" disabled={disabled || !newItem.trim()}>
              {t('features.aliasing.ui.add')}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}

