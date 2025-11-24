/**
 * Type definitions for aliasing feature
 */

export type AliasType = 'user' | 'project' | 'org';

export interface AliasItem {
  original: string; // Original name (username, repo name, org name)
  alias: string; // Custom alias name
  enabled: boolean; // Manual enable/disable toggle
  color?: string; // Color for color+text display (hex format)
  icon?: string; // Icon URL or data URL (mutually exclusive with color)
}

export interface AliasingSettings {
  // Arrays of alias items
  users: AliasItem[];
  projects: AliasItem[];
  orgs: AliasItem[];

  // Auto-harvest flags
  autoHarvestUsers: boolean;
  autoHarvestProjects: boolean;
  autoHarvestOrgs: boolean;

  // Auto-alias flags
  autoAliasUsers: boolean;
  autoAliasProjects: boolean;
  autoAliasOrgs: boolean;
}

