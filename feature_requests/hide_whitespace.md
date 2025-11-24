# Feature Request: Default "Hide Whitespace"

## High-Level Description
Automatically hide whitespace changes in diffs to focus on meaningful code changes. This involves automatically appending `w=1` to Pull Request file view URLs or toggling the setting via DOM manipulation when a PR page is loaded.

## The Problem
Users often have to manually click "Hide whitespace" or append `?w=1` to URLs when reviewing PRs with formatting changes, which is repetitive and annoying.

## Implementation Details
- **Trigger**: On navigation to any PR "Files changed" tab.
- **Action**:
    1. Check if `w=1` query parameter is present.
    2. If not, and the feature is enabled, reload the page with `w=1` OR find the "Hide whitespace" checkbox in the UI and programmatically click it if it's unchecked.
    3. Ideally, use the UI toggle method to avoid a full page reload if possible.
- **Settings**: Add a toggle in BetterHub options to enable/disable this behavior.

## How to Use
1.  Enable the "Default Hide Whitespace" setting in BetterHub options.
2.  Navigate to any Pull Request's "Files changed" tab on GitHub.
3.  The view will automatically update to hide whitespace changes (the URL may update to include `w=1`).

## Steps to Test
1.  Find a Pull Request that has whitespace-only changes (or mixed changes).
2.  Ensure the feature is enabled.
3.  Open the "Files changed" tab.
4.  Verify that lines with only whitespace changes are ignored/hidden in the diff.
5.  Verify that the "Hide whitespace" setting in the PR's gear menu is checked.

## Agent Validation
-   **Check URL**: Verify `window.location.search` contains `w=1`.
-   **Check Input**: Query the "Hide whitespace" checkbox (`input[name="w"]` or similar) and verify `element.checked === true`.
