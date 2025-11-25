export default {
    // Supported locales
    locales: ['en'],

    // Output directory for translation files
    output: 'src/shared/locales/$LOCALE.json',

    // Input files to scan for translations
    input: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.test.{ts,tsx}',
        '!src/**/*.spec.{ts,tsx}',
    ],

    // Sort keys in output JSON
    sort: true,

    // Create old catalogs as *.old.json for reference
    createOldCatalogs: false,

    // Keep removed keys (set to false to clean up unused keys)
    keepRemoved: false,

    // Use keys as default values for the default locale (English)
    // When locale is 'en', use the defaultValue from t() calls
    defaultValue: (locale, namespace, key, value) => {
        // For English, use the provided default value
        // For other locales, return empty string (to be translated)
        return locale === 'en' ? value || key : '';
    },

    // Key separator (use '.' for nested keys like 'features.aliasing.ui.add')
    keySeparator: '.',

    // Namespace separator (use ':' for namespaces like 'common:greeting')
    namespaceSeparator: ':',

    // Use the key as default value when no default is provided
    useKeysAsDefaultValue: false,

    // Indentation for JSON files (2 spaces)
    indentation: 2,

    // Custom lexers for parsing different file types
    lexers: {
        ts: ['JavascriptLexer'],
        tsx: ['JsxLexer'],
    },

    // Default namespace
    defaultNamespace: 'translation',

    // Fail on warnings (set to false for development)
    failOnWarnings: false,

    // Fail on update (set to false to allow updates)
    failOnUpdate: false,

    // Verbose output
    verbose: true,

    // Custom transform function to handle the translation structure
    customValueTemplate: null,
};
