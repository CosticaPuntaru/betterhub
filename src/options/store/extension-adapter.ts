/**
 * Extension adapter - syncs Zustand store with extension storage
 * Only active when running in extension context
 */

import { useSettingsStore } from './settings-store';
import { settingsManager } from '../../shared/utils/settings-manager';
import type { Settings } from '../../shared/types/settings';

let isInitialized = false;
let unsubscribeManager: (() => void) | null = null;

/**
 * Check if we're running in extension context
 */
function isExtensionContext(): boolean {
  return typeof chrome !== 'undefined' && chrome.storage !== undefined;
}

/**
 * Initialize extension adapter - syncs Zustand with extension storage
 */
export async function initializeExtensionAdapter(): Promise<void> {
  if (!isExtensionContext()) {
    console.log('[Extension Adapter] Not in extension context, skipping initialization');
    return;
  }

  if (isInitialized) {
    console.log('[Extension Adapter] Already initialized');
    return;
  }

  console.log('[Extension Adapter] Initializing...');

  try {
    // Initialize settings manager
    await settingsManager.initialize();

    // Load initial settings from extension
    const extensionSettings = await settingsManager.getSettings();
    useSettingsStore.getState().setSettings(extensionSettings);
    useSettingsStore.getState().initialize();

    // Subscribe to extension settings changes
    unsubscribeManager = settingsManager.subscribe((updatedSettings: Settings) => {
      console.log('[Extension Adapter] Settings changed in extension, updating store');
      useSettingsStore.getState().setSettings(updatedSettings);
    });

    // Subscribe to Zustand store changes and sync to extension
    let isSyncing = false;
    
    // Set initialized flag before subscribing to avoid race conditions
    isInitialized = true;
    
    useSettingsStore.subscribe(
      (state: { settings: Settings }) => state.settings,
      (settings: Settings) => {
        // Only sync if we're not already syncing (avoid loops)
        if (!isInitialized || isSyncing) return;
        
        isSyncing = true;
        console.log('[Extension Adapter] Store changed, syncing to extension');
        settingsManager.updateSettings(settings)
          .then(() => {
            isSyncing = false;
          })
          .catch((error) => {
            console.error('[Extension Adapter] Failed to sync to extension:', error);
            isSyncing = false;
          });
      }
    );
    console.log('[Extension Adapter] Initialized successfully');
  } catch (error) {
    console.error('[Extension Adapter] Initialization failed:', error);
    throw error;
  }
}

/**
 * Cleanup extension adapter
 */
export function cleanupExtensionAdapter(): void {
  if (unsubscribeManager) {
    unsubscribeManager();
    unsubscribeManager = null;
  }
  isInitialized = false;
}


