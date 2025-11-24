import { featureRegistry } from '../../shared/utils/feature-registry';
import type { FeatureSettingsSchema } from '../../shared/types/settings-ui';

const featureId = 'package-links';

const settingsSchema: FeatureSettingsSchema = {
    featureId,
    displayName: 'NPM/Package Links',
    description: 'Turn package names in dependency files into clickable links to their registries',
    fields: [],
};

// Register the feature
featureRegistry.register({
    id: featureId,
    displayName: 'NPM/Package Links',
    description: 'Turn package names in dependency files into clickable links to their registries',
    enabled: true,
    settingsSchema,
});
