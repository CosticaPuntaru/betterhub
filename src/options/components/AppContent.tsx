import { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useSettingsStore } from '../store/settings-store';
import { featureRegistry } from '../../shared/utils/feature-registry';
import { setLanguage } from '../../shared/utils/i18n';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Select } from './ui/select';
import { FeatureSettings } from './FeatureSettings';
import { GlobalMasterToggle } from './GlobalMasterToggle';
import { Switch } from './ui/switch';
import { Search, Download, Upload, RotateCcw, Moon, Sun, Languages } from 'lucide-react';
import { useDeepLinking } from '../hooks/useDeepLinking';
import { useSettingsExportImport } from '../hooks/useSettingsExportImport';

export function AppContent() {
    const { t } = useTranslation();
    const [initialized, setInitialized] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [features, setFeatures] = useState<Array<{ id: string; settingsSchema: any }>>([]);

    const { settings, isLoading, updateSettings, initialize } = useSettingsStore();
    const { handleExport, handleImport, handleReset } = useSettingsExportImport();

    useDeepLinking();

    useEffect(() => {
        async function init() {
            // Initialize Zustand store (will sync with extension if available)
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

            // Check for import success message
            if (sessionStorage.getItem('importSuccess')) {
                sessionStorage.removeItem('importSuccess');
                alert('Settings imported successfully!');
            }
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
            await import('../../features/pr-list-customization/index');
            await import('../../features/aliasing/index');
            await import('../../features/read-comments-tracker/index');
            await import('../../features/hide-whitespace/index');
        } catch (error) {
            console.error('Failed to load features:', error);
        }
    }

    if (!initialized || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-muted-foreground">{t('options.loading')}</div>
            </div>
        );
    }

    const filteredFeatures = features.filter((feature) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const schema = feature.settingsSchema;
        const text = `${schema.displayName} ${schema.description || ''} ${schema.fields.map((f: any) => f.label).join(' ')}`.toLowerCase();
        return text.includes(query);
    });

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto p-6 max-w-6xl">
                <header className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold">{t('options.title')}</h1>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                <Languages className="h-4 w-4 text-muted-foreground" />
                                <Select
                                    value={settings.language || 'en'}
                                    onChange={(e) => {
                                        const newLang = e.target.value;
                                        updateSettings({ language: newLang });
                                        setLanguage(newLang);
                                    }}
                                    className="h-9 w-32"
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
                                title={settings.theme === 'dark' ? t('options.switchToLight') : t('options.switchToDark')}
                            >
                                {settings.theme === 'dark' ? (
                                    <Sun className="h-5 w-5" />
                                ) : (
                                    <Moon className="h-5 w-5" />
                                )}
                            </Button>
                            <Button variant="outline" onClick={handleExport}>
                                <Download className="h-4 w-4" />
                                {t('options.export')}
                            </Button>
                            <Button variant="outline" onClick={() => {
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
                            }}>
                                <Upload className="h-4 w-4" />
                                {t('options.import')}
                            </Button>
                            <Button variant="destructive" onClick={handleReset}>
                                <RotateCcw className="h-4 w-4" />
                                <span className="hidden sm:inline">{t('options.reset')}</span>
                            </Button>
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder={t('options.search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </header>

                <main className="space-y-6">
                    <GlobalMasterToggle
                        enableMode={settings.enableMode ?? 'on'}
                        allowlist={settings.allowlist ?? []}
                        onUpdate={updateSettings}
                    />

                    <div className="flex items-center justify-end">
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
                            <span>{t('options.debugMode')}</span>
                            <Switch
                                checked={settings.debug ?? false}
                                onChange={(e) => updateSettings({ debug: e.target.checked })}
                                className="scale-75"
                            />
                        </label>
                    </div>

                    {filteredFeatures.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-muted-foreground">
                                    {searchQuery ? (
                                        <Trans i18nKey="options.noSearchResults" />
                                    ) : (
                                        <Trans i18nKey="options.noFeatures" />
                                    )}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredFeatures.map((feature) => (
                            <FeatureSettings
                                key={feature.id}
                                featureId={feature.id}
                                schema={feature.settingsSchema}
                                globalEnabled={settings.enableMode !== 'off'}
                            />
                        ))
                    )}
                </main>
            </div>
        </div>
    );
}
