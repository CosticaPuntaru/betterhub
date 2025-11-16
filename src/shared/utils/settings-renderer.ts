/**
 * Utility to render settings UI from schema
 */

import type { SettingField, FeatureSettingsSchema } from '../types/settings-ui';
import { settingsManager } from './settings-manager';
import type { Settings } from '../types/settings';
import { renderAliasList } from '../../features/aliasing/ui-manager';
import { renderHarvestWhitelist } from '../../features/aliasing/harvest-whitelist-manager';

/**
 * Get nested value from settings object using dot notation key
 */
function getNestedValue(obj: Settings, key: string): unknown {
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

/**
 * Set nested value in settings object using dot notation key
 */
function setNestedValue(obj: Settings, key: string, value: unknown): void {
  const keys = key.split('.');
  let current: Record<string, unknown> = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (!(k in current) || typeof current[k] !== 'object') {
      current[k] = {};
    }
    current = current[k] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;
}

/**
 * Get current value for a setting field
 */
export async function getSettingValue(field: SettingField): Promise<unknown> {
  const settings = await settingsManager.getSettings();
  const value = getNestedValue(settings, field.key);
  return value !== undefined ? value : field.default;
}

/**
 * Update setting value
 */
export async function updateSettingValue(
  field: SettingField,
  value: unknown
): Promise<void> {
  // Validate if validation function provided
  if (field.validation) {
    const error = field.validation(value);
    if (error) {
      throw new Error(error);
    }
  }

  const settings = await settingsManager.getSettings();
  setNestedValue(settings, field.key, value);
  await settingsManager.updateSettings(settings);
}

/**
 * Render a setting field to HTML element
 */
export async function renderSettingField(
  field: SettingField,
  container: HTMLElement
): Promise<void> {
  const value = await getSettingValue(field);

  const fieldContainer = document.createElement('div');
  fieldContainer.className = 'setting-field';
  fieldContainer.dataset.settingKey = field.key;

  const label = document.createElement('label');
  label.className = 'setting-label';
  label.textContent = field.label; // Will be translated by i18n

  if (field.description) {
    const description = document.createElement('p');
    description.className = 'setting-description';
    description.textContent = field.description; // Will be translated by i18n
    fieldContainer.appendChild(description);
  }

  let input: HTMLElement;

  switch (field.type) {
    case 'checkbox': {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = Boolean(value);
      checkbox.addEventListener('change', async () => {
        await updateSettingValue(field, checkbox.checked);
      });
      input = checkbox;
      break;
    }
    case 'select': {
      const select = document.createElement('select');
      if (field.options) {
        field.options.forEach((option) => {
          const optionEl = document.createElement('option');
          optionEl.value = String(option.value);
          optionEl.textContent = option.label;
          optionEl.selected = value === option.value;
          select.appendChild(optionEl);
        });
      }
      select.addEventListener('change', async () => {
        await updateSettingValue(field, select.value);
      });
      input = select;
      break;
    }
    case 'number': {
      const numberInput = document.createElement('input');
      numberInput.type = 'number';
      numberInput.value = String(value ?? field.default);
      if (field.min !== undefined) numberInput.min = String(field.min);
      if (field.max !== undefined) numberInput.max = String(field.max);
      if (field.step !== undefined) numberInput.step = String(field.step);
      numberInput.addEventListener('change', async () => {
        await updateSettingValue(field, Number(numberInput.value));
      });
      input = numberInput;
      break;
    }
    case 'text':
    case 'textarea': {
      const textInput =
        field.type === 'textarea'
          ? document.createElement('textarea')
          : document.createElement('input');
      if (field.type === 'text') {
        (textInput as HTMLInputElement).type = 'text';
      }
      textInput.value = String(value ?? field.default);
      if (field.placeholder) {
        (textInput as HTMLInputElement | HTMLTextAreaElement).placeholder =
          field.placeholder;
      }
      textInput.addEventListener('change', async () => {
        await updateSettingValue(field, textInput.value);
      });
      input = textInput;
      break;
    }
        case 'alias-list': {
          // Extract alias type from field key (e.g., 'aliasing.users' -> 'user')
          const keyParts = field.key.split('.');
          if (keyParts.length < 2) {
            throw new Error(`Invalid alias-list key: ${field.key}`);
          }
          const lastPart = keyParts[keyParts.length - 1];
          // Remove trailing 's' to get singular form (users -> user, projects -> project, orgs -> org)
          const aliasType = lastPart.endsWith('s') ? lastPart.slice(0, -1) : lastPart;
          if (aliasType !== 'user' && aliasType !== 'project' && aliasType !== 'org') {
            throw new Error(`Invalid alias type: ${aliasType} (from key: ${field.key})`);
          }
          
          // Append label to field container
          fieldContainer.appendChild(label);
          
          // Create container for alias list
          const aliasContainer = document.createElement('div');
          aliasContainer.className = 'alias-list-field-container';
          
          // Render alias list
          await renderAliasList(aliasContainer, aliasType, field.key);
          
          // Append alias container to field container
          fieldContainer.appendChild(aliasContainer);
          container.appendChild(fieldContainer);
          return; // Early return, no input element needed
        }
        case 'harvest-whitelist': {
          // Extract whitelist type from field key (e.g., 'aliasing.harvestOrgWhitelist' -> 'org')
          const keyParts = field.key.split('.');
          if (keyParts.length < 2) {
            throw new Error(`Invalid harvest-whitelist key: ${field.key}`);
          }
          const lastPart = keyParts[keyParts.length - 1];
          let whitelistType: 'org' | 'repo';
          if (lastPart.includes('Org')) {
            whitelistType = 'org';
          } else if (lastPart.includes('Repo')) {
            whitelistType = 'repo';
          } else {
            throw new Error(`Invalid harvest whitelist type: ${lastPart} (from key: ${field.key})`);
          }
          
          // Append label to field container
          fieldContainer.appendChild(label);
          
          // Create container for whitelist
          const whitelistContainer = document.createElement('div');
          whitelistContainer.className = 'harvest-whitelist-field-container';
          
          // Render whitelist
          await renderHarvestWhitelist(whitelistContainer, whitelistType, field.key);
          
          // Append whitelist container to field container
          fieldContainer.appendChild(whitelistContainer);
          container.appendChild(fieldContainer);
          return; // Early return, no input element needed
        }
    default:
      throw new Error(`Unsupported field type: ${field.type}`);
  }

  input.className = 'setting-input';
  label.appendChild(input);
  fieldContainer.appendChild(label);
  container.appendChild(fieldContainer);
}

/**
 * Render master toggle for a feature
 */
async function renderMasterToggle(
  featureId: string,
  container: HTMLElement
): Promise<void> {
  const toggleContainer = document.createElement('div');
  toggleContainer.className = 'feature-master-toggle';

  const settings = await settingsManager.getSettings();
  const isEnabled = settings.features?.[featureId] ?? true;

  const label = document.createElement('label');
  label.className = 'master-toggle-label';
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'master-toggle-checkbox';
  checkbox.checked = isEnabled;
  
  const labelText = document.createElement('span');
  labelText.className = 'master-toggle-text';
  labelText.textContent = 'Enable Feature';

  label.appendChild(checkbox);
  label.appendChild(labelText);
  toggleContainer.appendChild(label);

  checkbox.addEventListener('change', async () => {
    const currentSettings = await settingsManager.getSettings();
    const updatedFeatures = {
      ...currentSettings.features,
      [featureId]: checkbox.checked,
    };
    await settingsManager.updateSettings({ features: updatedFeatures });
    
    // Disable/enable all fields based on master toggle
    const fieldsContainer = container.querySelector('.feature-settings-fields');
    if (fieldsContainer) {
      const fields = fieldsContainer.querySelectorAll('.setting-field');
      fields.forEach((field) => {
        const inputs = field.querySelectorAll('input, select, textarea');
        inputs.forEach((input) => {
          (input as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).disabled = !checkbox.checked;
        });
      });
    }
  });

  container.appendChild(toggleContainer);
}

/**
 * Render page toggles for a feature
 */
async function renderPageToggles(
  schema: FeatureSettingsSchema,
  container: HTMLElement
): Promise<void> {
  if (!schema.pages || schema.pages.length === 0) {
    return;
  }

  const pagesContainer = document.createElement('div');
  pagesContainer.className = 'feature-pages-container';

  const pagesHeader = document.createElement('h3');
  pagesHeader.className = 'feature-pages-header';
  pagesHeader.textContent = 'Enable on Pages';
  pagesContainer.appendChild(pagesHeader);

  const pagesList = document.createElement('div');
  pagesList.className = 'feature-pages-list';

  for (const page of schema.pages) {
    const pageToggle = document.createElement('div');
    pageToggle.className = 'page-toggle-field';

    const settings = await settingsManager.getSettings();
    const featureSettings = getNestedValue(
      settings,
      schema.featureId === 'pr-list-customization' ? 'prList' : ''
    ) as Record<string, unknown> | undefined;
    const enabledOnPages = (featureSettings?.enabledOnPages as Record<string, boolean>) || {};
    const isEnabled = enabledOnPages[page.pageId] ?? true;

    const label = document.createElement('label');
    label.className = 'page-toggle-label';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'page-toggle-checkbox';
    checkbox.checked = isEnabled;

    const labelText = document.createElement('span');
    labelText.className = 'page-toggle-text';
    labelText.textContent = page.label; // Will be translated

    label.appendChild(checkbox);
    label.appendChild(labelText);

    if (page.description) {
      const description = document.createElement('p');
      description.className = 'page-toggle-description';
      description.textContent = page.description; // Will be translated
      pageToggle.appendChild(description);
    }

    pageToggle.appendChild(label);

    checkbox.addEventListener('change', async () => {
      const currentSettings = await settingsManager.getSettings();
      const featureKey = schema.featureId === 'pr-list-customization' ? 'prList' : '';
      const featureSettings = getNestedValue(
        currentSettings,
        featureKey
      ) as Record<string, unknown> | undefined;

      const updatedEnabledOnPages = {
        ...(featureSettings?.enabledOnPages as Record<string, boolean> || {}),
        [page.pageId]: checkbox.checked,
      };

      const updatedFeatureSettings = {
        ...featureSettings,
        enabledOnPages: updatedEnabledOnPages,
      };

      await settingsManager.updateSettings({
        [featureKey]: updatedFeatureSettings,
      });
    });

    pagesList.appendChild(pageToggle);
  }

  pagesContainer.appendChild(pagesList);
  container.appendChild(pagesContainer);
}

/**
 * Render all settings for a feature
 */
export async function renderFeatureSettings(
  schema: FeatureSettingsSchema,
  container: HTMLElement
): Promise<void> {
  const section = document.createElement('div');
  section.className = 'feature-settings-section';
  section.dataset.featureId = schema.featureId;

  const header = document.createElement('h2');
  header.className = 'feature-settings-header';
  header.textContent = schema.displayName; // Will be translated

  if (schema.description) {
    const description = document.createElement('p');
    description.className = 'feature-settings-description';
    description.textContent = schema.description; // Will be translated
    section.appendChild(description);
  }

  section.appendChild(header);

  // Render master toggle
  await renderMasterToggle(schema.featureId, section);

  // Render page toggles
  await renderPageToggles(schema, section);

  // Render regular fields
  const fieldsContainer = document.createElement('div');
  fieldsContainer.className = 'feature-settings-fields';

  // Disable fields if feature is disabled
  const settings = await settingsManager.getSettings();
  const isFeatureEnabled = settings.features?.[schema.featureId] ?? true;

  for (const field of schema.fields) {
    await renderSettingField(field, fieldsContainer);
    
    // Disable field inputs if feature is disabled
    if (!isFeatureEnabled) {
      const fieldEl = fieldsContainer.querySelector(
        `[data-setting-key="${field.key}"]`
      );
      if (fieldEl) {
        const inputs = fieldEl.querySelectorAll('input, select, textarea');
        inputs.forEach((input) => {
          (input as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).disabled = true;
        });
      }
    }
  }

  section.appendChild(fieldsContainer);
  container.appendChild(section);
}

