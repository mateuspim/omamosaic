# Files and JSON formats

OmaMosaic's state lives in `$XDG_STATE_HOME/omamosaic/` (default
`~/.local/state/omamosaic/`), its runtime files in `$XDG_RUNTIME_DIR`. Every
state file is JSON, written atomically by the service (`FileView.setText`),
and read leniently: a missing or unreadable file counts as empty. Personal
URLs live only in these files, never in the repository. Why the first two
formats are frozen: [ADR 6](../adr/0006-keep-tiles-json-and-v1-json-compatible.md).

Before 2.0.0 the folder was `$XDG_STATE_HOME/mosaic/`
([ADR 18](../adr/0018-rename-to-omamosaic-with-a-new-id.md)). When the
service starts and the new folder has none of `tiles.json`, `saved.json`
and `layouts.json`, it copies the old folder's files into it (`cp -a -n`,
never overwriting) before reading any state, and leaves the old folder as
it was. The formats did not change.

## `tiles.json`

The tiles' URLs and order, in the format the Rust CLI wrote, so its tiles
carry over:

```json
{ "tiles": [ { "address": "0x…", "session": "streams", "url": "https://…" } ] }
```

- `address`: the Hyprland window address, `0x` plus hex.
- `session`: `^[a-z0-9_-]{1,32}$`.
- `url`: the address the tile was opened with, or last swapped to in place,
  stored as given (query string included).

Records are in the order the tiles were added. The file is pruned against
live windows on `add`, and ignored where it disagrees with the Hyprland
tags, which decide membership
([ADR 2](../adr/0002-hyprland-tags-are-the-source-of-truth.md)).

## `list` (version 1)

`omamosaic list --json` and IPC `list`:

```json
{"version":1,"sessions":[{"name":"streams","tiles":[{"index":1,"address":"0x…","url":"https://…",
  "title":"…","monitor":"DP-4","workspace":10,"state":"contained"}]}]}
```

- Sessions are sorted by name; tiles without a session tag are in `default`.
- Tiles are in store order; `index` is 1-based across all sessions and is
  what `omamosaic remove 2` and other `TILE` arguments mean.
- `url` is `null` for a tagged window with no store record.
- `state` is `contained` (fullscreen state `0/2`), `uncontained` (`0/0`),
  `floating`, or `fullscreen` (truly fullscreen).
- `version` changes only on an incompatible change; adding a field does not
  bump it.

## `webapps` (version 1)

`omamosaic webapps --json` and IPC `webapps`:

```json
{"version":1,"webapps":[{"id":"Twitch","name":"Twitch","url":"https://twitch.tv","icon":"twitch"}]}
```

A web app is a desktop entry whose command runs `omarchy-launch-webapp URL`
or a browser with `--app=URL`, with an http or https URL, from
`$XDG_DATA_HOME` and `$XDG_DATA_DIRS` (not Omarchy's templates in
`/usr/share/omarchy/applications`). `Hidden` and `NoDisplay` entries are left
out, a user entry hides a system entry with the same id, and `id` is the
desktop file id (`dir-name` for entries in subfolders). `icon` is `""` when
unset.

## `layouts.json` (version 2)

The layout of each workspace OmaMosaic changed, and the custom layouts:

```json
{ "version": 2,
  "workspaces": {
    "8": { "layout": "grid", "before": "dwindle" },
    "9": { "layout": "custom:three", "before": "" } },
  "custom": {
    "three": { "name": "Three",
      "tree": { "split": "row", "sizes": [25, 50, 25], "children": [{}, {}, {}] },
      "main": 2 } } }
```

- `layout`: `grid`, `stack`, `main`, `fit`, or `custom:<slug>`. A workspace
  set back to Hyprland's own layout (`default`) is removed.
- `before`: the workspace's layout before OmaMosaic changed it, which `default`
  puts back.
- `custom.<slug>`: a custom layout; the format is in
  [layouts.md](layouts.md#custom-layouts).
- Version 1 kept layouts per session; they move to their sessions'
  workspaces on the first sync.

## `saved.json` (version 1)

Saved sessions:

```json
{ "version": 1, "sessions": { "streams": { "monitor": "DP-4", "workspace": 10,
  "layout": "stack", "login": true,
  "tiles": [ { "url": "https://twitch.tv/…", "volume": 0.4, "muted": false } ] } } }
```

- Keys are session names (`^[a-z0-9_-]{1,32}$`).
- `monitor` and `workspace`: where the session's first tiled tile was.
- `layout`: that workspace's layout choice, as in `layouts.json`, or
  `default`.
- `login`: open this session a few seconds after the shell starts, once per
  login.
- `tiles`: up to nine, in list order, each with its URL and, from the
  extension, `volume` (0 to 1) and `muted`. While "Only the focused tile
  plays" is on, mutes are not saved.

Saving again replaces an entry but keeps its `login`.

## Runtime files

In `$XDG_RUNTIME_DIR` (the service falls back to `/tmp` without it):

| File | Written by | Holds |
| --- | --- | --- |
| `pym-omamosaic.sock` | the service (`SocketServer`) | The bridge socket; `MOSAIC_BRIDGE_SOCKET` overrides the path for both sides. |
| `pym-omamosaic-tabs.json` | the service | Which browser tab each tile was matched to, since tab ids outlive a shell restart. |
| `pym-omamosaic-login` | the service | Marker that saved sessions were opened for this login. |

## Other files

| File | Written by | Holds |
| --- | --- | --- |
| `$XDG_STATE_HOME/omamosaic/plugin-update.log` | the optional git hooks in `.githooks/` | What the hooks ran after a commit, pull or checkout on `master`. |
| `~/.config/<browser profile>/NativeMessagingHosts/pym.omamosaic.json` | `mosaic-native-host setup` | The native-host manifest; see [native-messaging.md](native-messaging.md). |
| `~/.config/*-flags.conf` | `mosaic-native-host setup` / `remove` | The extension folder on the `--load-extension=` line, only in files that exist. |
