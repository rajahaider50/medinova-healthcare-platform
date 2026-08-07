/**
 * MediNova — Static import resolution check.
 * Ensures every relative import in app/ resolves to an existing module.
 *
 * Usage: npm run test:imports
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";

const root = fileURLToPath(new URL("..", import.meta.url));
const appRoot = join(root, "app");

const files = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".js")) files.push(p);
  }
})(appRoot);

let errors = 0;
for (const file of files) {
  const src = readFileSync(file, "utf8");
  const re = /from\s+["'](\.[^"']+)["']/g;
  let m;
  while ((m = re.exec(src))) {
    let target = resolve(dirname(file), m[1]);
    if (!target.endsWith(".js")) {
      if (statSync(target, { throwIfNoEntry: false })?.isDirectory()) {
        target = join(target, "index.js");
      } else target += ".js";
    }
    if (!statSync(target, { throwIfNoEntry: false })) {
      errors++;
      console.error(`[import] ${file.replace(appRoot, "app")} -> ${m[1]}`);
    }
  }
}

if (errors) {
  console.error(`\n${errors} broken import(s).`);
  process.exit(1);
}
console.log(`All imports resolve — ${files.length} files.`);
