import { featureRegistry } from '../../shared/utils/feature-registry';
import type { FeatureSettingsSchema } from '../../shared/types/settings-ui';

const settingsSchema: FeatureSettingsSchema = {
    featureId: 'read-comments-tracker',
    displayName: 'Read Comments Tracker',
    description: 'Tracks new comments on PRs and highlights them in the PR list.',
    fields: [
        {
            key: 'readCommentsTracker.readColor',
            type: 'color',
            label: 'Read Color',
            description: 'Color for PRs with no new comments',
            default: '#2da44e',
        },
        {
            key: 'readCommentsTracker.unreadColor',
            type: 'color',
            label: 'Unread Color',
            description: 'Color for PRs with new comments',
            default: '#bc8c00',
        },
    ],
};

featureRegistry.register({
    id: 'read-comments-tracker',
    displayName: 'Read Comments Tracker',
    description: 'Tracks new comments on PRs',
    enabled: true,
    settingsSchema,
});
