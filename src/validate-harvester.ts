
import { JSDOM } from 'jsdom';

// Mock browser environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'https://github.com/dashboard'
});
global.window = dom.window as any;
global.document = dom.window.document;

// Import harvester (using dynamic import to ensure mocks are ready)
async function runValidation() {
    console.log('Starting harvester validation...');

    const { harvestProjects } = await import('./features/aliasing/harvester');

    const testCases = [
        { url: 'https://github.com/facebook/react', expected: true, name: 'Valid Repo: facebook/react' },
        { url: 'https://github.com/microsoft/vscode', expected: true, name: 'Valid Repo: microsoft/vscode' },
        { url: 'https://github.com/features/actions', expected: false, name: 'System Path: features/actions' },
        { url: 'https://github.com/pricing/team', expected: false, name: 'System Path: pricing/team' },
        { url: 'https://github.com/marketplace/actions', expected: false, name: 'System Path: marketplace/actions' },
        { url: 'https://github.com/settings/profile', expected: false, name: 'System Path: settings/profile' },
        { url: 'https://github.com/orgs/facebook/people', expected: false, name: 'Org Path: orgs/facebook' },
        { url: 'https://github.com/login', expected: false, name: 'Login Path' },
        { url: 'https://github.com/about', expected: false, name: 'About Path' },
    ];

    // Setup DOM with links
    document.body.innerHTML = testCases.map(tc => `<a href="${tc.url}">${tc.name}</a>`).join('\n');

    const harvested = harvestProjects();
    console.log('Harvested items:', harvested);

    let passed = true;
    for (const tc of testCases) {
        const found = harvested.some(h => {
            // Extract repo name from URL for comparison
            const match = tc.url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
            const repoName = match ? `${match[1]}/${match[2]}` : '';
            return h.original.toLowerCase() === repoName.toLowerCase();
        });

        if (tc.expected !== found) {
            console.error(`FAILED: ${tc.name} - Expected ${tc.expected}, got ${found}`);
            passed = false;
        } else {
            console.log(`PASSED: ${tc.name}`);
        }
    }

    if (passed) {
        console.log('All validation tests passed!');
    } else {
        console.error('Validation failed!');
        process.exit(1);
    }
}

runValidation().catch(console.error);
