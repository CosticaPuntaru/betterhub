# Feature Registry

The feature registry manages feature registration and lifecycle in BetterHub.

## Overview

The feature registry is a singleton that:
- Registers features with their metadata
- Tracks enabled/disabled state
- Manages feature initialization and cleanup
- Provides query methods for features

## API

### Registration

```typescript
import { featureRegistry } from '../../shared/utils/feature-registry';

featureRegistry.register({
  id: 'my-feature',
  displayName: 'My Feature',
  description: 'Feature description',
  enabled: true,
  settingsSchema: { /* ... */ },
  initialize: async () => { /* ... */ },
  cleanup: async () => { /* ... */ },
});
```

### Querying

```typescript
// Get all features
const allFeatures = featureRegistry.getAll();

// Get enabled features
const enabled = featureRegistry.getEnabled();

// Get features with settings
const withSettings = featureRegistry.getWithSettings();

// Get specific feature
const feature = featureRegistry.get('my-feature');
```

### Lifecycle

```typescript
// Enable a feature (calls initialize if present)
await featureRegistry.enable('my-feature');

// Disable a feature (calls cleanup if present)
await featureRegistry.disable('my-feature');
```

## Implementation

**Location:** [`feature-registry.ts`](./feature-registry.ts)

The registry uses a `Map<string, Feature>` internally for O(1) lookups.

## Related Documentation

- [Features Guide](../../../docs/features.md) - Feature development guide
- [Architecture](../../../docs/architecture.md) - System architecture

