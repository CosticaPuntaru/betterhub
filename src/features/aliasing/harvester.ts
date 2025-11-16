/**
 * Harvester for detecting users, projects, and organizations on GitHub pages
 */

import type { AliasType } from './types';
import { extractUsername, extractRepoName, extractOrgName, getAvatarUrl } from './utils';

export interface HarvestedItem {
  original: string;
  type: AliasType;
  icon?: string; // For users, this is the avatar URL
}

/**
 * Harvest users from the current page
 */
export function harvestUsers(): HarvestedItem[] {
  const users: HarvestedItem[] = [];
  const seen = new Set<string>();

  console.log('[Aliasing] harvestUsers: Starting user detection...');

  // Find all links that might be user links
  const allLinks = document.querySelectorAll<HTMLAnchorElement>('a[href]');
  console.log(`[Aliasing] harvestUsers: Found ${allLinks.length} links on page`);
  
  // Also find avatars which are good indicators of users
  const avatars = document.querySelectorAll<HTMLImageElement>('img.avatar, img[class*="avatar"], img[alt*="@"]');
  console.log(`[Aliasing] harvestUsers: Found ${avatars.length} avatar images on page`);

  // Extract from avatars first (more reliable - avatars are strong indicators of users)
  let avatarUsersFound = 0;
  avatars.forEach(avatar => {
    // Skip avatars that are part of alias modifications
    if (avatar.dataset.betterhubAlias === 'true' ||
        avatar.classList.contains('betterhub-alias-icon')) {
      return;
    }
    
    const parentLink = avatar.closest<HTMLAnchorElement>('a[href]');
    if (!parentLink || !parentLink.href) return;
    
    // Skip if link has been modified by alias application
    if (parentLink.dataset.betterhubAliasModified === 'true') {
      return;
    }
    
    // Skip if link is in GitHub's navigation/footer (not actual user content)
    const isInNavigation = 
      parentLink.closest('nav') !== null ||
      parentLink.closest('header') !== null ||
      parentLink.closest('footer') !== null ||
      parentLink.closest('[role="navigation"]') !== null ||
      parentLink.closest('.Header') !== null ||
      parentLink.closest('.footer') !== null;
    
    if (isInNavigation) {
      return; // Skip navigation links
    }
    
    // Check DOM context - is this avatar in a user context?
    const isUserContext = 
      parentLink.closest('[data-hovercard-type="user"]') !== null ||
      parentLink.closest('[itemprop="author"]') !== null ||
      parentLink.closest('.author') !== null ||
      parentLink.getAttribute('data-hovercard-type') === 'user' ||
      parentLink.closest('[data-hovercard-url*="/users/"]') !== null;
    
    // Must be in user context OR be an exact user profile URL
    const isExactUserProfile = /^https?:\/\/github\.com\/[a-zA-Z0-9]([a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(parentLink.href);
    
    if (!isUserContext && !isExactUserProfile) {
      return; // Not a user profile
    }
    
    const username = extractUsername(parentLink.href);
    if (!username || seen.has(username.toLowerCase())) return;
    
    // Validate it's not a GitHub system path by checking URL structure
    try {
      const urlObj = new URL(parentLink.href);
      const pathParts = urlObj.pathname.split('/').filter(p => p.length > 0);
      
      // Must be exactly one segment (username only) or have user profile section
      if (pathParts.length >= 2) {
        const secondSegment = pathParts[1].toLowerCase();
        const userProfileSections = ['settings', 'repositories', 'stars', 'followers', 'following',
                                    'projects', 'packages', 'sponsors', 'organizations', 'teams'];
        if (!userProfileSections.includes(secondSegment)) {
          return; // Likely a repo, skip
        }
      }
    } catch (e) {
      return; // Invalid URL
    }
    
    seen.add(username.toLowerCase());
    const iconUrl = getAvatarUrl(avatar);
    users.push({ 
      original: username, 
      type: 'user',
      icon: iconUrl || undefined,
    });
    avatarUsersFound++;
    console.log(`[Aliasing] harvestUsers: Found user from avatar: ${username} (URL: ${parentLink.href})`);
  });

  // Extract from links - only process links that are clearly user profiles
  let linkUsersFound = 0;
  allLinks.forEach(link => {
    if (!link.href || !link.href.includes('github.com')) return;
    
    // Skip links that have been modified by alias application
    if (link.dataset.betterhubAliasModified === 'true' ||
        link.closest('[data-betterhub-alias-modified="true"]')) {
      return; // Skip modified links
    }
    
    // Skip if link is in GitHub's navigation/footer (not actual user content)
    const isInNavigation = 
      link.closest('nav') !== null ||
      link.closest('header') !== null ||
      link.closest('footer') !== null ||
      link.closest('[role="navigation"]') !== null ||
      link.closest('.Header') !== null ||
      link.closest('.footer') !== null ||
      link.closest('[aria-label*="navigation"]') !== null ||
      link.closest('[aria-label*="Site-wide"]') !== null ||
      link.closest('[aria-label*="Platform"]') !== null ||
      link.closest('[aria-label*="Ecosystem"]') !== null ||
      link.closest('[aria-label*="Support"]') !== null ||
      link.closest('[aria-label*="Company"]') !== null ||
      link.closest('[aria-label*="Legal"]') !== null;
    
    if (isInNavigation) {
      return; // Skip navigation links
    }
    
    // Check if link text suggests it's a GitHub system link (not a username)
    const linkText = (link.textContent || '').toLowerCase().trim();
    const systemLinkIndicators = [
      'sign in', 'sign up', 'login', 'signup', 'join', 'logout',
      'features', 'enterprise', 'pricing', 'security', 'marketplace',
      'topics', 'trending', 'collections', 'sponsors', 'readme',
      'terms', 'privacy', 'sitemap', 'about', 'contact', 'blog',
      'solutions', 'team', 'partners', 'premium support', 'customer stories',
      'why github', 'mcp', 'home-assistant'
    ];
    
    if (systemLinkIndicators.some(indicator => linkText.includes(indicator))) {
      return; // Skip system links
    }
    
    // Check DOM context - is this link in a user context?
    const hasAvatar = link.querySelector<HTMLImageElement>('img.avatar, img[class*="avatar"]');
    const isUserContext = 
      hasAvatar ||
      link.closest('[data-hovercard-type="user"]') !== null ||
      link.closest('[itemprop="author"]') !== null ||
      link.closest('.author') !== null ||
      link.getAttribute('data-hovercard-type') === 'user' ||
      link.closest('[data-hovercard-url*="/users/"]') !== null ||
      link.closest('.user-mention') !== null;
    
    // If not in user context, only accept exact user profile URLs (no path segments)
    // AND they must not look like system paths
    if (!isUserContext) {
      try {
        const urlObj = new URL(link.href);
        const pathParts = urlObj.pathname.split('/').filter(p => p.length > 0);
        // Must be exactly one segment (username only)
        if (pathParts.length !== 1) {
          return; // Skip - not an exact user profile
        }
        
        // Additional check: if the single segment looks like a system path, skip it
        const segment = pathParts[0].toLowerCase();
        const systemPaths = [
          'login', 'signup', 'join', 'logout', 'features', 'enterprise',
          'pricing', 'security', 'marketplace', 'topics', 'trending',
          'collections', 'sponsors', 'readme', 'terms', 'privacy',
          'sitemap', 'about', 'contact', 'blog', 'solutions', 'team',
          'partners', 'premium-support', 'customer-stories', 'why-github',
          'mcp', 'home-assistant', 'explore', 'settings', 'notifications',
          'new', 'search', 'orgs'
        ];
        
        if (systemPaths.includes(segment)) {
          return; // Skip system paths
        }
      } catch (e) {
        return; // Invalid URL
      }
    }
    
    // Check URL structure
    try {
      const urlObj = new URL(link.href);
      const pathParts = urlObj.pathname.split('/').filter(p => p.length > 0);
      
      if (pathParts.length === 0) return;
      
      const firstSegment = pathParts[0];
      
      // If there's a second segment, validate it's a user profile section
      if (pathParts.length >= 2) {
        const secondSegment = pathParts[1].toLowerCase();
        const userProfileSections = ['settings', 'repositories', 'stars', 'followers', 'following',
                                     'projects', 'packages', 'sponsors', 'organizations', 'teams'];
        // If second segment is not a user profile section, it's likely a repo - skip
        if (!userProfileSections.includes(secondSegment)) {
          return;
        }
      }
      
      // Validate username format
      if (!/^[a-zA-Z0-9]([a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(firstSegment)) {
        return; // Invalid username format
      }
      
      const username = firstSegment;
      if (!seen.has(username.toLowerCase())) {
        seen.add(username.toLowerCase());
        // Try to find avatar in the link
        const avatar = link.querySelector<HTMLImageElement>('img.avatar, img[class*="avatar"]');
        const iconUrl = avatar ? getAvatarUrl(avatar) : undefined;
        users.push({ 
          original: username, 
          type: 'user',
          icon: iconUrl || undefined,
        });
        linkUsersFound++;
        console.log(`[Aliasing] harvestUsers: Found user from link: ${username} (URL: ${link.href})`);
      }
    } catch (e) {
      // Invalid URL, skip
      return;
    }
  });
  console.log(`[Aliasing] harvestUsers: Found ${linkUsersFound} users from links`);

  // Also check for @mentions in text (but only in user-mention contexts)
  let mentionUsersFound = 0;
  const textNodes = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null
  );
  
  let node: Node | null;
  while ((node = textNodes.nextNode())) {
    if (node.nodeType !== Node.TEXT_NODE) continue;
    const textNode = node as Text;
    const text = textNode.textContent || '';
    const mentions = text.match(/@([a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38})/g);
    if (mentions) {
      mentions.forEach(mention => {
        const username = mention.substring(1); // Remove @
        // Validate username format
        if (username && 
            /^[a-zA-Z0-9]([a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(username) &&
            !seen.has(username.toLowerCase())) {
          // Check if it's in a user mention context (not just random text)
          const parent = textNode.parentElement;
          const isUserMention = parent && (
            parent.classList.contains('user-mention') ||
            parent.getAttribute('data-hovercard-type') === 'user' ||
            parent.closest('[data-hovercard-type="user"]') ||
            parent.closest('.user-mention')
          );
          
          // Only add if it's in a proper mention context or if we can't determine context
          if (isUserMention || !parent) {
            seen.add(username.toLowerCase());
            users.push({ original: username, type: 'user' });
            mentionUsersFound++;
            console.log(`[Aliasing] harvestUsers: Found user from mention: ${username}`);
          }
        }
      });
    }
  }
  console.log(`[Aliasing] harvestUsers: Found ${mentionUsersFound} users from @mentions`);

  console.log(`[Aliasing] harvestUsers: Total unique users found: ${users.length}`);
  console.log(`[Aliasing] harvestUsers: Breakdown - ${avatarUsersFound} from avatars, ${linkUsersFound} from links, ${mentionUsersFound} from mentions`);
  return users;
}

/**
 * Harvest projects/repositories from the current page
 */
export function harvestProjects(): HarvestedItem[] {
  const projects: HarvestedItem[] = [];
  const seen = new Set<string>();

  // Find all links
  const allLinks = document.querySelectorAll<HTMLAnchorElement>('a[href]');

  allLinks.forEach(link => {
    const href = link.href;
    if (!href || !href.includes('github.com')) return;
    
    // Skip links that have been modified by alias application
    if (link.dataset.betterhubAliasModified === 'true' ||
        link.closest('[data-betterhub-alias-modified="true"]')) {
      return; // Skip modified links
    }
    
    // Skip if it's clearly not a repo (has sub-paths like /blob, /tree, etc.)
    const hasSubPath = /github\.com\/[^\/]+\/[^\/]+\/(blob|tree|commits|branches|tags|releases|compare|pulls|issues|actions|projects|wiki|security|pulse|graphs|network|settings|search)/.test(href);
    if (hasSubPath) return;
    
    // Skip org pages
    if (href.includes('/orgs/')) return;
    
    const repoName = extractRepoName(href);
    if (repoName && !seen.has(repoName.toLowerCase())) {
      const parts = repoName.split('/');
      // Validate it's a proper owner/repo pattern
      if (parts.length === 2 && parts[0] && parts[1] && 
          parts[0].length > 0 && parts[1].length > 0 &&
          !parts[0].startsWith('@') && 
          !['settings', 'explore', 'topics', 'trending', 'stars', 'marketplace'].includes(parts[1].toLowerCase())) {
        seen.add(repoName.toLowerCase());
        projects.push({ original: repoName, type: 'project' });
      }
    }
  });

  return projects;
}

/**
 * Harvest organizations from the current page
 */
export function harvestOrgs(): HarvestedItem[] {
  const orgs: HarvestedItem[] = [];
  const seen = new Set<string>();

  // Find organization links (explicit /orgs/ paths)
  const orgLinks = document.querySelectorAll<HTMLAnchorElement>('a[href*="/orgs/"]');
  orgLinks.forEach(link => {
    // Skip links that have been modified by alias application
    if (link.dataset.betterhubAliasModified === 'true' ||
        link.closest('[data-betterhub-alias-modified="true"]')) {
      return; // Skip modified links
    }
    
    const orgName = extractOrgName(link.href);
    if (orgName && !seen.has(orgName.toLowerCase())) {
      seen.add(orgName.toLowerCase());
      orgs.push({ original: orgName, type: 'org' });
    }
  });

  // Check for organization indicators in the page
  const orgIndicators = document.querySelectorAll('[data-hovercard-type="organization"]');
  orgIndicators.forEach(indicator => {
    const link = indicator.closest<HTMLAnchorElement>('a[href]');
    if (link && link.href) {
      const orgName = extractOrgName(link.href) || extractUsername(link.href);
      if (orgName && !seen.has(orgName.toLowerCase())) {
        seen.add(orgName.toLowerCase());
        orgs.push({ original: orgName, type: 'org' });
      }
    }
  });

  // Also check for org badges/indicators
  const orgBadges = document.querySelectorAll('[aria-label*="organization"], [title*="organization"]');
  orgBadges.forEach(badge => {
    const link = badge.closest<HTMLAnchorElement>('a[href]');
    if (link && link.href) {
      const orgName = extractOrgName(link.href) || extractUsername(link.href);
      if (orgName && !seen.has(orgName.toLowerCase())) {
        seen.add(orgName.toLowerCase());
        orgs.push({ original: orgName, type: 'org' });
      }
    }
  });

  return orgs;
}

