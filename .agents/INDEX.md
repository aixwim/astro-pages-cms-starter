# Aixwim Specialist Agent Catalog

This directory defines exactly 40 persistent specialist roles. These files are operating prompts and routing contracts; they do not imply 40 concurrent processes. The runtime may execute only the number of workers supported by the environment.

## Routing principles

1. Select the smallest set of specialists that covers the request.
2. Assign one write owner for every file. Audit agents remain read-only.
3. Parallelize only independent scopes. Never let two agents edit the same file.
4. Every handoff includes objective, evidence, files, assumptions, acceptance criteria, and remaining risk.
5. Resolve conflicts in this order: correctness, security/privacy, accessibility, content integrity, performance, SEO, visual preference.
6. Publishing, deployment, access changes, deletion, analytics, and external messages require explicit authority.
7. The QA agent must be independent from the primary implementer.

## Editorial and discovery (12)

| Agent                                                         | Primary responsibility                |
| ------------------------------------------------------------- | ------------------------------------- |
| [audience-intent-researcher](audience-intent-researcher.md)   | Reader problems, language, intent     |
| [keyword-opportunity-analyst](keyword-opportunity-analyst.md) | Query clusters and cannibalization    |
| [serp-source-researcher](serp-source-researcher.md)           | Current SERP and primary sources      |
| [content-strategy-planner](content-strategy-planner.md)       | Pillar-cluster roadmap                |
| [content-brief-architect](content-brief-architect.md)         | Article-ready brief                   |
| [content-editor](content-editor.md)                           | Indonesian post drafting/editing      |
| [onpage-seo-editor](onpage-seo-editor.md)                     | Title, description, headings, anchors |
| [seo-reviewer](seo-reviewer.md)                               | People-first SEO gate                 |
| [fact-source-reviewer](fact-source-reviewer.md)               | Claim and source verification         |
| [internal-link-architect](internal-link-architect.md)         | Contextual link graph                 |
| [taxonomy-curator](taxonomy-curator.md)                       | Categories, tags, slugs               |
| [content-refresh-auditor](content-refresh-auditor.md)         | Refresh and overlap queue             |

## Astro, experience, and quality (14)

| Agent                                                                   | Primary responsibility               |
| ----------------------------------------------------------------------- | ------------------------------------ |
| [astro-architect](astro-architect.md)                                   | Routing, layout, config, base path   |
| [astro-page-builder](astro-page-builder.md)                             | Static routes and page composition   |
| [astro-component-engineer](astro-component-engineer.md)                 | Typed reusable components            |
| [content-collection-engineer](content-collection-engineer.md)           | Content schema and CMS alignment     |
| [theme-maintainer](theme-maintainer.md)                                 | Global theme implementation          |
| [design-system-curator](design-system-curator.md)                       | Tokens and component states          |
| [responsive-mobile-specialist](responsive-mobile-specialist.md)         | 320px-to-desktop behavior            |
| [accessibility-auditor](accessibility-auditor.md)                       | WCAG and keyboard review             |
| [interaction-engineer](interaction-engineer.md)                         | Client interactions and fallbacks    |
| [performance-engineer](performance-engineer.md)                         | Core Web Vitals and budgets          |
| [image-asset-optimizer](image-asset-optimizer.md)                       | Images, rights, alt, compression     |
| [navigation-information-architect](navigation-information-architect.md) | Navigation and information hierarchy |
| [search-discovery-engineer](search-discovery-engineer.md)               | Search, URL state, discovery         |
| [comments-community-engineer](comments-community-engineer.md)           | Giscus, sharing, consent             |

## Platform, governance, and operations (14)

| Agent                                                             | Primary responsibility               |
| ----------------------------------------------------------------- | ------------------------------------ |
| [pages-cms-specialist](pages-cms-specialist.md)                   | Pages CMS configuration              |
| [google-drive-integration](google-drive-integration.md)           | Read-only Drive ingestion and rights |
| [github-repository-maintainer](github-repository-maintainer.md)   | Repository hygiene                   |
| [github-actions-engineer](github-actions-engineer.md)             | CI and workflow security             |
| [github-pages-release](github-pages-release.md)                   | Pages deployment and smoke tests     |
| [qa-release](qa-release.md)                                       | Independent release gate             |
| [link-integrity-auditor](link-integrity-auditor.md)               | Internal/external link integrity     |
| [web-security-reviewer](web-security-reviewer.md)                 | Static web and supply-chain security |
| [privacy-legal-maintainer](privacy-legal-maintainer.md)           | Data flow and legal-page alignment   |
| [dependency-maintainer](dependency-maintainer.md)                 | Dependency update batches            |
| [lighthouse-quality-auditor](lighthouse-quality-auditor.md)       | Four-category Lighthouse gate        |
| [documentation-runbook-writer](documentation-runbook-writer.md)   | README and runbooks                  |
| [incident-rollback-coordinator](incident-rollback-coordinator.md) | Incident and recovery coordination   |
| [analytics-governance](analytics-governance.md)                   | Privacy-first measurement planning   |

## Standard pipelines

### New SEO article

`audience-intent-researcher -> keyword-opportunity-analyst + serp-source-researcher -> content-strategy-planner -> content-brief-architect -> content-editor -> fact-source-reviewer -> onpage-seo-editor + internal-link-architect -> seo-reviewer -> qa-release`

### Astro feature

`astro-architect -> astro-page-builder or astro-component-engineer -> interaction-engineer/theme-maintainer -> responsive-mobile-specialist + accessibility-auditor -> performance-engineer -> qa-release -> github-pages-release`

### Theme change

`design-system-curator -> theme-maintainer -> responsive-mobile-specialist + accessibility-auditor -> lighthouse-quality-auditor -> qa-release`

### CMS or content schema change

`content-collection-engineer -> pages-cms-specialist -> taxonomy-curator -> content-editor migration -> qa-release`

### Google Drive asset

`google-drive-integration -> image-asset-optimizer -> accessibility-auditor -> qa-release`

### Release

`qa-release -> github-actions-engineer -> github-pages-release -> link-integrity-auditor + lighthouse-quality-auditor`

### Incident

`incident-rollback-coordinator -> relevant owning specialist -> qa-release -> github-pages-release -> documentation-runbook-writer`

## Handoff format

```text
Objective:
Owner:
Evidence:
Files/URLs:
Assumptions:
Acceptance criteria:
Checks already run:
Open risks:
Next specialist:
```
