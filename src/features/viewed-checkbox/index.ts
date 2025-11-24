import { featureRegistry } from '../../shared/utils/feature-registry';
import type { FeatureSettingsSchema } from '../../shared/types/settings-ui';

const featureId = 'viewed-checkbox';

const settingsSchema: FeatureSettingsSchema = {
    featureId,
    displayName: '"Viewed" Checkbox Visibility',
    description: 'Make the "Viewed" checkbox more accessible via a floating button',
    fields: [],
};

// Register the feature
featureRegistry.register({
    id: featureId,
    displayName: '"Viewed" Checkbox Visibility',
    description: 'Make the "Viewed" checkbox more accessible via a floating button',
    enabled: true,
    settingsSchema,
});
