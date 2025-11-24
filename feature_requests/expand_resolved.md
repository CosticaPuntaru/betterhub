# Feature Request: Auto-Expand Resolved Comments

## High-Level Description
Automatically expand or provide a global button to expand resolved comment threads to quickly see context.

## The Problem
Resolved comments are collapsed by default. When reviewing the history of a PR or checking if feedback was actually addressed, reviewers have to manually click "Show resolved" on every single thread, which is tedious.

## Implementation Details
- **Trigger**: On PR conversation view.
- **Action**:
    1. Add a "Expand All Resolved" button to the top of the timeline.
    2. On click, query all "Show resolved" buttons and trigger click events on them.
    3. Optionally, add a setting to do this automatically on page load.

## How to Use
1.  Open a PR with resolved conversation threads.
2.  Click the "Expand All Resolved" button at the top of the timeline (or observe them auto-expanding if configured).
3.  All hidden comments should become visible.

## Steps to Test
1.  Find a PR with multiple resolved threads.
2.  Verify they are initially collapsed.
3.  Click the "Expand All Resolved" button.
4.  Verify all threads expand and content is visible.

## Agent Validation
-   **Button Check**: Verify "Expand All Resolved" button exists.
-   **Content Visibility**: Before action, check that resolved comment bodies are hidden (or not in DOM). After action, verify comment bodies are visible/present.
