
// Mock browser environment
if (typeof global.window === 'undefined') {
    (global as any).window = global;
}

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; },
        key: (index: number) => Object.keys(store)[index] || null,
        get length() { return Object.keys(store).length; },
    };
})();

(global as any).localStorage = localStorageMock;

async function validate() {
    const { settingsManager } = await import('./shared/utils/settings-manager');
    // storage import is side-effectful (imports chrome-mock), so we import it to ensure it runs
    await import('./shared/utils/storage');

    console.log('Starting validation...');

    // 1. Initialize
    await settingsManager.initialize();
    console.log('Initialized.');

    // 2. Get current settings
    const initial = await settingsManager.getSettings();
    console.log('Initial autoHarvestUsers:', initial.aliasing?.autoHarvestUsers);

    // 3. Update settings
    console.log('Updating autoHarvestUsers to true...');
    await settingsManager.updateSettings({
        aliasing: {
            ...initial.aliasing,
            autoHarvestUsers: true,
            users: initial.aliasing?.users || [],
            projects: initial.aliasing?.projects || [],
            orgs: initial.aliasing?.orgs || [],
            // Provide defaults for other required fields to satisfy TS
            autoHarvestProjects: initial.aliasing?.autoHarvestProjects ?? false,
            autoHarvestOrgs: initial.aliasing?.autoHarvestOrgs ?? false,
            autoAliasUsers: initial.aliasing?.autoAliasUsers ?? false,
            autoAliasProjects: initial.aliasing?.autoAliasProjects ?? false,
            autoAliasOrgs: initial.aliasing?.autoAliasOrgs ?? false,
        }
    });

    // 4. Verify update in memory
    const updated = await settingsManager.getSettings();
    console.log('Updated autoHarvestUsers (memory):', updated.aliasing?.autoHarvestUsers);

    if (updated.aliasing?.autoHarvestUsers !== true) {
        console.error('FAILED: Update did not persist in memory.');
        process.exit(1);
    }

    // 5. Simulate reload by re-initializing (reads from storage)
    console.log('Simulating reload (re-initializing)...');
    // Force clear cache to ensure we read from storage
    (settingsManager as any).cachedSettings = null;
    await settingsManager.initialize();

    // 6. Verify persistence
    const reloaded = await settingsManager.getSettings();
    console.log('Reloaded autoHarvestUsers (storage):', reloaded.aliasing?.autoHarvestUsers);

    if (reloaded.aliasing?.autoHarvestUsers === true) {
        console.log('SUCCESS: Settings persisted correctly.');
    } else {
        console.error('FAILED: Settings reset after reload.');
        process.exit(1);
    }
}

validate().catch(err => {
    console.error('Validation error:', err);
    process.exit(1);
});
