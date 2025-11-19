import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select } from './ui/select';
import { useSettingsStore } from '../store/settings-store';
import { AliasList } from './AliasList';
import { HarvestWhitelist } from './HarvestWhitelist';
import type { FeatureSettingsSchema, SettingField } from '../../shared/types/settings-ui';
import { cn } from '../lib/utils';

interface FeatureSettingsProps {
  featureId: string;
  schema: FeatureSettingsSchema;
  globalEnabled: boolean;
}

// Helper to get nested value from settings
function getNestedValue(obj: any, key: string): unknown {
  const keys = key.split('.');
  let value: unknown = obj;
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return undefined;
    }
  }
  return value;
}

export function FeatureSettings({ featureId, schema, globalEnabled }: FeatureSettingsProps) {
  const { t } = useTranslation();
  const { settings, updateSettings } = useSettingsStore();
  const [pageToggles, setPageToggles] = useState<Record<string, boolean>>({});

  const featureEnabled = settings.features?.[featureId] ?? true;

  // Update page toggles when settings change
  useEffect(() => {
    if (schema.pages && schema.pages.length > 0) {
      const featureKey = featureId === 'pr-list-customization' ? 'prList' : '';
      const featureSettings = featureKey
        ? (settings[featureKey as keyof typeof settings] as Record<string, unknown> | undefined)
        : undefined;
      const enabledOnPages = (featureSettings?.enabledOnPages as Record<string, boolean>) || {};
      const toggles: Record<string, boolean> = {};
      for (const page of schema.pages) {
        toggles[page.pageId] = enabledOnPages[page.pageId] ?? true;
      }
      setPageToggles(toggles);
    }
  }, [settings, featureId, schema]);


  async function handleFeatureToggle(enabled: boolean) {
    updateSettings({
      features: {
        ...settings.features,
        [featureId]: enabled,
      },
    });
  }

  function handleFieldChange(field: SettingField, value: unknown) {
    // Validate if validation function provided
    if (field.validation) {
      const error = field.validation(value);
      if (error) {
        console.error('Validation error:', error);
        return;
      }
    }

    // Update nested value in settings
    const keys = field.key.split('.');
    const update: any = {};
    let current = update;
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;

    updateSettings(update);
  }

  async function handlePageToggle(pageId: string, enabled: boolean) {
    const featureKey = featureId === 'pr-list-customization' ? 'prList' : '';
    const featureSettings = featureKey
      ? (settings[featureKey as keyof typeof settings] as Record<string, unknown> | undefined)
      : undefined;

    const updatedEnabledOnPages = {
      ...((featureSettings?.enabledOnPages as Record<string, boolean>) || {}),
      [pageId]: enabled,
    };

    const updatedFeatureSettings = {
      ...featureSettings,
      enabledOnPages: updatedEnabledOnPages,
    };

    updateSettings({
      [featureKey]: updatedFeatureSettings,
    });
  }

  const isDisabled = !globalEnabled || !featureEnabled;

  return (
    <Card data-feature-id={featureId} className={cn('feature-settings-section')}>
      <CardHeader>
        <label className="flex items-center gap-3 cursor-pointer">
          <Switch
            checked={featureEnabled}
            onChange={(e) => handleFeatureToggle(e.target.checked)}
            disabled={!globalEnabled}
          />
          <div className="flex items-center gap-2">
            <CardTitle className="mb-0">{schema.displayName}</CardTitle>
            {schema.description && (
              <span className="text-sm text-muted-foreground">, {schema.description}</span>
            )}
          </div>
        </label>
      </CardHeader>
      <CardContent className="space-y-4">
        {schema.pages && schema.pages.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-base font-semibold">{t('options.enableOnPages')}</h3>
            <div className="space-y-1.5">
              {schema.pages.map((page) => (
                <label key={page.pageId} className="flex items-center gap-3 cursor-pointer">
                  <Switch
                    checked={pageToggles[page.pageId] ?? true}
                    disabled={isDisabled}
                    onChange={(e) => {
                      const enabled = e.target.checked;
                      setPageToggles((prev) => ({ ...prev, [page.pageId]: enabled }));
                      handlePageToggle(page.pageId, enabled);
                    }}
                  />
                  <span className="text-sm font-normal">
                    {page.label}
                    {page.description && (
                      <span className="text-muted-foreground">, {page.description}</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {schema.fields.map((field) => {
            if (field.type === 'alias-list') {
              const keyParts = field.key.split('.');
              if (keyParts.length < 2) return null;
              const lastPart = keyParts[keyParts.length - 1];
              const aliasType = lastPart.endsWith('s') ? lastPart.slice(0, -1) : lastPart;
              if (aliasType !== 'user' && aliasType !== 'project' && aliasType !== 'org') return null;

              return (
                <div key={field.key} className="space-y-2">
                  <Label>{field.label}</Label>
                  {field.description && (
                    <p className="text-sm text-muted-foreground">{field.description}</p>
                  )}
                  <AliasList
                    aliasType={aliasType as 'user' | 'project' | 'org'}
                    settingKey={field.key}
                    disabled={isDisabled}
                  />
                </div>
              );
            }

            if (field.type === 'harvest-whitelist') {
              const keyParts = field.key.split('.');
              if (keyParts.length < 2) return null;
              const lastPart = keyParts[keyParts.length - 1];
              let whitelistType: 'org' | 'repo';
              if (lastPart.includes('Org')) {
                whitelistType = 'org';
              } else if (lastPart.includes('Repo')) {
                whitelistType = 'repo';
              } else {
                return null;
              }

              return (
                <div key={field.key} className="space-y-2">
                  <Label>{field.label}</Label>
                  {field.description && (
                    <p className="text-sm text-muted-foreground">{field.description}</p>
                  )}
                  <HarvestWhitelist
                    whitelistType={whitelistType}
                    settingKey={field.key}
                    disabled={isDisabled}
                  />
                </div>
              );
            }

            const value = getNestedValue(settings, field.key) ?? field.default;

            return (
              <div key={field.key} className={field.type === 'checkbox' ? 'flex items-center gap-3' : 'space-y-2'}>
                {field.type === 'checkbox' ? (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Switch
                      checked={Boolean(value)}
                      onChange={(e) => handleFieldChange(field, e.target.checked)}
                      disabled={isDisabled}
                    />
                    <span className="text-sm font-normal">
                      {field.label}
                      {field.description && (
                        <span className="text-muted-foreground">, {field.description}</span>
                      )}
                    </span>
                  </label>
                ) : (
                  <>
                    <Label>{field.label}</Label>
                    {field.description && (
                      <p className="text-sm text-muted-foreground">{field.description}</p>
                    )}
                  </>
                )}
                {field.type !== 'checkbox' && field.type === 'text' && (
                  <Input
                    type="text"
                    value={String(value ?? '')}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    placeholder={field.placeholder}
                    disabled={isDisabled}
                  />
                )}
                {field.type !== 'checkbox' && field.type === 'textarea' && (
                  <Textarea
                    value={String(value ?? '')}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    placeholder={field.placeholder}
                    disabled={isDisabled}
                  />
                )}
                {field.type !== 'checkbox' && field.type === 'number' && (
                  <Input
                    type="number"
                    value={String(value ?? field.default ?? '')}
                    onChange={(e) => handleFieldChange(field, Number(e.target.value))}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    disabled={isDisabled}
                  />
                )}
                {field.type !== 'checkbox' && field.type === 'select' && (
                  <Select
                    value={String(value ?? '')}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    disabled={isDisabled}
                  >
                    {field.options?.map((option) => (
                      <option key={String(option.value)} value={String(option.value)}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
