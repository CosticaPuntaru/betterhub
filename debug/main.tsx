import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '../src/options/App';
import '../src/options/index.css';

// Prevent React DevTools duplicate injection
if (typeof window !== 'undefined' && !(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  // This will be set by React DevTools if present
  (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = {};
}

// Standalone mode - no extension adapter, just Zustand
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

