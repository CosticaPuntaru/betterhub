/**
 * Main content script orchestrator for GitHub
 * Dynamically loads enabled features based on settings
 */

import browser from 'webextension-polyfill';
import { settingsManager } from '../shared/utils/settings-manager';
import type { Settings } from '../shared/types/settings';

interface FeatureModule {
  initialize?: (settings: Settings) => Promise<void> | void;
  cleanup?: () => Promise<void> | void;
}

const loadedFeatures: Map<string, FeatureModule> = new Map();

/**
 * Load a feature module dynamically
 */
async function loadFeature(featureId: string): Promise<void> {
  if (loadedFeatures.has(featureId)) {
    return; // Already loaded
  }

  try {
    // Dynamic import based on feature ID
    const module = await import(`../features/${featureId}/content.ts`);
    loadedFeatures.set(featureId, module);

    const settings = await settingsManager.getSettings();
    if (module.initialize) {
      await module.initialize(settings);
    }
  } catch (error) {
    console.error(`Failed to load feature ${featureId}:`, error);
  }
}

/**
 * Unload a feature module
 */
async function unloadFeature(featureId: string): Promise<void> {
  const module = loadedFeatures.get(featureId);
  if (module && module.cleanup) {
    await module.cleanup();
  }
  loadedFeatures.delete(featureId);
}

/**
 * Check if a feature should be enabled on current page
 */
function shouldFeatureBeEnabled(
  featureId: string,
  settings: Settings,
  currentPath: string
): boolean {
  // Check global extension toggle first
  // Check global extension toggle first
  const enableMode = settings.enableMode ?? (settings.enabled === false ? 'off' : 'on');

  if (enableMode === 'off') {
    return false;
  }

  if (enableMode === 'allowlist') {
    const allowlist = settings.allowlist ?? [];
    if (allowlist.length === 0) {
      return false;
    }

    // Parse current path to get owner and repo
    // Format: /owner/repo/... or /owner
    const pathParts = currentPath.split('/').filter(Boolean);
    if (pathParts.length >= 1) {
      const owner = pathParts[0];
      const repo = pathParts.length >= 2 ? pathParts[1] : undefined;
      const ownerRepo = repo ? `${owner}/${repo}` : undefined;

      // Check if owner or owner/repo is in allowlist
      const isAllowed = allowlist.some(item =>
        item.toLowerCase() === owner.toLowerCase() ||
        (ownerRepo && item.toLowerCase() === ownerRepo.toLowerCase())
      );

      if (!isAllowed) {
        return false;
      }
    } else {
      // Not on a repo or org page (e.g. dashboard), disable if allowlist is active
      // Or maybe we should allow it on dashboard? For now, strict allowlist.
      return false;
    }
  }

  // Check feature-level toggle
  const isFeatureEnabled = settings.features?.[featureId] ?? true;
  if (!isFeatureEnabled) {
    return false;
  }

  // Check page-specific toggles
  if (featureId === 'pr-list-customization') {
    // Only works on pull request listing pages
    return currentPath.includes('/pulls');
  }

  if (featureId === 'aliasing') {
    // Aliasing works on all GitHub pages
    return true;
  }

  if (featureId === 'read-comments-tracker') {
    // Works on PR list and PR details pages
    return currentPath.includes('/pulls') || currentPath.includes('/pull/');
  }

  if (featureId === 'hide-whitespace') {
    // Works on PR files tab
    return currentPath.includes('/pull/') && currentPath.includes('/files');
  }

  if (featureId === 'sticky-headers') {
    // Works on PR files tab
    return currentPath.includes('/pull/') && currentPath.includes('/files');
  }

  if (featureId === 'package-links') {
    // Works on file blob pages
    return currentPath.includes('/blob/');
  }

  if (featureId === 'image-size') {
    // Works on file blob pages and PR pages
    return currentPath.includes('/blob/') || currentPath.includes('/pull/');
  }

  if (featureId === 'copy-path') {
    // Works on file blob pages and PR pages
    return currentPath.includes('/blob/') || currentPath.includes('/pull/');
  }

  if (featureId === 'viewed-checkbox') {
    // Works on PR files tab
    return currentPath.includes('/pull/') && currentPath.includes('/files');
  }

  if (featureId === 'expand-resolved') {
    // Works on PR conversation pages
    return currentPath.includes('/pull/') && !currentPath.includes('/files');
  }

  if (featureId === 'prevent-close') {
    // Works on all GitHub pages
    return true;
  }

  if (featureId === 'reaction-avatars') {
    // Works on pages with comments
    return currentPath.includes('/pull/') || currentPath.includes('/issues/');
  }

  if (featureId === 'build-favicon') {
    // Works on PR pages
    return currentPath.includes('/pull/');
  }

  return false;
}

/**
 * Initialize all enabled features
 */
async function initializeFeatures(settings: Settings): Promise<void> {
  const currentPath = window.location.pathname;
  const enabledFeatures: string[] = [];

  // Check PR list customization feature
  if (shouldFeatureBeEnabled('pr-list-customization', settings, currentPath)) {
    enabledFeatures.push('pr-list-customization');
  }

  // Check aliasing feature
  if (shouldFeatureBeEnabled('aliasing', settings, currentPath)) {
    enabledFeatures.push('aliasing');
  }

  // Check read-comments-tracker feature
  if (shouldFeatureBeEnabled('read-comments-tracker', settings, currentPath)) {
    enabledFeatures.push('read-comments-tracker');
  }

  // Check hide-whitespace feature
  if (shouldFeatureBeEnabled('hide-whitespace', settings, currentPath)) {
    enabledFeatures.push('hide-whitespace');
  }

  // Check sticky-headers feature
  if (shouldFeatureBeEnabled('sticky-headers', settings, currentPath)) {
    enabledFeatures.push('sticky-headers');
  }

  // Check package-links feature
  if (shouldFeatureBeEnabled('package-links', settings, currentPath)) {
    enabledFeatures.push('package-links');
  }

  // Check image-size feature
  if (shouldFeatureBeEnabled('image-size', settings, currentPath)) {
    enabledFeatures.push('image-size');
  }

  // Check copy-path feature
  if (shouldFeatureBeEnabled('copy-path', settings, currentPath)) {
    enabledFeatures.push('copy-path');
  }

  // Check viewed-checkbox feature
  if (shouldFeatureBeEnabled('viewed-checkbox', settings, currentPath)) {
    enabledFeatures.push('viewed-checkbox');
  }

  // Check expand-resolved feature
  if (shouldFeatureBeEnabled('expand-resolved', settings, currentPath)) {
    enabledFeatures.push('expand-resolved');
  }

  // Check prevent-close feature
  if (shouldFeatureBeEnabled('prevent-close', settings, currentPath)) {
    enabledFeatures.push('prevent-close');
  }

  // Check reaction-avatars feature
  if (shouldFeatureBeEnabled('reaction-avatars', settings, currentPath)) {
    enabledFeatures.push('reaction-avatars');
  }

  // Check build-favicon feature
  if (shouldFeatureBeEnabled('build-favicon', settings, currentPath)) {
    enabledFeatures.push('build-favicon');
  }

  // Load all enabled features
  for (const featureId of enabledFeatures) {
    await loadFeature(featureId);
  }

  // Unload features that are no longer enabled
  for (const [featureId] of loadedFeatures) {
    if (!enabledFeatures.includes(featureId)) {
      await unloadFeature(featureId);
    }
  }
}

/**
 * Handle settings changes
 */
async function handleSettingsChange(settings: Settings): Promise<void> {
  await initializeFeatures(settings);
}

// Listen for messages from background script
browser.runtime.onMessage.addListener((message) => {
  if (message.type === 'SETTINGS_CHANGED') {
    handleSettingsChange(message.settings as Settings);
  }
});

// Initialize on page load
(async () => {
  const settings = await settingsManager.getSettings();
  await initializeFeatures(settings);

  // Subscribe to settings changes
  settingsManager.subscribe(handleSettingsChange);
})();

