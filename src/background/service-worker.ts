/**
 * Background service worker for Manifest V3
 * Handles extension lifecycle and settings synchronization
 */

import browser from 'webextension-polyfill';
import { settingsManager } from '../shared/utils/settings-manager';

// Initialize settings on extension install
browser.runtime.onInstalled.addListener(async () => {
  await settingsManager.initialize();
  console.log('BetterHub extension installed/updated');
});

// Listen for settings changes and broadcast to all tabs
settingsManager.subscribe(async (settings) => {
  // Notify all GitHub tabs about settings changes
  const tabs = await browser.tabs.query({ url: 'https://github.com/*' });
  for (const tab of tabs) {
    if (tab.id) {
      try {
        await browser.tabs.sendMessage(tab.id, {
          type: 'SETTINGS_CHANGED',
          settings,
        });
      } catch (error) {
        // Tab might not have content script loaded yet, ignore
        console.debug('Could not send message to tab:', error);
      }
    }
  }
});

console.log('BetterHub background service worker loaded');

