import { featureRegistry } from '../../shared/utils/feature-registry';
import type { FeatureSettingsSchema } from '../../shared/types/settings-ui';

const featureId = 'hide-whitespace';

const settingsSchema: FeatureSettingsSchema = {
    featureId,
    displayName: 'Default Hide Whitespace',
    description: 'Automatically hide whitespace changes in PR diffs',
    fields: [],
};

// Register the feature
featureRegistry.register({
    id: featureId,
    displayName: 'Default Hide Whitespace',
    description: 'Automatically hide whitespace changes in PR diffs',
    enabled: true,
    settingsSchema,
});
