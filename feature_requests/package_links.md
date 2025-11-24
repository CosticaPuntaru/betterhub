# Feature Request: NPM/Package Links

## High-Level Description
Turn package names in configuration files (package.json, etc.) into clickable links pointing to their respective registries (npm, PyPI, etc.).

## The Problem
Dependency files like `package.json` are rendered as plain text. To check a package's documentation or version, users must manually copy the name and search for it on npmjs.com.

## Implementation Details
- **Trigger**: When viewing a file blob.
- **Action**:
    1. Check filename (e.g., `package.json`, `go.mod`, `requirements.txt`).
    2. Parse the file content (or the DOM lines) to identify dependency lines.
    3. Replace the package name text with an `<a>` tag linking to the registry (e.g., `https://www.npmjs.com/package/[name]`).
    4. Add a tooltip or hover card with package details if possible.
- **Supported Files**:
    - `package.json` -> npm
    - `requirements.txt` -> PyPI
    - `go.mod` -> pkg.go.dev
    - `Cargo.toml` -> crates.io

## How to Use
1.  Navigate to a repository file view for a supported config file (e.g., `package.json`).
2.  Hover over a dependency name (e.g., `"react"`).
3.  The text will appear as a link. Click it to open the package registry page in a new tab.

## Steps to Test
1.  Open a `package.json` file on GitHub.
2.  Locate the `dependencies` or `devDependencies` section.
3.  Verify that package names are blue/underlined (links).
4.  Click a package name.
5.  Verify it opens the correct npmjs.com page.

## Agent Validation
-   **DOM Query**: Select the code blob container.
-   **Link Check**: Query for `a` tags within the code lines.
-   **Href Verification**: Check that `a.href` matches the pattern `https://www.npmjs.com/package/...` (or other registries).
