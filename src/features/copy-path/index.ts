import { featureRegistry } from '../../shared/utils/feature-registry';
import type { FeatureSettingsSchema } from '../../shared/types/settings-ui';

const featureId = 'copy-path';

const settingsSchema: FeatureSettingsSchema = {
    featureId,
    displayName: 'Copy File Path Button',
    description: 'Add a one-click button to copy the relative file path in file headers',
    fields: [],
};

// Register the feature
featureRegistry.register({
    id: featureId,
    displayName: 'Copy File Path Button',
    description: 'Add a one-click button to copy the relative file path in file headers',
    enabled: true,
    settingsSchema,
});
