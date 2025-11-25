/**
 * Internationalization utilities (i18next wrapper)
 */

import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { settingsManager } from './settings-manager';

let i18nInstance: typeof i18next | null = null;

export async function initI18n(resources: Record<string, Record<string, unknown>>): Promise<void> {
  const settings = await settingsManager.getSettings();

  // i18next.init() returns a Promise, but the instance is i18next itself
  await i18next.use(LanguageDetector).init({
    lng: settings.language || undefined,
    fallbackLng: 'en',
    resources: resources as any, // Type assertion needed for i18next resources type
    interpolation: {
      escapeValue: false,
    },
  });

  // The i18n instance is i18next itself after initialization
  i18nInstance = i18next;

  // Listen for language changes from settings
  settingsManager.subscribe((updatedSettings) => {
    if (i18nInstance && updatedSettings.language) {
      i18nInstance.changeLanguage(updatedSettings.language);
    }
  });
}

export function setLanguage(language: string): Promise<void> {
  return settingsManager.updateSettings({ language });
}

export function getCurrentLanguage(): string {
  if (!i18nInstance) {
    return 'en';
  }
  return i18nInstance.language;
}

// Export t function for non-React code (e.g., popup.ts)
export function t(key: string, defaultValue?: string, params?: Record<string, unknown>): string;
export function t(key: string, params?: Record<string, unknown>): string;
export function t(
  key: string,
  defaultValueOrParams?: string | Record<string, unknown>,
  params?: Record<string, unknown>
): string {
  if (!i18nInstance) {
    return key;
  }

  // Handle overloaded signatures
  if (typeof defaultValueOrParams === 'string') {
    // t(key, defaultValue, params)
    return i18nInstance.t(key, { defaultValue: defaultValueOrParams, ...params });
  } else {
    // t(key, params)
    return i18nInstance.t(key, defaultValueOrParams);
  }
}

// Export i18n instance for react-i18next
export { i18nInstance as i18n };

