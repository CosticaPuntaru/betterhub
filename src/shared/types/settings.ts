/**
 * Settings type definitions and schema
 * This file defines the structure of all settings in the extension
 */

import type { AliasingSettings } from '../../features/aliasing/types';
import type { ReadCommentsTrackerSettings } from '../../features/read-comments-tracker/types';

export interface Settings {
  // Global settings
  language: string;
  theme: 'light' | 'dark';
  enableMode: 'on' | 'off' | 'allowlist'; // Master toggle mode
  allowlist: string[]; // List of orgs or repos for allowlist mode
  debug: boolean; // Debug mode toggle

  // Feature enable/disable toggles
  features: FeatureToggles;

  // Feature-specific settings
  prList?: PRListSettings;
  aliasing?: AliasingSettings;
  readCommentsTracker?: ReadCommentsTrackerSettings;

  // Add more feature settings here as they are added
  [key: string]: unknown;
}

export interface FeatureToggles {
  // Master toggle for each feature
  'pr-list-customization': boolean;
  'aliasing': boolean;
  'read-comments-tracker': boolean;
  'hide-whitespace': boolean;
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
  hidePrMetaInfo: boolean;
  hideReviewStatusText: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  language: 'en',
  theme: 'light',
  enableMode: 'on',
  allowlist: [],
  debug: false,
  features: {
    'pr-list-customization': true,
    'aliasing': true,
    'read-comments-tracker': true,
    'hide-whitespace': true,
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
    hidePrMetaInfo: false,
    hideReviewStatusText: false,
  },
  aliasing: {
    users: [],
    projects: [],
    orgs: [],
    autoHarvestUsers: false,
    autoHarvestProjects: false,
    autoHarvestOrgs: false,
    autoAliasUsers: false,
    autoAliasProjects: false,
    autoAliasOrgs: false,
  },
  readCommentsTracker: {
    readColor: '#2da44e', // Green
    unreadColor: '#bc8c00', // Orange
  },
};

