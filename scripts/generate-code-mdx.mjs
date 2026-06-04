#!/usr/bin/env node
// ============================================================================
// scripts/generate-code-mdx.mjs
// ----------------------------------------------------------------------------
// Generates one MDX file per GER code into docs-site/ger/codes/ from the
// canonical ger.json snapshot. Re-run after every `npm run export:ger`.
//
// Usage:  npm run generate:code-pages
// ============================================================================

import { readFile, writeFile, mkdir, readdir, unlink } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const GER_JSON  = join(REPO_ROOT, "src", "data", "ger.json");
const OUT_DIR   = join(REPO_ROOT, "docs-site", "ger", "codes");

const TIER_LABEL = {
  "0xx": "Pre-Infrastructure",
  "2xx": "Success States",
  "3xx": "Structural Moves",
  "4xx": "Operator / Platform Errors",
  "5xx": "Infrastructure Failures",
};

function quote(s) {
  if (s == null) return '""';
  // JSX-attribute-safe: wrap in double quotes, replace inner " with &quot;.
  // JSON.stringify produces \" which MDX/JSX rejects in attribute values.
  return `"${String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;")}"`;
}

function renderCodePage(c) {
  const dek = c.definition.length > 220 ? c.definition.slice(0, 220).trim() + "…" : c.definition;
  const tierLabel = TIER_LABEL[c.tier] ?? c.tier;
  const tierTag = `Tier ${c.tier}`;
  const layerTag = c.layer ? `Layer ${c.layer}` : null;
  const docTag = c.type === "documented" ? "Documented" : "Illustrative";
  const namespaceTag = c.is_namespace_claim ? "Namespace-Claim" : null;
  const versionTag = `Added ${c.version_added}`;

  const sections = [];

  // Frontmatter
  sections.push(`---
title: "GER-${c.code} · ${c.name}"
description: ${quote(dek)}
sidebarTitle: "${c.code} · ${c.name}"
---

import { Badge } from "/snippets/Badge.mdx"`);

  // Status row
  const badges = [
    `<Badge tone="${c.type === "documented" ? "green" : "amber"}">${docTag}</Badge>`,
    `<Badge>${tierTag}</Badge>`,
    layerTag ? `<Badge>${layerTag}</Badge>` : null,
    namespaceTag ? `<Badge tone="blue" title="SVRNOS-assigned code in an HTTP-unassigned slot">${namespaceTag}</Badge>` : null,
    `<Badge tone="gray">${versionTag}</Badge>`,
  ].filter(Boolean).join(" ");

  sections.push(`<div className="flex flex-wrap gap-2 mb-8 mt-2">
${badges}
</div>

*${tierLabel}*`);

  // Definition
  sections.push(`## Definition

${c.definition}`);

  // Distinct From
  if (c.distinct_from && c.distinct_from.length > 0) {
    const items = c.distinct_from.map((d) =>
      `- [**GER-${d.contrasted_with}**](/ger/codes/${d.contrasted_with}) — ${d.this_condition} → this code. ${d.other_condition} → GER-${d.contrasted_with}.`
    ).join("\n");
    sections.push(`## Distinct from\n\n${items}`);
  }

  // Documented case (one exemplar per code — AIID or external source: arXiv, vendor, news, advisory)
  if (c.documented_source) {
    const s = c.documented_source;
    const label =
      s.source_type === "aiid"
        ? `AIID #${s.external_ref}`
        : s.external_ref
          ? `${s.source_type} · ${s.external_ref}`
          : s.source_type;
    sections.push(`## Documented case`);
    sections.push(`<Card title=${quote(s.title)} href=${quote(s.url)}>
  ${label}
</Card>`);
  }

  // Case study link
  if (c.article_url) {
    sections.push(`## Case study

SVRNOS has published a long-form case study on this code: [**${c.article_url.split("/").pop().replace(/-/g, " ")}**](https://svrnos.com${c.article_url}).`);
  }

  // Tags
  if (c.tags && c.tags.length > 0) {
    const tagList = c.tags.map((t) => `\`${t}\``).join(" · ");
    sections.push(`## Tags\n\n${tagList}`);
  }

  // Contributors (external only — institutional author is credited in the citation block below)
  // Filter out SVRNOS-internal "primary" attributions; show only external contributors.
  const externalContribs = (c.contributors || []).filter((co) => {
    const isInstitutional =
      (co.affiliation || "").toLowerCase().includes("svrnos") ||
      (co.affiliation || "").toLowerCase().includes("sovereign os") ||
      (co.name || "").toLowerCase().includes("sushee nzeutem");
    return !isInstitutional;
  });
  if (externalContribs.length > 0) {
    const lines = externalContribs.map((co) => {
      const affil = co.affiliation ? `, ${co.affiliation}` : "";
      const type = co.attribution_type ? ` — ${co.attribution_type}` : "";
      return `${co.name}${affil}${type}`;
    }).join("; ");
    sections.push(`### Contributors\n\n${lines}`);
  }

  // References (academic papers / works that informed the code, distinct from people who personally engaged)
  if (c.references && c.references.length > 0) {
    const lines = c.references.map((r) => {
      if (r.url) {
        return `- ${r.citation} [${r.url}](${r.url})`;
      }
      return `- ${r.citation}`;
    }).join("\n");
    sections.push(`### References\n\n${lines}`);
  }

  // Citation (institutional only — no author attribution per-code, matches MITRE/OWASP/CWE convention)
  const year = new Date().getFullYear();
  const cite = `SVRNOS. (${year}). GER-${c.code}: ${c.name}. Governance Error Register. https://docs.svrnos.com/ger/codes/${c.code}`;
  sections.push(`### Cite

\`\`\`
${cite}
\`\`\``);

  return sections.join("\n\n") + "\n";
}

async function main() {
  const raw = JSON.parse(await readFile(GER_JSON, "utf8"));
  const codes = raw.codes;

  await mkdir(OUT_DIR, { recursive: true });

  // Wipe any stale code files (so deleted codes don't linger)
  try {
    const existing = await readdir(OUT_DIR);
    for (const f of existing) {
      if (f.endsWith(".mdx")) {
        await unlink(join(OUT_DIR, f));
      }
    }
  } catch {}

  for (const c of codes) {
    const path = join(OUT_DIR, `${c.code}.mdx`);
    await writeFile(path, renderCodePage(c), "utf8");
  }

  console.log(`generated ${codes.length} code pages into docs-site/ger/codes/`);
}

main().catch((err) => {
  console.error("generation failed:", err.message);
  process.exit(1);
});
