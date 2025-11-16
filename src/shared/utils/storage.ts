/**
 * Storage utilities - wrapper around chrome.storage
 */

// Import chrome mock first (side-effect import - only activates if chrome.storage doesn't exist)
// This ensures the mock is set up before webextension-polyfill tries to access chrome APIs
import './chrome-mock';

import browser from 'webextension-polyfill';

export const storage = {
  async get<T>(keys: string | string[] | null): Promise<Partial<T>> {
    return (await browser.storage.sync.get(keys)) as Partial<T>;
  },

  async set(items: Record<string, unknown>): Promise<void> {
    await browser.storage.sync.set(items);
  },

  async remove(keys: string | string[]): Promise<void> {
    await browser.storage.sync.remove(keys);
  },

  async clear(): Promise<void> {
    await browser.storage.sync.clear();
  },

  get onChanged() {
    // Safely access onChanged - it should exist if chrome.storage is properly mocked or available
    if (!browser.storage.onChanged) {
      throw new Error('chrome.storage.onChanged is not available. Make sure chrome-mock is loaded in dev mode.');
    }
    return browser.storage.onChanged;
  },
};

