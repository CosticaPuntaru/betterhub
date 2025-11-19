# Shared Utilities

Shared code and utilities used across the BetterHub extension.

## Structure

```
shared/
├── constants/        # Constants and enums
│   └── features.ts  # Feature constants
├── locales/          # Translation files
│   └── en.json       # English translations
├── types/            # TypeScript type definitions
│   ├── settings.ts   # Settings types
│   └── settings-ui.ts # Settings UI types
└── utils/            # Utility functions
    ├── feature-registry.ts    # Feature registration
    ├── settings-manager.ts    # Settings management
    ├── storage.ts             # Storage abstraction
    ├── i18n.ts               # Internationalization
    └── ...
```

## Key Utilities

### Feature Registry
Manages feature registration and lifecycle.

**Location:** [`utils/feature-registry.ts`](./utils/feature-registry.ts)  
**Documentation:** [`utils/feature-registry.md`](./utils/feature-registry.md)

### Settings Manager
Centralized settings management with real-time sync.

**Location:** [`utils/settings-manager.ts`](./utils/settings-manager.ts)  
**Documentation:** [`utils/settings-manager.md`](./utils/settings-manager.md)

### Storage
Abstraction layer for Chrome extension storage.

**Location:** [`utils/storage.ts`](./utils/storage.ts)

### i18n
Internationalization utilities using i18next.

**Location:** [`utils/i18n.ts`](./utils/i18n.ts)  
**Documentation:** [`../../docs/i18n.md`](../../docs/i18n.md)

## Types

### Settings
Core settings type definitions.

**Location:** [`types/settings.ts`](./types/settings.ts)

### Settings UI
Types for settings UI schemas.

**Location:** [`types/settings-ui.ts`](./types/settings-ui.ts)

## Related Documentation

- [Settings System](../../docs/settings.md) - Settings architecture
- [i18n Guide](../../docs/i18n.md) - Internationalization
- [Architecture](../../docs/architecture.md) - System architecture

