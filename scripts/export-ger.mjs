#!/usr/bin/env node
// ============================================================================
// scripts/export-ger.mjs
// ----------------------------------------------------------------------------
// Pulls the canonical GER + AIID data from the svrnos-docs Supabase project
// and writes static JSON files into src/data/. Astro/Mintlify build reads
// these files. No runtime DB dependency.
//
// Usage:  npm run export:ger
//
// Env vars (with defaults baked in for the public anon key — these are
// SAFE to commit because RLS makes them read-only):
//   SVRNOS_DOCS_URL       — Supabase project URL
//   SVRNOS_DOCS_ANON_KEY  — Publishable anon key (NOT the service-role secret)
//
// Files written (5):
//   src/data/ger.json          — every code, denormalized (tags, anchors, attributions)
//   src/data/aiid.json         — every AIID incident, with mapped codes + tags
//   src/data/tags.json         — the flat tag vocabulary
//   src/data/contributors.json — the acknowledgments roster
//   src/data/glossary.json     — SVRNOS-coined terms
//
// Build pipeline: this script runs before `astro build` in CI. Adding it to
// `npm run build` is a one-line change once we're ready to wire it up.
// ============================================================================

import { createClient } from "@supabase/supabase-js";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const OUT_DIR   = join(REPO_ROOT, "src", "data");

// Defaults — these ARE public-safe. RLS blocks writes; only SELECT is allowed
// on canonical tables via the `anon read` policies set in 0001_ger_schema.sql.
const URL  = process.env.SVRNOS_DOCS_URL      ?? "https://rqyjnkvkkjqszgessaxv.supabase.co";
const KEY  = process.env.SVRNOS_DOCS_ANON_KEY ?? "sb_publishable_tegidHtehanRGmwAG0P4aQ_UvXE7Ws4";

const supabase = createClient(URL, KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// PostgREST has a default 1000-row cap per request — paginate to get everything.
const PAGE = 1000;

async function pullAll(query) {
  const rows = [];
  let from = 0;
  while (true) {
    const { data, error } = await query.range(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    rows.push(...data);
    if (data.length < PAGE) break;
    from += PAGE;
  }
  return rows;
}

async function pull(viewName) {
  return pullAll(supabase.from(viewName).select("*"));
}

async function pullTable(name, orderBy) {
  const q = supabase.from(name).select("*");
  if (orderBy) q.order(orderBy);
  return pullAll(q);
}

async function writeJson(filename, payload, countKey) {
  const path = join(OUT_DIR, filename);
  const body = JSON.stringify(payload, null, 2) + "\n";
  await writeFile(path, body, "utf8");
  const sizeKb = (Buffer.byteLength(body) / 1024).toFixed(1);
  const n = countKey ? payload[countKey].length : 1;
  console.log(`  wrote ${filename.padEnd(20)}  ${String(n).padStart(5)} rows  ${sizeKb.padStart(7)} KB`);
}

async function main() {
  console.log(`exporting from ${URL}`);
  await mkdir(OUT_DIR, { recursive: true });

  // Read everything in parallel
  const [codes, incidents, tags, contributors, glossary] = await Promise.all([
    pull("ger_codes_export"),
    pull("aiid_incidents_export"),
    pullTable("tags", "slug"),
    pullTable("contributors", "name"),
    pullTable("glossary", "slug"),
  ]);

  const stamp = new Date().toISOString();

  // Write each file with a minimal envelope so consumers know when the snapshot was taken
  await writeJson("ger.json", {
    generated_at: stamp,
    source: "svrnos-docs.ger_codes_export",
    count: codes.length,
    codes,
  }, "codes");

  await writeJson("aiid.json", {
    generated_at: stamp,
    source: "svrnos-docs.aiid_incidents_export",
    attribution: "Incident titles from the AI Incident Database (incidentdatabase.ai), CC BY-NC-SA 4.0. SVRNOS displays titles and links out for full narratives.",
    count: incidents.length,
    incidents,
  }, "incidents");

  await writeJson("tags.json", {
    generated_at: stamp,
    count: tags.length,
    tags,
  }, "tags");

  await writeJson("contributors.json", {
    generated_at: stamp,
    count: contributors.length,
    contributors,
  }, "contributors");

  await writeJson("glossary.json", {
    generated_at: stamp,
    count: glossary.length,
    terms: glossary,
  }, "terms");

  console.log(`\ndone. ${OUT_DIR}/ now holds the canonical snapshot.`);
}

main().catch((err) => {
  console.error("export failed:", err.message);
  process.exit(1);
});
