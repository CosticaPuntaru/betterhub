import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { initI18n, i18n } from '../shared/utils/i18n';
import { resources } from '../shared/locales/resources';
import { AppContent } from './components/AppContent';
import './index.css';

export function App() {
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
