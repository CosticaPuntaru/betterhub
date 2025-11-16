/**
 * Aliasing Content Script
 * Applies aliases to GitHub pages and handles auto-harvest/auto-alias
 */

import { settingsManager } from '../../shared/utils/settings-manager';
import type { Settings } from '../../shared/types/settings';
import { harvestUsers, harvestProjects, harvestOrgs } from './harvester';
import { generateAutoAlias, applyAliases } from './alias-manager';
import type { AliasItem } from './types';
import { getCurrentOrg, getCurrentRepo } from './utils';
import './styles.css';

let observer: MutationObserver | null = null;
let currentSettings: Settings | null = null;
let isApplying = false; // Prevent infinite loops
let isHarvesting = false; // Prevent recursive harvesting
let lastHarvestTime = 0; // Track when last harvest happened
const HARVEST_COOLDOWN = 2000; // Don't harvest more than once every 2 seconds

/**
 * Perform auto-harvest if enabled
 */
async function performAutoHarvest(settings: Settings): Promise<void> {
  if (!settings.aliasing) return;
  
  // Prevent recursive harvesting
  if (isHarvesting) {
    console.log('[Aliasing] Harvest already in progress, skipping');
    return;
  }
  
  // Cooldown to prevent rapid re-harvesting
  const now = Date.now();
  if (now - lastHarvestTime < HARVEST_COOLDOWN) {
    console.log('[Aliasing] Harvest cooldown active, skipping');
    return;
  }
  
  isHarvesting = true;
  lastHarvestTime = now;

  const aliasing = settings.aliasing;
  
  // Check if harvesting is allowed for current page
  const currentOrg = getCurrentOrg();
  const currentRepo = getCurrentRepo();
  
  // Check org whitelist
  const orgWhitelist = aliasing.harvestOrgWhitelist;
  const orgAllowed = orgWhitelist === 'all' || 
    (Array.isArray(orgWhitelist) && currentOrg && orgWhitelist.some(org => 
      org.toLowerCase() === currentOrg.toLowerCase()
    ));
  
  // Check repo whitelist
  const repoWhitelist = aliasing.harvestRepoWhitelist;
  const repoAllowed = repoWhitelist === 'all' ||
    (Array.isArray(repoWhitelist) && currentRepo && repoWhitelist.some(repo =>
      repo.toLowerCase() === currentRepo.toLowerCase()
    ));
  
  // Harvesting is allowed if:
  // - Org whitelist is 'all' OR current org is in whitelist OR we're not on an org page
  // - AND repo whitelist is 'all' OR current repo is in whitelist OR we're not on a repo page
  const isHarvestingAllowed = (orgWhitelist === 'all' || orgAllowed || !currentOrg) &&
                              (repoWhitelist === 'all' || repoAllowed || !currentRepo);
  
  if (!isHarvestingAllowed) {
    console.log('[Aliasing] Harvesting not allowed for current page:', {
      currentOrg,
      currentRepo,
      orgWhitelist,
      repoWhitelist,
    });
    isHarvesting = false;
    return;
  }
  
  const harvestedUsers: AliasItem[] = [];
  const harvestedProjects: AliasItem[] = [];
  const harvestedOrgs: AliasItem[] = [];

  // Harvest users
  if (aliasing.autoHarvestUsers) {
    console.log('[Aliasing] Starting user harvest...');
    const users = harvestUsers();
    console.log('[Aliasing] Harvested users:', users);
    console.log(`[Aliasing] Found ${users.length} users on page`);
    
    for (const user of users) {
      const existing = aliasing.users.find(
        u => u.original.toLowerCase() === user.original.toLowerCase()
      );
      if (!existing) {
        console.log(`[Aliasing] Adding new user: ${user.original}${user.icon ? ' (with icon)' : ''}`);
        harvestedUsers.push({ 
          original: user.original, 
          alias: user.original, 
          enabled: true, 
          icon: user.icon,
        });
      } else {
        console.log(`[Aliasing] User ${user.original} already exists, skipping`);
      }
    }
    console.log(`[Aliasing] Will save ${harvestedUsers.length} new users`);
  } else {
    console.log('[Aliasing] User auto-harvest is disabled');
  }

  // Harvest projects
  if (aliasing.autoHarvestProjects) {
    const projects = harvestProjects();
    console.log('[Aliasing] Harvested projects:', projects);
    for (const project of projects) {
      const existing = aliasing.projects.find(
        p => p.original.toLowerCase() === project.original.toLowerCase()
      );
      if (!existing) {
        harvestedProjects.push({ 
          original: project.original, 
          alias: project.original, 
          enabled: true,
        });
      }
    }
  }

  // Harvest orgs
  if (aliasing.autoHarvestOrgs) {
    const orgs = harvestOrgs();
    console.log('[Aliasing] Harvested orgs:', orgs);
    for (const org of orgs) {
      const existing = aliasing.orgs.find(
        o => o.original.toLowerCase() === org.original.toLowerCase()
      );
      if (!existing) {
        harvestedOrgs.push({ 
          original: org.original, 
          alias: org.original, 
          enabled: true,
        });
      }
    }
  }

  // Save harvested items (only if they don't already exist)
  const hasNewItems = harvestedUsers.length > 0 || harvestedProjects.length > 0 || harvestedOrgs.length > 0;
  
  if (hasNewItems) {
    console.log('[Aliasing] Saving harvested items:', { 
      users: harvestedUsers.length, 
      projects: harvestedProjects.length, 
      orgs: harvestedOrgs.length 
    });
    console.log('[Aliasing] Harvested users details:', harvestedUsers.map(u => u.original));
    
    const updatedAliasing = { 
      ...aliasing,
      users: [...(aliasing.users || []), ...harvestedUsers],
      projects: [...(aliasing.projects || []), ...harvestedProjects],
      orgs: [...(aliasing.orgs || []), ...harvestedOrgs],
    };

    console.log('[Aliasing] Updated aliasing settings:', {
      totalUsers: updatedAliasing.users.length,
      totalProjects: updatedAliasing.projects.length,
      totalOrgs: updatedAliasing.orgs.length
    });

    await settingsManager.updateSettings({ aliasing: updatedAliasing });
    
    // Verify the save worked
    const verifySettings = await settingsManager.getSettings();
    console.log('[Aliasing] Verification - Settings after save:', {
      users: verifySettings.aliasing?.users?.length || 0,
      projects: verifySettings.aliasing?.projects?.length || 0,
      orgs: verifySettings.aliasing?.orgs?.length || 0
    });
    
    console.log('[Aliasing] Harvested items saved successfully');
  } else {
    console.log('[Aliasing] No new items to save');
  }
  
  isHarvesting = false;
}

/**
 * Perform auto-alias if enabled
 */
async function performAutoAlias(settings: Settings): Promise<void> {
  if (!settings.aliasing) return;

  const aliasing = settings.aliasing;

  // Auto-alias users
  if (aliasing.autoAliasUsers) {
    const users = harvestUsers();
    for (const user of users) {
      await generateAutoAlias(user);
    }
  }

  // Auto-alias projects
  if (aliasing.autoAliasProjects) {
    const projects = harvestProjects();
    for (const project of projects) {
      await generateAutoAlias(project);
    }
  }

  // Auto-alias orgs
  if (aliasing.autoAliasOrgs) {
    const orgs = harvestOrgs();
    for (const org of orgs) {
      await generateAutoAlias(org);
    }
  }
}

/**
 * Apply aliases to the page
 */
async function applyAliasesToPage(_settings: Settings): Promise<void> {
  if (isApplying) return;
  isApplying = true;

  try {
    await applyAliases();
  } finally {
    isApplying = false;
  }
}

/**
 * Initialize feature
 */
export async function initialize(settings: Settings): Promise<void> {
  currentSettings = settings;

  // Perform auto-harvest if enabled
  await performAutoHarvest(settings);

  // Perform auto-alias if enabled
  await performAutoAlias(settings);

  // Apply aliases
  await applyAliasesToPage(settings);

  // Observe DOM changes for dynamically loaded content
  // Use a debounced approach to prevent infinite loops
  let mutationTimeout: number | null = null;
  observer = new MutationObserver(async (mutations) => {
    if (currentSettings && !isApplying && !isHarvesting) {
      // Skip if mutations are from our own alias application
      const hasAliasModifications = mutations.some(mutation => {
        return Array.from(mutation.addedNodes).some(node => {
          const el = node as HTMLElement;
          return el?.dataset?.betterhubAlias === 'true' || 
                 el?.classList?.contains('betterhub-alias-badge') ||
                 el?.classList?.contains('betterhub-alias-modified');
        });
      });
      
      if (hasAliasModifications) {
        // These are our own changes, don't re-harvest
        return;
      }
      
      // Debounce to prevent rapid re-processing
      if (mutationTimeout) {
        clearTimeout(mutationTimeout);
      }
      
      mutationTimeout = window.setTimeout(async () => {
        if (currentSettings && !isApplying && !isHarvesting) {
          // Re-apply aliases when DOM changes
          await applyAliasesToPage(currentSettings);
          
          // Re-harvest if enabled (with cooldown)
          await performAutoHarvest(currentSettings);
          
          // Re-auto-alias if enabled
          await performAutoAlias(currentSettings);
        }
      }, 500); // 500ms debounce
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Listen for settings changes
  settingsManager.subscribe(async (updatedSettings) => {
    currentSettings = updatedSettings;
    await applyAliasesToPage(updatedSettings);
  });

  // Handle GitHub's SPA navigation
  let lastUrl = window.location.href;
  const urlObserver = new MutationObserver(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      // Re-initialize on navigation
      setTimeout(async () => {
        if (currentSettings) {
          await performAutoHarvest(currentSettings);
          await performAutoAlias(currentSettings);
          await applyAliasesToPage(currentSettings);
        }
      }, 500);
    }
  });

  urlObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

/**
 * Cleanup feature
 */
export async function cleanup(): Promise<void> {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  currentSettings = null;
  isApplying = false;
}

