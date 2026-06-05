#!/usr/bin/env node
// Extract load-bearing markers from built insight pages so we can verify the
// content-collection migration preserved them. Usage:
//   node scripts/snapshot-insight-markers.mjs <dist-dir> <out.json>
import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const distDir = process.argv[2] || "dist";
const outFile = process.argv[3] || "/tmp/insight-markers.json";
const INS = join(distDir, "insights");

function all(re, s) {
  return [...s.matchAll(re)].map((m) => m[1]);
}

async function main() {
  const entries = await readdir(INS, { withFileTypes: true });
  const slugs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  const out = {};
  for (const slug of slugs) {
    let html;
    try {
      html = await readFile(join(INS, slug, "index.html"), "utf8");
    } catch {
      continue;
    }
    const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1]?.replace(/\s+/g, " ").trim() || "";
    // outbound links inside the <article> body (skip nav/footer)
    const article = (html.match(/<article[\s\S]*?<\/article>/) || [""])[0];
    const hrefs = [...new Set(all(/href="([^"]+)"/g, article))]
      .filter((h) => !h.startsWith("#"))
      .sort();
    const imgs = all(/<img[^>]*src="([^"]+)"/g, article).sort();
    const jsonld = (html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/) || [])[1] || "";
    let headline = "", datePublished = "", ldType = "";
    try {
      const j = JSON.parse(jsonld);
      headline = j.headline || j.name || "";
      datePublished = j.datePublished || "";
      ldType = j["@type"] || "";
    } catch {}
    out[slug] = { h1, hrefs, imgs, headline, datePublished, ldType };
  }
  await writeFile(outFile, JSON.stringify(out, null, 2));
  console.log(`snapshotted ${Object.keys(out).length} insight pages -> ${outFile}`);
}
main();
