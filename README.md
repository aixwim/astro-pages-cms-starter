# Astro + Pages CMS Professional Starter

A production-minded website combining Astro, Pages CMS, GitHub Actions, GitHub Pages, and a review-first Google Drive workflow.

## Stack

- Astro 7 static site with strict TypeScript and content collections
- Pages CMS for site settings, posts, and media
- GitHub Actions for CI, deployment, and dependency updates
- [Google Drive project folder](https://drive.google.com/drive/folders/1gw_J2CtynEZmOvdplEW4AzUatrnXmCAz)
- Responsive design, SEO metadata, sitemap, and accessible navigation

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:4321`. Before committing, run `npm run format` and `npm run build`.

## Pages CMS

Open [Pages CMS](https://app.pagescms.org/), sign in with GitHub, install its GitHub App for this repository, and select the repository. Pages CMS reads `.pages.yml` and exposes Site Settings, Insights, and media editors.

## GitHub Pages

The deployment workflow builds every push to `main`. In **Settings → Pages**, choose **GitHub Actions** as the source. The repository base path is calculated automatically. For a custom domain, set repository variables `SITE_URL` (for example `https://www.example.com`) and `BASE_PATH` to `/`; leave `BASE_PATH` empty for a project-page path. The generated `robots.txt` and sitemap follow these values automatically.

## Google Drive integration

The linked folder is currently empty. For safety, Drive files are never copied by GitHub Actions. A local read-only helper exports direct child files into ignored `public/drive` for review.

1. Create a Google Cloud service account with Drive read-only access.
2. Share the folder with its email as Viewer and enable the Drive API.
3. Copy `.env.example` to `.env` and set `GOOGLE_APPLICATION_CREDENTIALS`.
4. Run `npm run sync:drive` in Termux.
5. Review files locally, then upload only approved assets through Pages CMS or a pull request.

Never commit credentials. Docs and presentations export as PDF; Sheets export as XLSX. Nested folders are intentionally skipped.

## Structure

```text
├── .github/workflows/  # CI and Pages deployment
├── docs/               # Operations documentation
├── public/             # Static and approved media
├── scripts/            # Local Drive API export
├── src/content/        # Git-backed editorial content
├── src/data/           # Global site settings
├── src/layouts/        # Shared document shell
├── src/pages/          # Routes
├── src/styles/         # Design system
└── .pages.yml          # Pages CMS schema
```

See [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/OPERATIONS.md](docs/OPERATIONS.md).

## Specialist agents

The repository includes a persistent catalog of **40 specialist roles** covering keyword research, editorial work, Astro engineering, theme and accessibility, SEO, Pages CMS, Google Drive, GitHub Actions, security, privacy, releases, and incidents.

Start with [`.agents/INDEX.md`](.agents/INDEX.md). The catalog defines ownership, boundaries, verification, standard pipelines, and handoff format. The roles are selected per task; they are not intended to run all at once.
