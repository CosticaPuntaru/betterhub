import type { Settings } from '../../shared/types/settings';

let navigationObserver: MutationObserver | null = null;
let lastUrl = window.location.href;
let processedElements = new WeakSet<Element>();

export function initialize(settings: Settings): void {
    const isEnabled = settings.features['package-links'];
    if (!isEnabled) {
        cleanup();
        return;
    }

    // Initial application
    applyPackageLinks();

    // Watch for navigation changes (SPA)
    if (!navigationObserver) {
        navigationObserver = new MutationObserver(() => {
            if (window.location.href !== lastUrl) {
                lastUrl = window.location.href;
                processedElements = new WeakSet();
                applyPackageLinks();
            } else {
                // Content might have loaded dynamically
                applyPackageLinks();
            }
        });

        navigationObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }
}

export function cleanup(): void {
    if (navigationObserver) {
        navigationObserver.disconnect();
        navigationObserver = null;
    }
    processedElements = new WeakSet();
}

interface FileConfig {
    pattern: RegExp;
    getPackageUrl: (packageName: string) => string;
    parsePackages: (line: string) => string[];
}

const FILE_CONFIGS: Record<string, FileConfig> = {
    'package.json': {
        pattern: /package\.json$/,
        getPackageUrl: (name) => `https://www.npmjs.com/package/${name}`,
        parsePackages: (line) => {
            // Match package names in dependencies: "package-name": "version"
            const match = line.match(/"([^"]+)"\s*:\s*"[^"]+"/);
            if (match && !match[1].startsWith('@') && !match[1].includes('/')) {
                return [match[1]];
            }
            // Handle scoped packages: "@scope/package": "version"
            const scopedMatch = line.match(/"(@[^"]+\/[^"]+)"\s*:\s*"[^"]+"/);
            if (scopedMatch) {
                return [scopedMatch[1]];
            }
            return [];
        },
    },
    'requirements.txt': {
        pattern: /requirements.*\.txt$/,
        getPackageUrl: (name) => `https://pypi.org/project/${name}`,
        parsePackages: (line) => {
            // Match package names: package-name==version or package-name>=version
            const match = line.match(/^([a-zA-Z0-9_-]+)[\s=<>!]/);
            if (match) {
                return [match[1]];
            }
            return [];
        },
    },
    'go.mod': {
        pattern: /go\.mod$/,
        getPackageUrl: (name) => `https://pkg.go.dev/${name}`,
        parsePackages: (line) => {
            // Match Go module paths: github.com/user/repo v1.2.3
            const match = line.match(/^\s*([a-zA-Z0-9._/-]+)\s+v/);
            if (match) {
                return [match[1]];
            }
            return [];
        },
    },
    'Cargo.toml': {
        pattern: /Cargo\.toml$/,
        getPackageUrl: (name) => `https://crates.io/crates/${name}`,
        parsePackages: (line) => {
            // Match Rust crate names: crate-name = "version"
            const match = line.match(/^([a-zA-Z0-9_-]+)\s*=\s*"[^"]+"/);
            if (match) {
                return [match[1]];
            }
            return [];
        },
    },
};

function applyPackageLinks(): void {
    // Check if we're on a file blob page
    if (!window.location.pathname.includes('/blob/')) {
        return;
    }

    // Get the filename from the page
    const filePathElement = document.querySelector('.final-path');
    if (!filePathElement) {
        return;
    }

    const fileName = filePathElement.textContent?.trim() || '';

    // Find matching file config
    let fileConfig: FileConfig | null = null;
    for (const config of Object.values(FILE_CONFIGS)) {
        if (config.pattern.test(fileName)) {
            fileConfig = config;
            break;
        }
    }

    if (!fileConfig) {
        return;
    }

    // Find the code blob container
    const codeTable = document.querySelector('table.js-file-line-container, table[data-hpc]');
    if (!codeTable || processedElements.has(codeTable)) {
        return;
    }

    processedElements.add(codeTable);

    // Process each line
    const lines = codeTable.querySelectorAll('tr');
    lines.forEach((line) => {
        const codeCell = line.querySelector('td.blob-code');
        if (!codeCell) {
            return;
        }

        const lineText = codeCell.textContent || '';
        const packages = fileConfig.parsePackages(lineText);

        if (packages.length === 0) {
            return;
        }

        // For each package found, try to linkify it
        packages.forEach((packageName) => {
            const url = fileConfig.getPackageUrl(packageName);

            // Find the text node containing the package name
            const walker = document.createTreeWalker(
                codeCell,
                NodeFilter.SHOW_TEXT,
                null
            );

            let node: Node | null;
            while ((node = walker.nextNode())) {
                const textContent = node.textContent || '';
                const index = textContent.indexOf(packageName);

                if (index !== -1) {
                    // Create a link element
                    const link = document.createElement('a');
                    link.href = url;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.textContent = packageName;
                    link.style.color = '#0969da';
                    link.style.textDecoration = 'underline';
                    link.title = `Open ${packageName} on registry`;

                    // Split the text node and insert the link
                    const parent = node.parentNode;
                    if (parent) {
                        const before = document.createTextNode(textContent.substring(0, index));
                        const after = document.createTextNode(textContent.substring(index + packageName.length));

                        parent.insertBefore(before, node);
                        parent.insertBefore(link, node);
                        parent.insertBefore(after, node);
                        parent.removeChild(node);
                    }

                    break; // Only replace first occurrence per line
                }
            }
        });
    });
}
