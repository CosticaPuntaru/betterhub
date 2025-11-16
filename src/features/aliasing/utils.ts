/**
 * Utility functions for aliasing feature
 */

/**
 * Generate acronym from a name
 * Examples: "Microsoft" -> "MS", "GitHub Inc" -> "GI", "react" -> "R"
 */
export function generateAcronym(name: string): string {
  if (!name || name.length === 0) return '';
  
  // Remove common prefixes/suffixes
  const cleaned = name.trim();
  
  // If single word, return first letter uppercase
  if (!cleaned.includes(' ') && !cleaned.includes('-') && !cleaned.includes('_')) {
    return cleaned.charAt(0).toUpperCase();
  }
  
  // Split by spaces, hyphens, or underscores
  const parts = cleaned.split(/[\s\-_]+/).filter(p => p.length > 0);
  
  if (parts.length === 0) return '';
  
  // Take first letter of each part
  const acronym = parts
    .map(part => part.charAt(0).toUpperCase())
    .join('');
  
  // Limit to 3 characters max
  return acronym.substring(0, 3);
}

/**
 * Generate deterministic color from a string (same input = same color)
 * Returns hex color string
 */
export function generateDeterministicColor(input: string): string {
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Convert to positive number
  hash = Math.abs(hash);
  
  // Generate RGB values (avoid too dark/light colors)
  const r = (hash & 0xFF0000) >> 16;
  const g = (hash & 0x00FF00) >> 8;
  const b = hash & 0x0000FF;
  
  // Ensure minimum brightness (avoid too dark colors)
  const minBrightness = 80;
  const adjustedR = Math.max(r, minBrightness);
  const adjustedG = Math.max(g, minBrightness);
  const adjustedB = Math.max(b, minBrightness);
  
  // Convert to hex
  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(adjustedR)}${toHex(adjustedG)}${toHex(adjustedB)}`;
}

/**
 * Extract username from GitHub URL
 * Only returns usernames from URLs that are user profiles (not repos or orgs)
 * Uses pattern matching instead of hardcoded lists
 */
export function extractUsername(url: string | null | undefined): string | null {
  if (!url || !url.includes('github.com')) return null;
  
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(p => p.length > 0);
    
    // User profile URLs have format: github.com/username or github.com/username/settings|repositories|etc
    // NOT: github.com/username/repo-name (that's a repo)
    
    if (pathParts.length === 0) return null;
    
    const firstSegment = pathParts[0];
    
    // Validate GitHub username format: alphanumeric, hyphens (but not at start/end/consecutive)
    // Must start with alphanumeric, can contain hyphens (not consecutive), 1-39 chars total
    if (!/^[a-zA-Z0-9]([a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(firstSegment)) {
      return null; // Invalid username format
    }
    
    // If there's a second segment, check if it's a user profile section or a repo
    if (pathParts.length >= 2) {
      const secondSegment = pathParts[1].toLowerCase();
      
      // User profile sections (these indicate it's a user profile, not a repo)
      // Common patterns: settings, repositories, stars, followers, following, etc.
      // Repos typically have names that don't match these patterns
      const userProfileIndicators = [
        'settings', 'repositories', 'stars', 'followers', 'following',
        'projects', 'packages', 'sponsors', 'organizations', 'teams',
        'account', 'billing', 'emails', 'notifications', 'security',
        'sessions', 'applications', 'keys', 'gpg', 'ssh', 'installations',
        'interaction-limits', 'blocked_users', 'saved-replies',
        'developer-settings', 'advanced-security', 'audit-log'
      ];
      
      // If second segment is a user profile indicator, it's a user profile
      if (userProfileIndicators.includes(secondSegment)) {
        return firstSegment;
      }
      
      // If second segment looks like a repo name (contains dots, or is a common repo path)
      // Check if it's a file/blob/tree path (these indicate it's a repo)
      const repoIndicators = ['blob', 'tree', 'commits', 'branches', 'tags', 'releases',
                             'compare', 'pulls', 'issues', 'actions', 'projects', 'wiki',
                             'security', 'pulse', 'graphs', 'network', 'search'];
      
      if (repoIndicators.includes(secondSegment)) {
        return null; // It's a repo path, not a user
      }
      
      // If second segment doesn't match user profile indicators and doesn't look like a repo indicator,
      // it's likely a repo name (owner/repo pattern)
      // Repo names can contain letters, numbers, hyphens, underscores, dots
      // But if it's a valid GitHub identifier format, we need to be more careful
      // For now, if it's not a known user profile section, assume it's a repo
      return null;
    }
    
    // Single segment - could be user or org, but we'll return it and let the harvester validate
    // using DOM context
    return firstSegment;
  } catch (e) {
    // Invalid URL
    return null;
  }
}

/**
 * Extract repository name from GitHub URL
 * Returns "owner/repo" format
 */
export function extractRepoName(url: string | null | undefined): string | null {
  if (!url) return null;
  
  // Match patterns like /owner/repo
  const match = url.match(/github\.com\/([^\/]+)\/([^\/\?]+)/);
  if (match && match[1] && match[2]) {
    return `${match[1]}/${match[2]}`;
  }
  
  return null;
}

/**
 * Extract organization name from GitHub URL or element
 */
export function extractOrgName(url: string | null | undefined): string | null {
  if (!url) return null;
  
  // Match patterns like /orgs/orgname or /orgname
  const orgMatch = url.match(/github\.com\/orgs\/([^\/\?]+)/);
  if (orgMatch && orgMatch[1]) {
    return orgMatch[1];
  }
  
  // Also check for direct org pages
  const directMatch = url.match(/github\.com\/([^\/\?]+)/);
  if (directMatch && directMatch[1]) {
    // This might be an org or user, but we'll return it
    return directMatch[1];
  }
  
  return null;
}

/**
 * Get current organization from the page URL
 * Returns the org name if we're on an org page, null otherwise
 */
export function getCurrentOrg(): string | null {
  const url = window.location.href;
  
  // Check for /orgs/orgname pattern
  const orgMatch = url.match(/github\.com\/orgs\/([^\/\?]+)/);
  if (orgMatch && orgMatch[1]) {
    return orgMatch[1];
  }
  
  // Check if we're on a repo page and extract the owner (which might be an org)
  const repoMatch = url.match(/github\.com\/([^\/\?]+)\/([^\/\?]+)/);
  if (repoMatch && repoMatch[1]) {
    // The owner could be an org or user, but we'll return it
    // The caller can check if it's actually an org
    return repoMatch[1];
  }
  
  return null;
}

/**
 * Get current repository from the page URL
 * Returns "owner/repo" format if we're on a repo page, null otherwise
 */
export function getCurrentRepo(): string | null {
  const url = window.location.href;
  return extractRepoName(url);
}

/**
 * Get avatar URL from an image element
 */
export function getAvatarUrl(img: HTMLImageElement | null): string | null {
  if (!img) return null;
  
  // Try src first
  if (img.src && img.src.startsWith('http')) {
    return img.src;
  }
  
  // Try data-src (lazy loading)
  if (img.dataset.src && img.dataset.src.startsWith('http')) {
    return img.dataset.src;
  }
  
  // Try srcset
  if (img.srcset) {
    const srcsetMatch = img.srcset.match(/(https?:\/\/[^\s]+)/);
    if (srcsetMatch) {
      return srcsetMatch[1];
    }
  }
  
  return null;
}

/**
 * Convert image URL to data URL (for storing icons)
 */
export async function imageUrlToDataUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

