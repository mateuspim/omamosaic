# 19. Keep the browser extension two folders down

- Status: Accepted
- Date: 2026-11-03

## Context

The marketplace rejected the 2.0.0 submission
(omacom/omarchy-plugin-marketplace#13785) with "New submissions require one
plugin with `manifest.json` in the repository root". Its catalog builder
treats every `manifest.json` at the root or one folder below it as a plugin
manifest (`/^(?:[^/]+\/)?manifest\.json$/` in `scripts/build-catalog.mjs`,
checked 2026-11-03), and a submission must have exactly one, at the root.
The browser extension's Manifest V3 file, `extension/manifest.json`,
counted as a second one. Chromium requires the extension's file to be named
`manifest.json`, so it can't be renamed.

## Decision

The extension moves from `extension/` to `browser/extension/`, two folders
down, out of the marketplace's view. Nothing else about it changes: its
fixed `key` keeps the ID, so the version and worker script stay 0.6.0 and
`background-11.js` (ADR 10 renames the worker only when the extension's code
changes).

`tests/layout.test.js` runs the marketplace's rule in `npm test`, so a
second manifest can't come back unnoticed.

## Consequences

- The browser flags files hold the old path,
  `…/pym.omamosaic/extension`. After the update that folder is gone, so the
  native host treats it as a stale entry (as it already did for a moved
  plugin) and **Enable** swaps it for `…/browser/extension`. The browser
  loads the extension from the new path on its next start.
- ADR 8 and older changelog entries name `extension/`; that was the path
  then.
