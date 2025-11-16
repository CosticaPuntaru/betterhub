/**
 * Settings type definitions and schema
 * This file defines the structure of all settings in the extension
 */

import type { AliasingSettings } from '../../features/aliasing/types';

export interface Settings {
  // Global settings
  language: string;
  enabled: boolean; // Master toggle for entire extension
  
  // Feature enable/disable toggles
  features: FeatureToggles;
  
  // Feature-specific settings
  prList?: PRListSettings;
  aliasing?: AliasingSettings;
  
  // Add more feature settings here as they are added
  [key: string]: unknown;
}

export interface FeatureToggles {
  // Master toggle for each feature
  'pr-list-customization': boolean;
  'aliasing': boolean;
  // Add more feature toggles here as features are added
  [featureId: string]: boolean;
}

export interface PRListSettings {
  // Page-specific enable/disable toggles
  enabledOnPages: {
    pulls: boolean; // Pull requests list page
    issues?: boolean; // Issues list page (if applicable)
    // Add more pages as needed
    [page: string]: boolean | undefined;
  };
  // Element hiding settings
  hideLabels: boolean;
  hideStatusBadges: boolean;
  hideAuthorAvatars: boolean;
  hideDescriptions: boolean;
  hideReviewStatus: boolean;
  hideMergeStatus: boolean;
  hideFileChangeCounts: boolean;
  hideCommentCounts: boolean;
  hideTimestamps: boolean;
  hideBranchNames: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  language: 'en',
  enabled: true, // Extension enabled by default
  features: {
    'pr-list-customization': true,
    'aliasing': true,
  },
  prList: {
    enabledOnPages: {
      pulls: true,
    },
    hideLabels: false,
    hideStatusBadges: false,
    hideAuthorAvatars: false,
    hideDescriptions: false,
    hideReviewStatus: false,
    hideMergeStatus: false,
    hideFileChangeCounts: false,
    hideCommentCounts: false,
    hideTimestamps: false,
    hideBranchNames: false,
  },
  aliasing: {
    users: [],
    projects: [],
    orgs: [],
    autoHarvestUsers: false,
    autoHarvestProjects: false,
    autoHarvestOrgs: false,
    harvestOrgWhitelist: 'all',
    harvestRepoWhitelist: 'all',
    autoAliasUsers: false,
    autoAliasProjects: false,
    autoAliasOrgs: false,
  },
};

