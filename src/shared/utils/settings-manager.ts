/**
 * Centralized settings manager with real-time sync
 * Handles reading, writing, and broadcasting settings changes
 */

import browser from 'webextension-polyfill';
import { storage } from './storage';
import type { Settings } from '../types/settings';
import { DEFAULT_SETTINGS } from '../types/settings';

type SettingsChangeCallback = (settings: Settings) => void;

class SettingsManager {
  private listeners: Set<SettingsChangeCallback> = new Set();
  private cachedSettings: Settings | null = null;

  constructor() {
    // Listen for storage changes
    storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'sync') {
        this.handleStorageChange(changes);
      }
    });
  }

  /**
   * Get current settings with defaults applied
   */
  async getSettings(): Promise<Settings> {
    if (this.cachedSettings) {
      return this.cachedSettings;
    }

    const stored = await storage.get<Settings>('settings');
    const settings = this.mergeWithDefaults(stored.settings as Partial<Settings> | undefined);
    this.cachedSettings = settings;
    return settings;
  }

  /**
   * Update settings (partial update supported)
   */
  async updateSettings(partial: Partial<Settings>): Promise<void> {
    const current = await this.getSettings();
    const updated: Settings = {
      ...current,
      ...partial,
      features: {
        ...current.features,
        ...(partial.features || {}),
      },
    };

    // Merge prList if provided
    if (partial.prList) {
      updated.prList = {
        ...current.prList,
        ...partial.prList,
        enabledOnPages: {
          ...current.prList?.enabledOnPages,
          ...(partial.prList.enabledOnPages || {}),
        },
      };
    }

    // Merge aliasing if provided (deep merge to preserve arrays)
    if (partial.aliasing) {
      updated.aliasing = {
        ...current.aliasing,
        ...partial.aliasing,
        // Preserve arrays if not provided
        users: partial.aliasing.users ?? current.aliasing?.users ?? [],
        projects: partial.aliasing.projects ?? current.aliasing?.projects ?? [],
        orgs: partial.aliasing.orgs ?? current.aliasing?.orgs ?? [],
      };
    }

    // Merge readCommentsTracker if provided
    if (partial.readCommentsTracker) {
      updated.readCommentsTracker = {
        ...current.readCommentsTracker,
        ...partial.readCommentsTracker,
      };
    }

    console.log('[Settings Manager] Saving updated settings. Aliasing:', updated.aliasing);

    await storage.set({ settings: updated });
    this.cachedSettings = updated;
    this.notifyListeners(updated);
  }

  /**
   * Subscribe to settings changes
   */
  subscribe(callback: SettingsChangeCallback): () => void {
    this.listeners.add(callback);
    // Immediately call with current settings
    this.getSettings().then(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Unsubscribe from settings changes
   */
  unsubscribe(callback: SettingsChangeCallback): void {
    this.listeners.delete(callback);
  }

  /**
   * Initialize settings with defaults if not present
   */
  async initialize(): Promise<void> {
    const stored = await storage.get<Settings>('settings');
    if (!stored.settings) {
      await storage.set({ settings: DEFAULT_SETTINGS });
      this.cachedSettings = DEFAULT_SETTINGS;
    } else {
      this.cachedSettings = this.mergeWithDefaults(stored.settings);
    }
  }

  private mergeWithDefaults(stored: Partial<Settings> | undefined): Settings {
    return {
      ...DEFAULT_SETTINGS,
      ...stored,
      // Migration: map old 'enabled' boolean to 'enableMode' if 'enableMode' is missing
      enableMode: stored?.enableMode ?? (stored?.enabled === false ? 'off' : 'on'),
      allowlist: stored?.allowlist ?? DEFAULT_SETTINGS.allowlist,
      features: {
        ...DEFAULT_SETTINGS.features,
        ...(stored?.features || {}),
      },
      prList: {
        ...DEFAULT_SETTINGS.prList,
        ...(stored?.prList || {}),
        enabledOnPages: {
          ...DEFAULT_SETTINGS.prList?.enabledOnPages,
          ...(stored?.prList?.enabledOnPages || {}),
        },
      },
      aliasing: {
        ...DEFAULT_SETTINGS.aliasing,
        ...(stored?.aliasing || {}),
        // Ensure arrays are preserved if they exist in stored, otherwise use default (empty)
        users: stored?.aliasing?.users ?? DEFAULT_SETTINGS.aliasing?.users ?? [],
        projects: stored?.aliasing?.projects ?? DEFAULT_SETTINGS.aliasing?.projects ?? [],
        orgs: stored?.aliasing?.orgs ?? DEFAULT_SETTINGS.aliasing?.orgs ?? [],
      },
      readCommentsTracker: {
        ...DEFAULT_SETTINGS.readCommentsTracker,
        ...(stored?.readCommentsTracker || {}),
      },
    } as Settings;
  }

  private handleStorageChange(changes: Record<string, browser.Storage.StorageChange>): void {
    if (changes.settings) {
      const newSettings = this.mergeWithDefaults(
        changes.settings.newValue as Partial<Settings> | undefined
      );

      // Prevent infinite loops: if settings haven't effectively changed, don't notify
      if (this.cachedSettings && JSON.stringify(this.cachedSettings) === JSON.stringify(newSettings)) {
        return;
      }

      this.cachedSettings = newSettings;
      this.notifyListeners(newSettings);
    }
  }

  private notifyListeners(settings: Settings): void {
    this.listeners.forEach((callback) => {
      try {
        callback(settings);
      } catch (error) {
        console.error('Error in settings change callback:', error);
      }
    });
  }
}

// Export singleton instance
export const settingsManager = new SettingsManager();

