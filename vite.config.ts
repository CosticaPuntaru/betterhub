import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './src/manifest';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
    crx({ 
      manifest,
      contentScripts: {
        injectCss: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/shared': resolve(__dirname, './src/shared'),
      '@/features': resolve(__dirname, './src/features'),
    },
    dedupe: ['react', 'react-dom'],
    // Ensure React's internal scheduler is resolved correctly
    conditions: ['import', 'module', 'browser', 'default'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: [],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/popup.html'),
        options: resolve(__dirname, 'src/options/options.html'),
        standalone: resolve(__dirname, 'debug/index.html'),
      },
      output: {
        manualChunks: (id) => {
          // Bundle React, React-DOM, scheduler, and react-i18next together
          // This prevents circular dependencies and ensures scheduler is available
          if (
            id.includes('node_modules/react/') || 
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react/jsx') ||
            id.includes('node_modules/scheduler/') ||
            id.includes('node_modules/react-i18next/')
          ) {
            return 'react-vendor';
          }
          // Bundle other vendor dependencies
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        // Ensure proper chunk loading order
        chunkFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  server: {
    port: 5173,
    open: '/debug/index.html',
  },
});

