import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "out");

const generatedPaths = [
  "_next",
  "_not-found",
  "404",
  "404.html",
  "about",
  "continuums",
  "index.html",
  "index.txt",
  "initiatives",
  "methods",
  "sources",
  ".nojekyll",
  "__next.__PAGE__.txt",
  "__next._full.txt",
  "__next._head.txt",
  "__next._index.txt",
  "__next._tree.txt"
];

for (const relativePath of generatedPaths) {
  const target = path.join(root, relativePath);
  fs.rmSync(target, { force: true, recursive: true });
}

fs.cpSync(outDir, root, { recursive: true });
console.log("Synced GitHub Pages export from out/ to repo root.");
