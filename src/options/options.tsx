import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';
import { initializeExtensionAdapter } from './store/extension-adapter';

// Import chrome mock for development (only if not in extension context)
import '../shared/utils/chrome-mock';

// Prevent React DevTools duplicate injection
if (typeof window !== 'undefined' && !(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  // This will be set by React DevTools if present
  (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = {};
}

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

