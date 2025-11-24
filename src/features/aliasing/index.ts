/**
 * Aliasing Feature
 * Allows users to create custom aliases for GitHub users, projects, and organizations
 */

import { featureRegistry } from '../../shared/utils/feature-registry';
import type { FeatureSettingsSchema } from '../../shared/types/settings-ui';

const featureId = 'aliasing';

const settingsSchema: FeatureSettingsSchema = {
  featureId,
  displayName: 'Aliasing',
  description: 'Create custom aliases for GitHub users, projects, and organizations with colors and icons',
  fields: [
    {
      key: 'aliasing.autoHarvestUsers',
      type: 'checkbox',
      label: 'Auto-harvest Users',
      description: 'Automatically detect and store users found on pages',
      default: false,
    },
    {
      key: 'aliasing.autoHarvestProjects',
      type: 'checkbox',
      label: 'Auto-harvest Projects',
      description: 'Automatically detect and store projects found on pages',
      default: false,
    },
    {
      key: 'aliasing.autoHarvestOrgs',
      type: 'checkbox',
      label: 'Auto-harvest Organizations',
      description: 'Automatically detect and store organizations found on pages',
      default: false,
    },
    {
      key: 'aliasing.autoAliasUsers',
      type: 'checkbox',
      label: 'Auto-alias Users',
      description: 'Automatically create aliases for users using their avatar as icon',
      default: false,
    },
    {
      key: 'aliasing.autoAliasProjects',
      type: 'checkbox',
      label: 'Auto-alias Projects',
      description: 'Automatically create aliases for projects using acronym and color',
      default: false,
    },
    {
      key: 'aliasing.autoAliasOrgs',
      type: 'checkbox',
      label: 'Auto-alias Organizations',
      description: 'Automatically create aliases for organizations using acronym and color',
      default: false,
    },
    {
      key: 'aliasing.users',
      type: 'alias-list',
      label: 'User Aliases',
      description: 'Manage aliases for GitHub users',
      default: [],
    },
    {
      key: 'aliasing.projects',
      type: 'alias-list',
      label: 'Project Aliases',
      description: 'Manage aliases for GitHub repositories',
      default: [],
    },
    {
      key: 'aliasing.orgs',
      type: 'alias-list',
      label: 'Organization Aliases',
      description: 'Manage aliases for GitHub organizations',
      default: [],
    },
  ],
};

// Register the feature
featureRegistry.register({
  id: featureId,
  displayName: 'Aliasing',
  description: 'Custom aliases for GitHub entities',
  enabled: true,
  settingsSchema,
});

