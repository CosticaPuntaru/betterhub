# Settings Manager

Centralized settings management with real-time synchronization across all extension contexts.

## Overview

The settings manager provides:
- **Unified API** - Single interface for settings access
- **Real-time sync** - Changes propagate instantly across contexts
- **Subscription system** - React to settings changes
- **Type safety** - Full TypeScript support

## API

### Getting Settings

```typescript
import { settingsManager } from '../../shared/utils/settings-manager';

// Get all settings
const settings = await settingsManager.getSettings();

// Access nested values
const aliasing = settings.aliasing;
const users = settings.aliasing?.users || [];
```

### Updating Settings

```typescript
// Update settings (merges with existing)
await settingsManager.updateSettings({
  aliasing: {
    users: [...users, newUser],
  },
});
```

### Subscribing to Changes

```typescript
// Subscribe to all settings changes
const unsubscribe = settingsManager.subscribe((updatedSettings) => {
  console.log('Settings changed:', updatedSettings);
  // React to changes
});

// Unsubscribe when done
unsubscribe();
```

## Storage

Settings are persisted to Chrome extension storage (`chrome.storage.local`) and automatically synced across:
- Background service worker
- Content scripts
- Options page
- Popup

## Implementation

**Location:** [`settings-manager.ts`](./settings-manager.ts)

The manager:
1. Loads settings from storage on initialization
2. Caches settings in memory for fast access
3. Broadcasts changes via `chrome.storage.onChanged`
4. Provides subscription API for reactive updates

## Related Documentation

- [Settings System](../../../docs/settings.md) - Settings architecture
- [Options Store](../../../options/store/settings-store.ts) - React/Zustand integration

