import { featureRegistry } from '../../shared/utils/feature-registry';
import type { FeatureSettingsSchema } from '../../shared/types/settings-ui';

const featureId = 'reaction-avatars';

const settingsSchema: FeatureSettingsSchema = {
    featureId,
    displayName: 'Reaction Avatars',
    description: 'Display user avatars next to reaction emojis',
    fields: [],
};

// Register the feature
featureRegistry.register({
    id: featureId,
    displayName: 'Reaction Avatars',
    description: 'Display user avatars next to reaction emojis',
    enabled: true,
    settingsSchema,
});
