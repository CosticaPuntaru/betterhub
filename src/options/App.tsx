import { useEffect, useState } from 'react';
import { I18nextProvider, useTranslation, Trans } from 'react-i18next';
import { useSettingsStore } from './store/settings-store';
import { featureRegistry } from '../shared/utils/feature-registry';
import { initI18n, i18n, setLanguage } from '../shared/utils/i18n';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent } from './components/ui/card';
import { Select } from './components/ui/select';
import { FeatureSettings } from './components/FeatureSettings';
import { GlobalMasterToggle } from './components/GlobalMasterToggle';
import { Search, Download, Upload, RotateCcw, Moon, Sun, Languages } from 'lucide-react';

// Load translations
const translations = {
  en: {
    translation: {
      'options.title': 'BetterHub Settings',
      'options.search': 'Search settings...',
      'options.export': 'Export Settings',
      'options.import': 'Import Settings',
      'options.reset': 'Reset All',
      'options.enableBetterHub': 'Enable BetterHub',
      'options.enableBetterHubDesc': 'Turn on/off all BetterHub features',
      'options.enableBetterHubWithDesc': '<0>Enable BetterHub</0><1>, Turn on/off all BetterHub features</1>',
      'options.noSearchResults': 'No settings match your search.',
      'options.noFeatures': 'No features with settings available.',
      'options.enableOnPages': 'Enable on Pages',
    },
  },
  es: {
    translation: {
      'options.title': 'Configuración de BetterHub',
      'options.search': 'Buscar configuración...',
      'options.export': 'Exportar Configuración',
      'options.import': 'Importar Configuración',
      'options.reset': 'Restablecer Todo',
      'options.enableBetterHub': 'Habilitar BetterHub',
      'options.enableBetterHubDesc': 'Activar/desactivar todas las funciones de BetterHub',
      'options.enableBetterHubWithDesc': '<0>Habilitar BetterHub</0><1>, Activar/desactivar todas las funciones de BetterHub</1>',
      'options.noSearchResults': 'No hay configuraciones que coincidan con tu búsqueda.',
      'options.noFeatures': 'No hay funciones con configuración disponible.',
      'options.enableOnPages': 'Habilitar en Páginas',
    },
  },
  fr: {
    translation: {
      'options.title': 'Paramètres BetterHub',
      'options.search': 'Rechercher les paramètres...',
      'options.export': 'Exporter les Paramètres',
      'options.import': 'Importer les Paramètres',
      'options.reset': 'Tout Réinitialiser',
      'options.enableBetterHub': 'Activer BetterHub',
      'options.enableBetterHubDesc': 'Activer/désactiver toutes les fonctionnalités BetterHub',
      'options.enableBetterHubWithDesc': '<0>Activer BetterHub</0><1>, Activer/désactiver toutes les fonctionnalités BetterHub</1>',
      'options.noSearchResults': 'Aucun paramètre ne correspond à votre recherche.',
      'options.noFeatures': 'Aucune fonctionnalité avec paramètres disponible.',
      'options.enableOnPages': 'Activer sur les Pages',
    },
  },
  de: {
    translation: {
      'options.title': 'BetterHub Einstellungen',
      'options.search': 'Einstellungen suchen...',
      'options.export': 'Einstellungen Exportieren',
      'options.import': 'Einstellungen Importieren',
      'options.reset': 'Alles Zurücksetzen',
      'options.enableBetterHub': 'BetterHub Aktivieren',
      'options.enableBetterHubDesc': 'Alle BetterHub-Funktionen ein/ausschalten',
      'options.enableBetterHubWithDesc': '<0>BetterHub Aktivieren</0><1>, Alle BetterHub-Funktionen ein/ausschalten</1>',
      'options.noSearchResults': 'Keine Einstellungen entsprechen Ihrer Suche.',
      'options.noFeatures': 'Keine Funktionen mit Einstellungen verfügbar.',
      'options.enableOnPages': 'Auf Seiten Aktivieren',
    },
  },
};

function AppContent() {
  const { t } = useTranslation();
  const [initialized, setInitialized] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [features, setFeatures] = useState<Array<{ id: string; settingsSchema: any }>>([]);
  
  const { settings, isLoading, updateSettings, resetSettings, initialize } = useSettingsStore();

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
        showNotification('Settings imported successfully!', 'success');
      }

      // Handle deep linking
      handleDeepLinking();
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
    } catch (error) {
      console.error('Failed to load features:', error);
    }
  }

  function handleDeepLinking() {
    const hash = window.location.hash;
    if (!hash) return;

    const match = hash.match(/^#alias-(user|project|org)-(.+)$/);
    if (!match) return;

    const [, , encodedOriginal] = match;
    const original = decodeURIComponent(encodedOriginal);

    const scrollAndHighlight = () => {
      const aliasItem = document.querySelector(
        `.alias-item[data-original="${CSS.escape(original)}"]`
      ) as HTMLElement;

      if (aliasItem) {
        aliasItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        aliasItem.style.backgroundColor = '#fff3cd';
        aliasItem.style.border = '2px solid #ffc107';
        aliasItem.style.transition = 'all 0.3s ease';
        aliasItem.style.boxShadow = '0 0 10px rgba(255, 193, 7, 0.5)';

        setTimeout(() => {
          aliasItem.style.backgroundColor = '';
          aliasItem.style.border = '';
          aliasItem.style.boxShadow = '';
        }, 3000);

        return true;
      }
      return false;
    };

    if (!scrollAndHighlight()) {
      setTimeout(() => {
        if (!scrollAndHighlight()) {
          setTimeout(scrollAndHighlight, 2000);
        }
      }, 1000);
    }
  }

  function showNotification(message: string, _type: 'success' | 'error') {
    // Simple notification - can be enhanced with a toast component later
    alert(message);
  }

  async function handleExport() {
    try {
      const exportData = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        settings,
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `betterhub-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showNotification('Settings exported successfully!', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      showNotification('Failed to export settings. Please try again.', 'error');
    }
  }

  async function handleImport(file: File) {
    try {
      const text = await file.text();
      const importData = JSON.parse(text);

      if (!importData.settings || typeof importData.settings !== 'object') {
        throw new Error('Invalid settings file format');
      }

      const confirmed = window.confirm(
        'This will replace all your current settings. Are you sure you want to continue?'
      );

      if (!confirmed) {
        return;
      }

      // Update Zustand store (will sync to extension if in extension mode)
      updateSettings(importData.settings);

      sessionStorage.setItem('importSuccess', 'true');
      window.location.reload();
    } catch (error) {
      console.error('Import failed:', error);
      showNotification(
        `Failed to import settings: ${error instanceof Error ? error.message : 'Invalid file format'}`,
        'error'
      );
    }
  }

  async function handleReset() {
    try {
      const confirmed = window.confirm(
        'This will reset ALL settings to their default values. This action cannot be undone. Are you sure you want to continue?'
      );

      if (!confirmed) {
        return;
      }

      resetSettings();

      showNotification('All settings have been reset to defaults!', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Reset failed:', error);
      showNotification('Failed to reset settings. Please try again.', 'error');
    }
  }

  if (!initialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
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
                </Select>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
                  updateSettings({ theme: newTheme });
                }}
                title={settings.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
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
                {t('options.reset')}
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
            enabled={settings.enabled ?? true}
            onToggle={(enabled) => updateSettings({ enabled })}
          />

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
                globalEnabled={settings.enabled ?? true}
              />
            ))
          )}
        </main>
      </div>
    </div>
  );
}

export function App() {
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    async function init() {
      await initI18n(translations);
      setI18nReady(true);
    }
    init().catch(console.error);
  }, []);

  if (!i18nReady || !i18n) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      <AppContent />
    </I18nextProvider>
  );
}
