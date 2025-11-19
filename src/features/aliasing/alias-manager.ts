/**
 * Core alias management and application logic
 */

import type { AliasItem, AliasType } from './types';
import { settingsManager } from '../../shared/utils/settings-manager';
import { generateDeterministicColor, generateAcronym, imageUrlToDataUrl } from './utils';
import type { HarvestedItem } from './harvester';

/**
 * Get alias for a given original name and type
 */
export async function getAlias(
  original: string,
  type: AliasType
): Promise<AliasItem | null> {
  const settings = await settingsManager.getSettings();
  const aliasing = settings.aliasing;
  if (!aliasing) return null;

  const aliasList = aliasing[`${type}s` as 'users' | 'projects' | 'orgs'] || [];
  const alias = aliasList.find(
    a => a.original.toLowerCase() === original.toLowerCase()
  );

  // Only return if enabled
  if (alias && alias.enabled) {
    return alias;
  }

  return null;
}

/**
 * Generate auto-alias for a harvested item
 */
export async function generateAutoAlias(
  item: HarvestedItem
): Promise<AliasItem | null> {
  const settings = await settingsManager.getSettings();
  const aliasing = settings.aliasing;
  if (!aliasing) return null;

  // Check if auto-alias is enabled for this type
  const autoAliasKey = `autoAlias${item.type.charAt(0).toUpperCase() + item.type.slice(1)}s` as 
    'autoAliasUsers' | 'autoAliasProjects' | 'autoAliasOrgs';
  if (!aliasing[autoAliasKey]) {
    return null;
  }

  // Check if alias already exists
  const aliasList = aliasing[`${item.type}s` as 'users' | 'projects' | 'orgs'] || [];
  const existing = aliasList.find(
    a => a.original.toLowerCase() === item.original.toLowerCase()
  );
  if (existing) {
    return existing; // Already exists
  }

  // Generate alias based on type
  let newAlias: AliasItem;

  if (item.type === 'user') {
    // For users: use avatar as icon
    let icon: string | undefined;
    if (item.icon) {
      // Try to convert to data URL for persistence
      const dataUrl = await imageUrlToDataUrl(item.icon);
      icon = dataUrl || item.icon;
    }

    newAlias = {
      original: item.original,
      alias: item.original, // Default to original name, user can change
      enabled: true,
      icon,
    };
  } else {
    // For projects/orgs: generate acronym + deterministic color
    const acronym = generateAcronym(item.original);
    const color = generateDeterministicColor(item.original);

    newAlias = {
      original: item.original,
      alias: acronym,
      enabled: true,
      color,
    };
  }

  // Save to settings
  aliasList.push(newAlias);
  await settingsManager.updateSettings({
    aliasing: {
      ...aliasing,
      [`${item.type}s`]: aliasList,
    },
  });

  return newAlias;
}

/**
 * Apply aliases to elements on the page
 */
export async function applyAliases(): Promise<void> {
  const settings = await settingsManager.getSettings();
  const aliasing = settings.aliasing;
  if (!aliasing) return;

  // Apply user aliases
  await applyUserAliases(aliasing.users);
  
  // Apply project aliases
  await applyProjectAliases(aliasing.projects);
  
  // Apply org aliases
  await applyOrgAliases(aliasing.orgs);
}

/**
 * Apply user aliases
 */
async function applyUserAliases(aliases: AliasItem[]): Promise<void> {
  const enabledAliases = aliases.filter(a => a.enabled);
  
  for (const alias of enabledAliases) {
    // Find user links and avatars
    const userLinks = document.querySelectorAll<HTMLAnchorElement>(
      `a[href*="/${alias.original}"], a[href*="@${alias.original}"]`
    );
    
    userLinks.forEach(link => {
      // Skip if already modified by alias application
      if (link.dataset.betterhubAliasModified === 'true') {
        return;
      }
      
      // Mark as modified
      link.dataset.betterhubAliasModified = 'true';
      
      // Handle color+text mode
      if (alias.color) {
        // Create colored badge with custom alias text
        const badge = document.createElement('span');
        badge.className = 'betterhub-alias-badge';
        badge.dataset.betterhubAlias = 'true';
        badge.textContent = alias.alias;
        badge.style.backgroundColor = alias.color;
        badge.style.color = '#fff';
        badge.style.padding = '2px 6px';
        badge.style.borderRadius = '3px';
        badge.style.fontSize = '0.85em';
        badge.style.display = 'inline-block';
        
        // Replace link content with badge
        link.textContent = '';
        link.appendChild(badge);
      } else if (alias.icon && alias.icon !== '') {
        // Handle custom icon mode
        const avatar = link.querySelector<HTMLImageElement>('img.avatar, img[class*="avatar"]');
        if (avatar) {
          avatar.src = alias.icon;
          avatar.srcset = '';
        }
        
        // Replace text with alias
        if (link.textContent?.includes(alias.original)) {
          const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
          let textNode;
          while ((textNode = walker.nextNode())) {
            if (textNode.textContent) {
              textNode.textContent = textNode.textContent.replace(
                new RegExp(alias.original, 'gi'),
                alias.alias
              );
            }
          }
        }
      } else {
        // Just replace text with alias (use actual user photo - icon is empty)
        if (link.textContent?.includes(alias.original)) {
          const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
          let textNode;
          while ((textNode = walker.nextNode())) {
            if (textNode.textContent) {
              textNode.textContent = textNode.textContent.replace(
                new RegExp(alias.original, 'gi'),
                alias.alias
              );
            }
          }
        }
      }
    });

    // Replace @mentions in text throughout the page
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let node;
    while ((node = walker.nextNode())) {
      if (node.textContent?.includes(`@${alias.original}`)) {
        node.textContent = node.textContent.replace(
          new RegExp(`@${alias.original}`, 'gi'),
          `@${alias.alias}`
        );
      }
    }
  }
}

/**
 * Apply project aliases
 */
async function applyProjectAliases(aliases: AliasItem[]): Promise<void> {
  const enabledAliases = aliases.filter(a => a.enabled);
  
  for (const alias of enabledAliases) {
    const [owner, repo] = alias.original.split('/');
    if (!owner || !repo) continue;

    // Find repository links
    const repoLinks = document.querySelectorAll<HTMLAnchorElement>(
      `a[href*="/${owner}/${repo}"]`
    );
    
    repoLinks.forEach(link => {
      // Skip if already modified by alias application
      if (link.dataset.betterhubAliasModified === 'true') {
        return;
      }
      
      // Replace text with alias
      if (link.textContent?.includes(repo) || link.textContent?.includes(alias.original)) {
        if (alias.color) {
          // Create colored badge with custom text
          const badge = document.createElement('span');
          badge.className = 'betterhub-alias-badge';
          badge.dataset.betterhubAlias = 'true';
          badge.textContent = alias.alias;
          badge.style.backgroundColor = alias.color;
          badge.style.color = '#fff';
          badge.style.padding = '2px 6px';
          badge.style.borderRadius = '3px';
          badge.style.fontSize = '0.85em';
          badge.style.display = 'inline-block';
          link.textContent = '';
          link.dataset.betterhubAliasModified = 'true';
          link.appendChild(badge);
        } else if (alias.icon) {
          // Replace with icon and text
          const img = document.createElement('img');
          img.className = 'betterhub-alias-icon';
          img.dataset.betterhubAlias = 'true';
          img.src = alias.icon;
          img.alt = alias.alias;
          img.style.width = '16px';
          img.style.height = '16px';
          img.style.verticalAlign = 'middle';
          img.style.display = 'inline-block';
          link.textContent = '';
          link.dataset.betterhubAliasModified = 'true';
          link.appendChild(img);
          const textNode = document.createTextNode(` ${alias.alias}`);
          link.appendChild(textNode);
        } else {
          // Just replace text
          link.dataset.betterhubAliasModified = 'true';
          link.textContent = link.textContent.replace(
            new RegExp(repo, 'gi'),
            alias.alias
          );
        }
      }
    });
  }
}

/**
 * Apply org aliases
 */
async function applyOrgAliases(aliases: AliasItem[]): Promise<void> {
  const enabledAliases = aliases.filter(a => a.enabled);
  
  for (const alias of enabledAliases) {
    // Find organization links
    const orgLinks = document.querySelectorAll<HTMLAnchorElement>(
      `a[href*="/orgs/${alias.original}"], a[href*="/${alias.original}"][data-hovercard-type="organization"]`
    );
    
    orgLinks.forEach(link => {
      // Skip if already modified by alias application
      if (link.dataset.betterhubAliasModified === 'true') {
        return;
      }
      
      // Replace text with alias
      if (link.textContent?.includes(alias.original)) {
        if (alias.color) {
          // Create colored badge with custom text
          const badge = document.createElement('span');
          badge.className = 'betterhub-alias-badge';
          badge.dataset.betterhubAlias = 'true';
          badge.textContent = alias.alias;
          badge.style.backgroundColor = alias.color;
          badge.style.color = '#fff';
          badge.style.padding = '2px 6px';
          badge.style.borderRadius = '3px';
          badge.style.fontSize = '0.85em';
          badge.style.display = 'inline-block';
          link.textContent = '';
          link.dataset.betterhubAliasModified = 'true';
          link.appendChild(badge);
        } else if (alias.icon) {
          // Replace with icon and text
          const img = document.createElement('img');
          img.className = 'betterhub-alias-icon';
          img.dataset.betterhubAlias = 'true';
          img.src = alias.icon;
          img.alt = alias.alias;
          img.style.width = '16px';
          img.style.height = '16px';
          img.style.verticalAlign = 'middle';
          img.style.display = 'inline-block';
          link.textContent = '';
          link.dataset.betterhubAliasModified = 'true';
          link.appendChild(img);
          const textNode = document.createTextNode(` ${alias.alias}`);
          link.appendChild(textNode);
        } else {
          // Just replace text
          link.dataset.betterhubAliasModified = 'true';
          link.textContent = link.textContent.replace(
            new RegExp(alias.original, 'gi'),
            alias.alias
          );
        }
      }
    });
  }
}

