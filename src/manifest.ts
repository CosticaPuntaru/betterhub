import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
  manifest_version: 3,
  name: 'BetterHub',
  version: '1.0.0',
  description: 'GitHub customization extension with feature-based architecture',
  permissions: ['storage', 'tabs'],
  host_permissions: ['https://github.com/*'],
  background: {
    service_worker: 'src/background/service-worker.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['https://github.com/*'],
      js: ['src/content/github.ts'],
      run_at: 'document_end',
    },
  ],
  action: {
    default_popup: 'src/popup/popup.html',
    default_icon: {
      16: 'public/icon-16.png',
      32: 'public/icon-32.png',
      48: 'public/icon-48.png',
      128: 'public/icon-128.png',
    },
  },
  icons: {
    16: 'public/icon-16.png',
    32: 'public/icon-32.png',
    48: 'public/icon-48.png',
    128: 'public/icon-128.png',
  },
  options_page: 'src/options/options.html',
  web_accessible_resources: [
    {
      resources: ['src/styles/*.css'],
      matches: ['https://github.com/*'],
    },
  ],
});

