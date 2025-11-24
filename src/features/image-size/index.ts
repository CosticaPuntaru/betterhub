import { featureRegistry } from '../../shared/utils/feature-registry';
import type { FeatureSettingsSchema } from '../../shared/types/settings-ui';

const featureId = 'image-size';

const settingsSchema: FeatureSettingsSchema = {
    featureId,
    displayName: 'Image Size Display',
    description: 'Display image dimensions and file size in Pull Request diffs and file views',
    fields: [],
};

// Register the feature
featureRegistry.register({
    id: featureId,
    displayName: 'Image Size Display',
    description: 'Display image dimensions and file size in Pull Request diffs and file views',
    enabled: true,
    settingsSchema,
});
