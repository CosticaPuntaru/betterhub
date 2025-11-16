/**
 * PR List Customization Feature
 * Allows users to hide various elements from GitHub PR listing pages
 */

import { featureRegistry } from '../../shared/utils/feature-registry';
import type { FeatureSettingsSchema } from '../../shared/types/settings-ui';

const featureId = 'pr-list-customization';

const settingsSchema: FeatureSettingsSchema = {
  featureId,
  displayName: 'PR List Customization',
  description: 'Customize which elements are shown on pull request listing pages',
  pages: [
    {
      pageId: 'pulls',
      label: 'Pull Requests Page',
      description: 'Enable on pull requests listing page',
    },
  ],
  fields: [
    {
      key: 'prList.hideLabels',
      type: 'checkbox',
      label: 'Hide Labels',
      description: 'Hide PR labels from the list view',
      default: false,
    },
    {
      key: 'prList.hideStatusBadges',
      type: 'checkbox',
      label: 'Hide Status Badges',
      description: 'Hide draft, ready for review, and other status badges',
      default: false,
    },
    {
      key: 'prList.hideAuthorAvatars',
      type: 'checkbox',
      label: 'Hide Author Avatars',
      description: 'Hide author profile pictures',
      default: false,
    },
    {
      key: 'prList.hideDescriptions',
      type: 'checkbox',
      label: 'Hide Descriptions',
      description: 'Hide PR description previews',
      default: false,
    },
    {
      key: 'prList.hideReviewStatus',
      type: 'checkbox',
      label: 'Hide Review Status',
      description: 'Hide review status indicators',
      default: false,
    },
    {
      key: 'prList.hideMergeStatus',
      type: 'checkbox',
      label: 'Hide Merge Status',
      description: 'Hide merge status indicators',
      default: false,
    },
    {
      key: 'prList.hideFileChangeCounts',
      type: 'checkbox',
      label: 'Hide File Change Counts',
      description: 'Hide the number of files changed',
      default: false,
    },
    {
      key: 'prList.hideCommentCounts',
      type: 'checkbox',
      label: 'Hide Comment Counts',
      description: 'Hide comment count badges',
      default: false,
    },
    {
      key: 'prList.hideTimestamps',
      type: 'checkbox',
      label: 'Hide Timestamps',
      description: 'Hide time information (e.g., "2 days ago")',
      default: false,
    },
    {
      key: 'prList.hideBranchNames',
      type: 'checkbox',
      label: 'Hide Branch Names',
      description: 'Hide source and target branch names',
      default: false,
    },
  ],
};

// Register the feature
featureRegistry.register({
  id: featureId,
  displayName: 'PR List Customization',
  description: 'Customize PR list display',
  enabled: true,
  settingsSchema,
});

