import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const entries = fs.readdirSync(rootDir, { withFileTypes: true });
const htmlFiles = entries
  .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
  .map((entry) => path.join(rootDir, entry.name))
  .sort();

const htmlCache = new Map();
const idCache = new Map();
const issues = [];

function readHtml(filePath) {
  if (!htmlCache.has(filePath)) {
    htmlCache.set(filePath, fs.readFileSync(filePath, "utf8"));
  }
  return htmlCache.get(filePath);
}

function collectIds(filePath) {
  if (!idCache.has(filePath)) {
    const ids = new Set();
    const html = readHtml(filePath);
    const idRe = /\sid="([^"]+)"/g;
    let match;
    while ((match = idRe.exec(html))) ids.add(match[1]);
    idCache.set(filePath, ids);
  }
  return idCache.get(filePath);
}

function isExternal(href) {
  return /^(?:[a-z]+:|\/\/)/i.test(href);
}

for (const filePath of htmlFiles) {
  const html = readHtml(filePath);
  const hrefRe = /href="([^"]+)"/g;
  let match;
  while ((match = hrefRe.exec(html))) {
    const href = match[1].trim();
    if (!href || isExternal(href)) continue;

    const [rawTarget, rawHash] = href.split("#");
    const targetPath = rawTarget ? path.resolve(path.dirname(filePath), rawTarget) : filePath;
    const hasHash = href.includes("#");
    const hash = hasHash ? rawHash || "" : "";

    if (rawTarget && !fs.existsSync(targetPath)) {
      issues.push(`${path.basename(filePath)} -> missing file: ${href}`);
      continue;
    }

    if (!hasHash || !hash) continue;

    if (!fs.existsSync(targetPath)) continue;
    if (!collectIds(targetPath).has(hash)) {
      issues.push(`${path.basename(filePath)} -> missing hash target: ${href}`);
    }
  }
}

if (issues.length) {
  console.error("Route audit failed.\n");
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(`Route audit passed for ${htmlFiles.length} HTML files.`);