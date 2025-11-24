import { featureRegistry } from '../../shared/utils/feature-registry';
import type { FeatureSettingsSchema } from '../../shared/types/settings-ui';

const featureId = 'prevent-close';

const settingsSchema: FeatureSettingsSchema = {
    featureId,
    displayName: 'Prevent Accidental Tab Close',
    description: 'Warn before closing tab if there are unsaved comments',
    fields: [],
};

// Register the feature
featureRegistry.register({
    id: featureId,
    displayName: 'Prevent Accidental Tab Close',
    description: 'Warn before closing tab if there are unsaved comments',
    enabled: true,
    settingsSchema,
});
