import { execFileSync } from "node:child_process";
import { writeFile } from "node:fs/promises";

const commit =
  process.env.GITHUB_SHA ||
  execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();

// Keep Next.js's _next assets when publishing from a gh-pages branch, too.
await writeFile("out/.nojekyll", "");
await writeFile(
  "out/deployment.json",
  JSON.stringify({ commit, builtAt: new Date().toISOString() }, null, 2) + "\n"
);
console.log(`GitHub Pages export ready in out/ (source commit: ${commit}).`);
