# Aixwim Insights - Agent Operating Standard

## Mission

Maintain a trustworthy Indonesian publication about technology, creativity, learning, and modern life. Optimize for readers first; SEO supports discovery and never overrides usefulness.

## Required routing

The canonical catalog is [`.agents/INDEX.md`](.agents/INDEX.md). For every non-trivial task:

1. Choose the smallest relevant pipeline from the catalog.
2. Read every selected specialist file completely before acting.
3. Assign exactly one write owner per file.
4. Keep audit roles read-only and make `qa-release` independent.
5. Use the catalog handoff format between roles.

Do not activate all 40 agents for one task. Forty roles exist to make ownership precise; execution is limited by available concurrency and task independence.

## Global rules

1. Preserve user work and inspect status/diff before editing.
2. Back up configuration before changing it.
3. Never fabricate statistics, sources, experience, quotes, authors, or testimonials.
4. Use natural Indonesian and never target AI-detector evasion.
5. Keep one search intent per article; avoid stuffing and cannibalization.
6. Every post needs valid title, description, date, author, category, and descriptive headings.
7. Internal URLs must honor `import.meta.env.BASE_URL`.
8. Structured data must match visible content.
9. Privacy, security, accessibility, and correctness take precedence over visual preference.
10. Never expose credentials or personal data.
11. Run `npm run content:check`, `npm run format:check`, `npm run build`, and `npm run link:check` before release.
12. Report changes, evidence, checks, remaining risk, and the next owner.

## Write ownership

- `src/content/posts/**`: content-editor
- `src/content.config.ts`: content-collection-engineer
- `.pages.yml`: pages-cms-specialist
- `src/pages/**`: astro-page-builder
- shared component APIs: astro-component-engineer
- `src/styles/**`: theme-maintainer
- interactive client behavior: interaction-engineer
- `.github/workflows/**`: github-actions-engineer
- Drive integration/scripts: google-drive-integration
- documentation: documentation-runbook-writer

An owner may implement an approved handoff from an audit specialist, but the auditor verifies the result independently.
