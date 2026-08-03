# Aixwim Insights — Agent Operating Standard

## Mission

Maintain a trustworthy Indonesian publication about technology, creativity, learning, and modern life. Optimize for readers first; SEO supports discovery and never overrides usefulness.

## Required routing

- Content drafting or editing: follow `.agents/content-editor.md`.
- SEO review: follow `.agents/seo-reviewer.md`.
- Layout, component, or style changes: follow `.agents/theme-maintainer.md`.
- Validation, release, or rollback: follow `.agents/qa-release.md`.

## Global rules

1. Preserve the user's work and inspect the current diff before editing.
2. Back up configuration before changing it.
3. Never fabricate statistics, experience, quotes, sources, authors, or testimonials.
4. Use natural Indonesian, concrete examples, varied sentence rhythm, and useful conclusions. Never target AI-detector evasion.
5. Keep one search intent per article; avoid keyword stuffing and duplicate/cannibalizing topics.
6. Every post requires accurate title, description, date, author, category, one H1 supplied by the template, and descriptive H2/H3 structure.
7. Internal URLs must honor `import.meta.env.BASE_URL`; do not add dummy or unrelated links.
8. Structured data must match visible page content.
9. Run `npm run content:check`, `npm run format:check`, and `npm run build` before release.
10. Report exactly what changed, checks performed, and any remaining risk.
