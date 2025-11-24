# Feature Request: Build Status Favicon

## High-Level Description
Update the browser tab favicon to reflect the CI/CD build status of the Pull Request (Green Check, Red X, or Yellow Dot).

## The Problem
Developers often switch tabs while waiting for checks to pass. They have to keep switching back to the PR tab to check if the build turned green or failed.

## Implementation Details
- **Trigger**: On PR pages.
- **Action**:
    1. Monitor the build status indicator in the PR header (the checkmark/X icon).
    2. Use a `MutationObserver` to detect changes to this status.
    3. When status changes (Pending, Success, Failure), generate a dynamic favicon (canvas or predefined icons).
    4. Replace the `<link rel="icon">` href with the new icon.
    - **Green Check**: All checks passed.
    - **Red X**: Checks failed.
    - **Yellow Dot**: Checks running.

## How to Use
1.  Open a Pull Request.
2.  Look at the browser tab icon (favicon).
3.  It will change from the standard GitHub cat logo to a status icon (Check, X, or Dot) depending on the PR's build status.

## Steps to Test
1.  Open a PR with a passing build. Verify favicon is a green check (or includes it).
2.  Open a PR with a failing build. Verify favicon is a red X.
3.  (Optional) Trigger a rebuild and watch the favicon change to yellow/pending.

## Agent Validation
-   **Favicon Query**: Select `link[rel="icon"]` or `link[rel="shortcut icon"]`.
-   **Href Check**: Verify the `href` attribute is NOT the default GitHub favicon URL. It should be a data URI (blob) or a link to a custom asset.
-   **Match Status**: Check if the icon color/shape corresponds to the current build status element on the page.
