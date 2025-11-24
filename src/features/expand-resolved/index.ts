import { featureRegistry } from '../../shared/utils/feature-registry';
import type { FeatureSettingsSchema } from '../../shared/types/settings-ui';

const featureId = 'expand-resolved';

const settingsSchema: FeatureSettingsSchema = {
    featureId,
    displayName: 'Auto-Expand Resolved Comments',
    description: 'Add a button to expand all resolved comment threads in PRs',
    fields: [],
};

// Register the feature
featureRegistry.register({
    id: featureId,
    displayName: 'Auto-Expand Resolved Comments',
    description: 'Add a button to expand all resolved comment threads in PRs',
    enabled: true,
    settingsSchema,
});
