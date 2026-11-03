# 18. Rename Mosaic to OmaMosaic with a new plugin ID

- Status: Accepted
- Date: 2026-11-03

## Context

The owner kept the name Mosaic on 2026-10-21. On 2026-10-30 another plugin,
`naolselemon.mosaic` ("Mosaic", an app-settings explorer), was listed on the
Omarchy plugin marketplace. The IDs differ, so nothing blocked a listing,
but two cards would share the name. `pym.mosaic` was not listed yet, and
marketplace IDs are permanent once listed (a retired ID is never reused),
so this was the last free moment to change both the name and the ID.

Names were checked on 2026-11-03 against the marketplace catalog and
registry (6260 listings, 138 retired IDs), its issues, GitHub and the web.
The earlier favourites were taken by then (OmaScenes; two plugins named
Vista), as were most Oma-prefixed names. OmaMosaic was clear everywhere and
keeps the identity, the art and the word users know.

## Decision

The plugin becomes **OmaMosaic**, version 2.0.0, with a fresh ID, as
OmaReach's rename did:

- plugin ID and IPC target `pym.omamosaic`, bar widget "OmaMosaic", layer
  namespaces `pym-omamosaic-*`, runtime files `pym-omamosaic*`, journal
  prefix `OmaMosaic:`, swap-key bind description `OmaMosaic: …`;
- the browser extension is renamed "OmaMosaic" (worker `background-11.js`,
  version 0.6.0) and its native host `pym.omamosaic`. The extension keeps
  its `key`, so its ID and the host's `allowed_origins` don't change;
- the command is `omamosaic`; `bin/mosaic` stays as an alias;
- state moves from `$XDG_STATE_HOME/mosaic/` to
  `$XDG_STATE_HOME/omamosaic/`, which changes the path in
  [ADR 6](0006-keep-tiles-json-and-v1-json-compatible.md) but not the
  formats. On start the service copies the old folder's files into the new
  one (`cp -a -n`) unless the new one already has a state file, before it
  reads any of them, and never deletes the old folder;
- the GitHub repository `mateuspim/omarchy-mosaic` becomes
  `mateuspim/omamosaic` (GitHub redirects the old URL), and OmaMosaic is
  submitted to the marketplace as a new listing. `pym.mosaic` was never
  listed, so nothing is retired.

These keep the old name on purpose: the Hyprland tags `mosaic` and
`mosaic-<session>` ([ADR 2](0002-hyprland-tags-are-the-source-of-truth.md)),
the layout names `mosaic-*`, the `MOSAIC_*` environment variables, and the
v1 `list`/`webapps` JSON. Renaming the tags would orphan every tile open
during the upgrade, and none of these show on a card.

The native host's setup recognises the old extension name ("Omarchy
Mosaic") and plugin folder (`pym.mosaic`) in the flags files, and removes
`NativeMessagingHosts/pym.mosaic.json` files that are provably its own
(our extension as the only origin, this host's file name), so Enable
replaces the old setup instead of loading two copies. The service treats
the old swap-key bind as its own and replaces it once. Widget settings in
`shell.json` are keyed by plugin ID and are not touched (OmaMosaic never
modifies user config on load); the README's "Coming from Mosaic" section
gives the manual steps.

## Consequences

- One name everywhere a user looks; `Mosaic` and `pym.mosaic` remain in the
  CHANGELOG, the older records, the migration code and this record.
- Existing users move over by hand once: remove `pym.mosaic`, add
  OmaMosaic, re-enter widget settings, press Enable, and update binds from
  `omarchy-shell pym.mosaic` to `omarchy-shell pym.omamosaic`. Open tiles,
  saved sessions and layouts carry over.
- The extension change costs one browser reload or restart (ADR 10).
- The compatibility code (old names in the native host, the old bind
  description, the state copy) can go in a later major release.
