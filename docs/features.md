# Features Guide

> **See also:** [Documentation Index](./README.md) | [Architecture](./architecture.md)

This guide explains how to develop features for BetterHub.

## Adding a New Feature

1. Create feature directory: `src/features/feature-name/`
2. Add settings to `src/shared/types/settings.ts`
3. Create `index.ts` with registration and settings schema
4. Create `content.ts` with `initialize()` and `cleanup()` functions
5. Feature automatically appears in options page

## Feature Structure

```typescript
// index.ts
import { featureRegistry } from '../../shared/utils/feature-registry';

featureRegistry.register({
  id: 'feature-name',
  displayName: 'Feature Name',
  enabled: true,
  settingsSchema: { /* ... */ },
});
```

```typescript
// content.ts
export async function initialize(settings: Settings): Promise<void> {
  // Apply feature modifications
}

export async function cleanup(): Promise<void> {
  // Remove feature modifications
}
```

## Settings Schema

Features define their settings declaratively:

```typescript
const settingsSchema: FeatureSettingsSchema = {
  featureId: 'feature-name',
  displayName: 'Feature Name',
  fields: [
    {
      key: 'featureName.settingKey',
      type: 'checkbox',
      label: 'Setting Label',
      default: false,
    },
  ],
};
```

## Current Features

- **PR List Customization** (`pr-list-customization`) - Hide elements from PR listing pages

## References

- See `src/features/pr-list-customization/` for example
- See `src/shared/types/settings-ui.ts` for schema types

