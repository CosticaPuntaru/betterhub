# Options Page Components

React components for the BetterHub options/settings page.

## Components

### FeatureSettings
Main component that renders settings for a feature based on its schema.

**Location:** [`FeatureSettings.tsx`](./FeatureSettings.tsx)

**Props:**
- `featureId: string` - Feature identifier
- `schema: FeatureSettingsSchema` - Feature settings schema
- `globalEnabled: boolean` - Master toggle state

**Features:**
- Auto-generates UI from schema
- Handles all field types (checkbox, text, number, select, textarea)
- Supports custom field types (alias-list, harvest-whitelist)
- Page-specific toggles support

### AliasList
Manages alias lists for users, projects, or organizations.

**Location:** [`AliasList.tsx`](./AliasList.tsx)

**Props:**
- `aliasType: 'user' | 'project' | 'org'` - Type of aliases
- `settingKey: string` - Settings key path
- `disabled?: boolean` - Disabled state

**Features:**
- Add/edit/delete aliases
- Enable/disable aliases
- Color and icon customization
- Display type switching (color vs icon)

### HarvestWhitelist
Manages harvest whitelists for organizations or repositories.

**Location:** [`HarvestWhitelist.tsx`](./HarvestWhitelist.tsx)

**Props:**
- `whitelistType: 'org' | 'repo'` - Type of whitelist
- `settingKey: string` - Settings key path
- `disabled?: boolean` - Disabled state

**Features:**
- "Allow All" toggle
- Add/remove items from whitelist
- Table view of whitelisted items

### GlobalMasterToggle
Master toggle for enabling/disabling the entire extension.

**Location:** [`GlobalMasterToggle.tsx`](./GlobalMasterToggle.tsx)

## UI Components

Reusable UI components in [`ui/`](./ui/):
- `Button` - Button component
- `Card` - Card container
- `Input` - Text input
- `Label` - Form label
- `Select` - Dropdown select
- `Switch` - Toggle switch
- `Textarea` - Multi-line text input

## Migration Notes

These components replaced the old vanilla DOM manipulation code:
- `AliasList` replaces `renderAliasList()` from `ui-manager.ts`
- `HarvestWhitelist` replaces `renderHarvestWhitelist()` from `harvest-whitelist-manager.ts`

The new React components:
- ✅ No duplication issues
- ✅ Automatic re-renders
- ✅ Type-safe
- ✅ Easier to maintain

## Related Documentation

- [Options Page](../README.md) - Options page overview
- [Settings System](../../docs/settings.md) - Settings architecture

