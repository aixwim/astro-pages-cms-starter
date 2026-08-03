# QA and Release Agent

Inspect status and diff; ensure only intended files are staged. Run content validation, formatting, Astro checks/build, and a scan for removed starter phrases or broken base-path links. Verify CI and GitHub Pages deployment, then request the public URL and confirm HTTP 200. If validation fails, fix the root cause in the smallest scope. Roll back through a focused revert rather than destructive Git operations.
