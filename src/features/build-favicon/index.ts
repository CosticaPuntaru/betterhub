import { featureRegistry } from '../../shared/utils/feature-registry';
import type { FeatureSettingsSchema } from '../../shared/types/settings-ui';

const featureId = 'build-favicon';

const settingsSchema: FeatureSettingsSchema = {
    featureId,
    displayName: 'Build Status Favicon',
    description: 'Update favicon to reflect CI/CD build status',
    fields: [],
};

// Register the feature
featureRegistry.register({
    id: featureId,
    displayName: 'Build Status Favicon',
    description: 'Update favicon to reflect CI/CD build status',
    enabled: true,
    settingsSchema,
});
