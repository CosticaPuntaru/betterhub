import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { initI18n, i18n } from '../shared/utils/i18n';
import { resources } from '../shared/locales/resources';
import { useSettingsStore } from '../options/store/settings-store';
import { featureRegistry } from '../shared/utils/feature-registry';
import { FeatureSettings } from '../options/components/FeatureSettings';
import { GlobalMasterToggle } from '../options/components/GlobalMasterToggle';
import '../options/index.css';

export function PopupApp() {
    const [i18nReady, setI18nReady] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const [features, setFeatures] = useState<Array<{ id: string; settingsSchema: any }>>([]);

    const { settings, isLoading, updateSettings, initialize } = useSettingsStore();

    useEffect(() => {
        async function init() {
            await initI18n(resources);
            setI18nReady(true);

            // Initialize Zustand store
            await initialize();

            // Load all features
            await loadAllFeatures();

            // Get features with settings
            const featuresWithSettings = featureRegistry.getWithSettings().filter(f => f.settingsSchema).map(f => ({
                id: f.id,
                settingsSchema: f.settingsSchema!,
            }));
            setFeatures(featuresWithSettings);

            setInitialized(true);
        }

        init().catch(console.error);
    }, [initialize]);

    async function loadAllFeatures() {
        try {
            await import('../features/pr-list-customization/index');
            await import('../features/aliasing/index');
            await import('../features/read-comments-tracker/index');
            await import('../features/hide-whitespace/index');
            await import('../features/sticky-headers/index');
            await import('../features/package-links/index');
            await import('../features/image-size/index');
            await import('../features/copy-path/index');
            await import('../features/viewed-checkbox/index');
            await import('../features/expand-resolved/index');
            await import('../features/prevent-close/index');
            await import('../features/reaction-avatars/index');
            await import('../features/build-favicon/index');
        } catch (error) {
            console.error('Failed to load features:', error);
        }
    }

    if (!i18nReady || !initialized || isLoading || !i18n) {
        return (
            <div className="flex items-center justify-center p-6">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        );
    }

    return (
        <I18nextProvider i18n={i18n}>
            <div className="popup-app">
                <div className="space-y-4">
                    <GlobalMasterToggle
                        enableMode={settings.enableMode ?? 'on'}
                        allowlist={settings.allowlist ?? []}
                        onUpdate={updateSettings}
                    />

                    <div className="space-y-4">
                        {features.map((feature) => (
                            <FeatureSettings
                                key={feature.id}
                                featureId={feature.id}
                                schema={feature.settingsSchema}
                                globalEnabled={settings.enableMode !== 'off'}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </I18nextProvider>
    );
}
