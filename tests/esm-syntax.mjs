/**
 * MediNova — ESM syntax check across the entire app.
 * `node --check` on .js defaults to CommonJS parsing, which is misleading
 * for ESM sources. This re-parses each file as an ES module by copying the
 * app into a temp dir with "type":"module" so real syntax errors surface.
 *
 * Usage: npm run test:syntax
 */

import { cpSync, mkdtempSync, rmSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";

const root = fileURLToPath(new URL("..", import.meta.url));
const tmp = mkdtempSync(join(tmpdir(), "medinova-syntax-"));

function collect(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) collect(p, out);
    else if (p.endsWith(".js")) out.push(p);
  }
  return out;
}

try {
  cpSync(join(root, "app"), join(tmp, "app"), { recursive: true });
  writeFileSync(join(tmp, "package.json"), JSON.stringify({ type: "module" }));

  const files = collect(join(tmp, "app"));
  let failed = 0;
  for (const f of files) {
    try {
      execFileSync(process.execPath, ["--check", f], { stdio: "pipe" });
    } catch (e) {
      failed++;
      console.error(`[syntax] ${f.replace(tmp, "")}\n${String(e.stderr || e.message).trim()}`);
    }
  }

  if (failed) {
    console.error(`\n${failed} file(s) failed syntax check.`);
    process.exit(1);
  }
  console.log(`ESM syntax OK — ${files.length} files.`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
