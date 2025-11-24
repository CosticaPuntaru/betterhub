import { featureRegistry } from '../../shared/utils/feature-registry';
import type { FeatureSettingsSchema } from '../../shared/types/settings-ui';

const featureId = 'sticky-headers';

const settingsSchema: FeatureSettingsSchema = {
    featureId,
    displayName: 'Sticky File Headers',
    description: 'Keep file names visible while scrolling through large diffs in Pull Requests',
    fields: [],
};

// Register the feature
featureRegistry.register({
    id: featureId,
    displayName: 'Sticky File Headers',
    description: 'Keep file names visible while scrolling through large diffs in Pull Requests',
    enabled: true,
    settingsSchema,
});
