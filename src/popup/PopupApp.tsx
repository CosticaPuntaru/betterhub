import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { initI18n, i18n, setLanguage } from '../shared/utils/i18n';
import { resources } from '../shared/locales/resources';
import { useSettingsStore } from '../options/store/settings-store';
import { featureRegistry } from '../shared/utils/feature-registry';
import { FeatureSettings } from '../options/components/FeatureSettings';
import { GlobalMasterToggle } from '../options/components/GlobalMasterToggle';
import { Button } from '../options/components/ui/button';
import { Input } from '../options/components/ui/input';
import { Select } from '../options/components/ui/select';
import { Search, Download, Upload, RotateCcw, Moon, Sun, Languages } from 'lucide-react';
import { useSettingsExportImport } from '../options/hooks/useSettingsExportImport';
import '../options/index.css';

function PopupContent() {
    const [initialized, setInitialized] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [features, setFeatures] = useState<Array<{ id: string; settingsSchema: any }>>([]);

    const { settings, isLoading, updateSettings, initialize } = useSettingsStore();
    const { handleExport, handleImport, handleReset } = useSettingsExportImport();

    useEffect(() => {
        async function init() {
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

    // Apply theme to document
    useEffect(() => {
        const theme = settings.theme || 'light';
        const html = document.documentElement;
        if (theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
    }, [settings.theme]);

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

    if (!initialized || isLoading) {
        return (
            <div className="flex items-center justify-center p-6">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        );
    }

    const filteredFeatures = features.filter((feature) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const schema = feature.settingsSchema;

        // Search through feature name and description
        const featureText = `${schema.displayName} ${schema.description || ''}`.toLowerCase();
        if (featureText.includes(query)) return true;

        // Search through all field labels and descriptions
        const fieldsText = schema.fields.map((f: any) =>
            `${f.label} ${f.description || ''}`
        ).join(' ').toLowerCase();

        return fieldsText.includes(query);
    });

    return (
        <div className="popup-app w-[650px] max-h-[700px] overflow-y-auto bg-background">
            <header className="sticky top-0 z-10 bg-background border-b p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                    <h1 className="text-xl font-bold">BetterHub</h1>
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1">
                            <Languages className="h-3 w-3 text-muted-foreground" />
                            <Select
                                value={settings.language || 'en'}
                                onChange={(e) => {
                                    const newLang = e.target.value;
                                    updateSettings({ language: newLang });
                                    setLanguage(newLang);
                                }}
                                className="h-7 w-24 text-xs"
                            >
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="fr">Français</option>
                                <option value="de">Deutsch</option>
                                <option value="ro">Română</option>
                            </Select>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
                                updateSettings({ theme: newTheme });
                            }}
                            className="h-7 w-7"
                            title={settings.theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                        >
                            {settings.theme === 'dark' ? (
                                <Sun className="h-4 w-4" />
                            ) : (
                                <Moon className="h-4 w-4" />
                            )}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleExport} className="h-7 w-7" title="Export">
                            <Download className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = '.json';
                            input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) {
                                    handleImport(file);
                                }
                            };
                            input.click();
                        }} className="h-7 w-7" title="Import">
                            <Upload className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleReset} className="h-7 w-7" title="Reset">
                            <RotateCcw className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search settings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-7 h-8 text-sm"
                    />
                </div>
            </header>

            <div className="p-4 space-y-3">
                <GlobalMasterToggle
                    enableMode={settings.enableMode ?? 'on'}
                    allowlist={settings.allowlist ?? []}
                    onUpdate={updateSettings}
                />

                {filteredFeatures.map((feature) => (
                    <FeatureSettings
                        key={feature.id}
                        featureId={feature.id}
                        schema={feature.settingsSchema}
                        globalEnabled={settings.enableMode !== 'off'}
                        searchQuery={searchQuery}
                    />
                ))}

                {filteredFeatures.length === 0 && searchQuery && (
                    <div className="text-center text-sm text-muted-foreground py-8">
                        No settings found matching "{searchQuery}"
                    </div>
                )}
            </div>
        </div>
    );
}

export function PopupApp() {
    const [i18nReady, setI18nReady] = useState(false);

    useEffect(() => {
        async function init() {
            await initI18n(resources);
            setI18nReady(true);
        }

        init().catch(console.error);
    }, []);

    if (!i18nReady || !i18n) {
        return (
            <div className="flex items-center justify-center p-6">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        );
    }

    return (
        <I18nextProvider i18n={i18n}>
            <PopupContent />
        </I18nextProvider>
    );
}
