/**
 * Extension popup shell
 * Loads feature components conditionally
 */

import { settingsManager } from '../shared/utils/settings-manager';
import { initI18n } from '../shared/utils/i18n';
import { t } from '../shared/utils/i18n';

// Load translations (will be populated by harvesting)
const translations = {
  en: {
    translation: {
      'popup.title': 'BetterHub',
      'popup.openSettings': 'Open Settings',
    },
  },
};

async function initPopup(): Promise<void> {
  // Initialize i18n
  await initI18n(translations);

  // Initialize settings
  await settingsManager.initialize();

  const root = document.getElementById('popup-root');
  if (!root) return;

  // Render popup content
  root.innerHTML = `
    <div class="popup-welcome">
      <p>${t('popup.title')}</p>
      <p>Quick access to GitHub customization features.</p>
    </div>
  `;

  // Load feature popup components if needed
  // Features can register popup components via feature registry
}

initPopup().catch(console.error);

