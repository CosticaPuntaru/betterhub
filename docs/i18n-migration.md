# i18next with Default Values - Migration Guide

## Overview

This guide explains how to use i18next with readable English text in your code instead of cryptic translation keys.

## How It Works

Instead of writing:
```tsx
{t('features.aliasing.ui.addType', { type: aliasType })}
```

You can now write:
```tsx
{t('features.aliasing.ui.addType', 'Add {{type}}', { type: aliasType })}
```

The second parameter is the **default English text** that will:
1. Be displayed in your UI when using English
2. Be automatically extracted to `src/shared/locales/en.json`
3. Serve as the source text for translators

## Usage Examples

### Basic Translation
```tsx
// Before
{t('features.aliasing.ui.enabled')}

// After
{t('features.aliasing.ui.enabled', 'Enabled')}
```

### With Variables
```tsx
// Before
{t('features.aliasing.ui.addType', { type: aliasType })}

// After
{t('features.aliasing.ui.addType', 'Add {{type}}', { type: aliasType })}
```

### With Pluralization
```tsx
{t('items.count', 'You have {{count}} item', { count: 1 })}
{t('items.count', 'You have {{count}} items', { count: 5 })}
```

### In Non-React Code
```tsx
import { t } from '../shared/utils/i18n';

const message = t('error.notFound', 'Item not found');
```

## Extracting Translations

After updating your code with default values, run:

```bash
pnpm i18next:extract
```

This will:
- Scan all `.ts` and `.tsx` files in `src/`
- Extract all `t()` calls with their keys and default values
- Update `src/shared/locales/en.json` with the extracted translations
- Sort keys alphabetically for easy maintenance

## Migration Steps

### 1. Update Existing Code

For each `t()` call in your codebase:

1. Keep the existing key (first parameter)
2. Add the English text as the second parameter
3. Keep any variables in the third parameter

**Example:**
```tsx
// Original
{t('features.aliasing.ui.original')}

// Updated
{t('features.aliasing.ui.original', 'Original')}
```

### 2. Run Extraction

```bash
pnpm i18next:extract
```

### 3. Review Generated JSON

Check `src/shared/locales/en.json` to ensure all translations were extracted correctly.

### 4. Add Other Languages (Future)

When you're ready to add more languages:

1. Update `i18next-parser.config.js`:
   ```js
   locales: ['en', 'fr', 'es'],
   ```

2. Run extraction:
   ```bash
   pnpm i18next:extract
   ```

3. This will create:
   - `src/shared/locales/en.json` (with English text)
   - `src/shared/locales/fr.json` (with empty strings to be translated)
   - `src/shared/locales/es.json` (with empty strings to be translated)

## Best Practices

### 1. Use Descriptive Keys

Keys should describe the context and purpose:
```tsx
// Good
t('features.aliasing.ui.addType', 'Add {{type}}')
t('settings.privacy.title', 'Privacy Settings')

// Avoid
t('add', 'Add {{type}}')
t('title', 'Privacy Settings')
```

### 2. Keep Defaults Concise

Default values should be the actual English text you want to display:
```tsx
// Good
t('button.save', 'Save')

// Avoid
t('button.save', 'Click this button to save your changes')
```

### 3. Use Consistent Variable Names

```tsx
// Good
t('greeting.user', 'Hello, {{name}}!', { name: userName })

// Avoid
t('greeting.user', 'Hello, {{x}}!', { x: userName })
```

### 4. Group Related Keys

Use dot notation to organize translations:
```tsx
features.aliasing.ui.add
features.aliasing.ui.delete
features.aliasing.ui.edit
features.aliasing.errors.notFound
features.aliasing.errors.duplicate
```

## Example Migration

Here's a complete example from `AliasList.tsx`:

### Before
```tsx
<Button onClick={() => setAdding(true)} disabled={disabled} size="sm">
  {t('features.aliasing.ui.addType', { type: aliasType })}
</Button>
```

### After
```tsx
<Button onClick={() => setAdding(true)} disabled={disabled} size="sm">
  {t('features.aliasing.ui.addType', 'Add {{type}}', { type: aliasType })}
</Button>
```

### Generated JSON (after running `pnpm i18next:extract`)
```json
{
  "en": {
    "translation": {
      "features": {
        "aliasing": {
          "ui": {
            "addType": "Add {{type}}"
          }
        }
      }
    }
  }
}
```

## Troubleshooting

### Translations Not Extracted

- Ensure you're using the correct `t()` function signature
- Check that your files match the patterns in `i18next-parser.config.js`
- Run with verbose output: `pnpm i18next:extract --verbose`

### Variables Not Working

- Use double curly braces: `{{variableName}}`
- Ensure variable names match between default text and parameters
- Example: `t('key', 'Hello {{name}}', { name: 'World' })`

### Keys Not Nested Properly

- Check your key separator in `i18next-parser.config.js` (default: `.`)
- Use consistent dot notation: `features.aliasing.ui.add`

## Additional Resources

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
- [i18next-parser Documentation](https://github.com/i18next/i18next-parser)
