# Command line

The plugin answers `omarchy-shell pym.omamosaic <function>`; `bin/omamosaic`
in this repository wraps that in the old CLI's command line, with the same
arguments and output. `bin/mosaic` is the same command under the CLI's
name, so scripts from before the 2.0.0 rename keep working:

```bash
omamosaic add --session streams twitch kick.com/somechannel
omamosaic list            # or: omamosaic list --json
omamosaic remove 2
omamosaic focus 1
omamosaic move 2 streams                  # into another session, on its workspace
omamosaic close --session streams
omamosaic contain
omamosaic layout                          # workspaces' layouts and your own
omamosaic layout --workspace 8 grid       # grid, stack, main, fit, yours, default
omamosaic layout --session streams three  # the workspace the session is on
omamosaic save streams                    # keep the session to open it later
omamosaic restore streams                 # open its tiles that aren't open
omamosaic saved           # or: omamosaic saved --json
omamosaic login streams on                # open it at login (or off)
omamosaic forget streams
omamosaic reload 2                        # reload a tile's page
omamosaic save-app 3 "YouTube Music"      # save a tile as a web app
omamosaic streams                         # each tile's stream, recent recoveries
omamosaic webapps         # or: omamosaic webapps --json
omamosaic monitors
```

The list and web app JSON are the version 1 formats the CLI printed. To call
the plugin directly, pass every argument (`""` for none), with targets one
per line: `omarchy-shell pym.omamosaic add $'twitch\nkick' streams "" ""`
answers `started N` right away, and `omarchy-shell pym.omamosaic result N`
reports how it went.
