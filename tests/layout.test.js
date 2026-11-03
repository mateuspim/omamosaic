// The Omarchy plugin marketplace counts every manifest.json at the
// repository root or one folder below it, and a submission must have exactly
// one, at the root (scripts/build-catalog.mjs in
// omacom/omarchy-plugin-marketplace, checked 2026-11-03). The browser
// extension's manifest therefore lives two folders down, in
// browser/extension/. This runs the same check locally.
import assert from "node:assert/strict"
import { readdirSync } from "node:fs"
import { join } from "node:path"

const root = join(import.meta.dirname, "..")
const skip = new Set([".git", "node_modules"])
const manifests = []
for (const entry of readdirSync(root, { withFileTypes: true })) {
  if (entry.isFile() && entry.name.toLowerCase() === "manifest.json") manifests.push(entry.name)
  if (!entry.isDirectory() || skip.has(entry.name)) continue
  for (const inner of readdirSync(join(root, entry.name), { withFileTypes: true })) {
    if (inner.isFile() && inner.name.toLowerCase() === "manifest.json") manifests.push(entry.name + "/" + inner.name)
  }
}
assert.deepEqual(manifests, ["manifest.json"],
  "The marketplace accepts one plugin manifest, at the root; found: " + manifests.join(", "))
console.log("layout: ok")
