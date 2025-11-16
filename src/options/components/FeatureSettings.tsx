import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select } from './ui/select';
import { useSettingsStore } from '../store/settings-store';
import { renderAliasList } from '../../features/aliasing/ui-manager';
import { renderHarvestWhitelist } from '../../features/aliasing/harvest-whitelist-manager';
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
  const { settings, updateSettings } = useSettingsStore();
  const [pageToggles, setPageToggles] = useState<Record<string, boolean>>({});
  const aliasListRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const whitelistRefs = useRef<Map<string, HTMLDivElement>>(new Map());

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

  // Render alias lists and whitelists
  useEffect(() => {
    async function renderCustomFields() {
      for (const field of schema.fields) {
        if (field.type === 'alias-list') {
          const keyParts = field.key.split('.');
          if (keyParts.length < 2) continue;
          const lastPart = keyParts[keyParts.length - 1];
          const aliasType = lastPart.endsWith('s') ? lastPart.slice(0, -1) : lastPart;
          if (aliasType !== 'user' && aliasType !== 'project' && aliasType !== 'org') continue;

          const container = aliasListRefs.current.get(field.key);
          if (container) {
            container.innerHTML = '';
            await renderAliasList(container, aliasType as 'user' | 'project' | 'org', field.key);
          }
        } else if (field.type === 'harvest-whitelist') {
          const keyParts = field.key.split('.');
          if (keyParts.length < 2) continue;
          const lastPart = keyParts[keyParts.length - 1];
          let whitelistType: 'org' | 'repo';
          if (lastPart.includes('Org')) {
            whitelistType = 'org';
          } else if (lastPart.includes('Repo')) {
            whitelistType = 'repo';
          } else {
            continue;
          }

          const container = whitelistRefs.current.get(field.key);
          if (container) {
            container.innerHTML = '';
            await renderHarvestWhitelist(container, whitelistType, field.key);
          }
        }
      }
    }

    renderCustomFields();
  }, [schema, settings]);

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
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>{schema.displayName}</CardTitle>
            {schema.description && (
              <CardDescription>{schema.description}</CardDescription>
            )}
          </div>
          <Switch
            checked={featureEnabled}
            onChange={(e) => handleFeatureToggle(e.target.checked)}
            disabled={!globalEnabled}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {schema.pages && schema.pages.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Enable on Pages</h3>
            <div className="space-y-3">
              {schema.pages.map((page) => (
                <div key={page.pageId} className="flex items-center justify-between">
                  <div>
                    <Label>{page.label}</Label>
                    {page.description && (
                      <p className="text-sm text-muted-foreground">{page.description}</p>
                    )}
                  </div>
                  <Switch
                    checked={pageToggles[page.pageId] ?? true}
                    disabled={isDisabled}
                    onChange={(e) => {
                      const enabled = e.target.checked;
                      setPageToggles((prev) => ({ ...prev, [page.pageId]: enabled }));
                      handlePageToggle(page.pageId, enabled);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {schema.fields.map((field) => {
            if (field.type === 'alias-list') {
              return (
                <div key={field.key} className="space-y-2">
                  <Label>{field.label}</Label>
                  {field.description && (
                    <p className="text-sm text-muted-foreground">{field.description}</p>
                  )}
                  <div
                    ref={(el) => {
                      if (el) aliasListRefs.current.set(field.key, el);
                    }}
                    className="alias-list-field-container"
                  />
                </div>
              );
            }

            if (field.type === 'harvest-whitelist') {
              return (
                <div key={field.key} className="space-y-2">
                  <Label>{field.label}</Label>
                  {field.description && (
                    <p className="text-sm text-muted-foreground">{field.description}</p>
                  )}
                  <div
                    ref={(el) => {
                      if (el) whitelistRefs.current.set(field.key, el);
                    }}
                    className="harvest-whitelist-field-container"
                  />
                </div>
              );
            }

            const value = getNestedValue(settings, field.key) ?? field.default;

            return (
              <div key={field.key} className="space-y-2">
                <Label>{field.label}</Label>
                {field.description && (
                  <p className="text-sm text-muted-foreground">{field.description}</p>
                )}
                {field.type === 'checkbox' && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={Boolean(value)}
                      onChange={(e) => handleFieldChange(field, e.target.checked)}
                      disabled={isDisabled}
                    />
                  </div>
                )}
                {field.type === 'text' && (
                  <Input
                    type="text"
                    value={String(value ?? '')}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    placeholder={field.placeholder}
                    disabled={isDisabled}
                  />
                )}
                {field.type === 'textarea' && (
                  <Textarea
                    value={String(value ?? '')}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    placeholder={field.placeholder}
                    disabled={isDisabled}
                  />
                )}
                {field.type === 'number' && (
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
                {field.type === 'select' && (
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
