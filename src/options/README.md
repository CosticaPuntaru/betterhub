# Options Page

The BetterHub settings/options page built with React, TypeScript, and Zustand.

## Overview

The options page provides a unified interface for managing all BetterHub settings. It uses:
- **React** - Component-based UI
- **Zustand** - State management
- **Auto-generated UI** - Features define settings schemas, UI is generated automatically

## Architecture

```
options/
├── App.tsx                 # Main app component
├── components/             # React components
│   ├── FeatureSettings.tsx # Feature settings renderer
│   ├── AliasList.tsx      # Alias management component
│   ├── HarvestWhitelist.tsx # Whitelist management component
│   └── ui/                # Reusable UI components
├── store/                 # Zustand stores
│   ├── settings-store.ts  # Settings state management
│   └── extension-adapter.ts # Extension API adapter
└── README.md              # This file
```

## Key Components

### FeatureSettings
Renders settings for a feature based on its schema. Automatically generates UI for:
- Checkboxes
- Text inputs
- Number inputs
- Select dropdowns
- Textareas
- Custom types (alias-list, harvest-whitelist)

### AliasList
React component for managing alias lists (users, projects, orgs). Replaces the old vanilla DOM implementation.

### HarvestWhitelist
React component for managing harvest whitelists (orgs, repos). Replaces the old vanilla DOM implementation.

## State Management

Settings are managed via Zustand store (`settings-store.ts`):
- Centralized state
- Real-time sync with extension storage
- Automatic UI updates on changes

## Related Documentation

- [Components](./components/README.md) - Component documentation
- [Settings System](../docs/settings.md) - Settings architecture
- [Development Guide](../docs/development.md) - Development workflow

