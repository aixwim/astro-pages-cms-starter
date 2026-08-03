# Operations guide

## Release

Create a focused branch and pull request, wait for CI, merge to `main`, then verify the **Deploy GitHub Pages** workflow and its environment URL. Pages CMS edits are Git commits and use the same checks.

## Drive assets

Run `npm run sync:drive` locally with read-only credentials. Inspect `public/drive/manifest.json`, then add only approved assets through Pages CMS or a pull request. Source Drive files are never modified.

If export fails, verify the local credential path, folder share, and Drive API.

## Rollback

Revert the faulty commit through a pull request. Merging the revert automatically deploys the restored version.
