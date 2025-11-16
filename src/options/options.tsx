import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';
import { initializeExtensionAdapter } from './store/extension-adapter';

// Import chrome mock for development (only if not in extension context)
import '../shared/utils/chrome-mock';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

// Initialize extension adapter (will only activate in extension context)
initializeExtensionAdapter().catch(console.error);

const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

