# Settings System

## Overview

Centralized settings management with real-time synchronization across all extension contexts.

## Settings Manager

Location: `src/shared/utils/settings-manager.ts`

### Usage

```typescript
import { settingsManager } from '@/shared/utils/settings-manager';

// Get settings
const settings = await settingsManager.getSettings();

// Update settings
await settingsManager.updateSettings({ language: 'es' });

// Subscribe to changes
const unsubscribe = settingsManager.subscribe((settings) => {
  console.log('Settings changed:', settings);
});
```

## Settings Schema

Settings are typed in `src/shared/types/settings.ts`. Add new feature settings there.

## Declarative UI

Features define settings schemas that automatically generate UI in the options page.

See `src/shared/types/settings-ui.ts` for schema types.

## Real-time Sync

Settings changes are synchronized in real-time:
1. User changes setting in options page
2. Settings manager updates storage
3. All contexts (background, content, popup) receive update
4. Features react to changes immediately

## References

- `src/shared/utils/settings-manager.ts` - Implementation
- `src/shared/types/settings.ts` - Settings types
- `src/shared/types/settings-ui.ts` - UI schema types

