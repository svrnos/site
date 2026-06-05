// ============================================================================
// src/lib/insights.ts — shared logic for the insights collection.
// Centralizes JSON-LD construction, date formatting, slug handling, and a
// minimal inline-markdown renderer for short frontmatter snippets (callout,
// instance bodies). The main article body uses Astro's real markdown renderer.
// ============================================================================

const SITE = "https://svrnos.com";

export interface InsightData {
  title: string;
  metaTitle?: string;
  dek?: string;
  description: string;
  date: Date;
  indexCategory: "governance" | "identity";
  gerCode?: string;
  categoryBreadcrumb?: string;
  group: string;
  readTimeMin?: number;
  hero?: { src: string; alt: string };
  ogImage?: string;
  ogImageAlt?: string;
  author: string;
  related: { label: string; href: string }[];
  companion?: { label: string; href: string };
  companionSpec?: { label: string; href: string };
  taxonomy?: { label: string; href: string };
  sources: string[];
  callout?: string;
  cta: { label: string; href: string }[];
  citation?: Record<string, string>;
  instances?: { date: string; body: string; caseStudy?: { label: string; href: string } }[];
  showSupplement: boolean;
  showShare: boolean;
  jsonLdType: "Article" | "CollectionPage";
  lang: "en" | "fr";
  translationOf?: string;
  draft: boolean;
}

/** Strip the `.fr` language suffix from a collection entry id to get the URL slug. */
export function urlSlug(id: string): string {
  return id.replace(/\.fr$/, "");
}

/** Absolute path under /insights (lang-aware) for a slug. */
export function insightPath(slug: string, lang: "en" | "fr"): string {
  return lang === "fr" ? `/fr/insights/${slug}` : `/insights/${slug}`;
}

/** Absolute URL for an image src (already a /-rooted path). */
export function absUrl(src: string): string {
  return new URL(src, SITE).toString();
}

/** Format a date for display, locale-aware. */
export function fmtDate(date: Date, lang: "en" | "fr"): string {
  return date.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** ISO date (YYYY-MM-DD) for schema + meta. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Inline markdown -> HTML with NO paragraph wrapping (for <li>, single lines). */
export function mdSpan(md: string): string {
  let html = escapeHtml(md.trim());
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  return html;
}

/**
 * Minimal inline markdown -> HTML for trusted, authored frontmatter snippets
 * (callout text, instance bodies). Handles links, bold, italic, and splits
 * blank-line-separated paragraphs. NOT for arbitrary/untrusted input.
 */
export function mdInline(md: string): string {
  const paras = md.trim().split(/\n{2,}/);
  return paras
    .map((p) => {
      let html = escapeHtml(p.trim());
      html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
      html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      html = html.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
      return `<p>${html}</p>`;
    })
    .join("\n");
}

/** Build the canonical absolute page URL. */
export function canonicalUrl(slug: string, lang: "en" | "fr"): string {
  return `${SITE}${insightPath(slug, lang)}`;
}

/** Construct the Schema.org JSON-LD object from frontmatter (no hand-authoring). */
export function buildJsonLd(d: InsightData, slug: string): Record<string, unknown> {
  const url = canonicalUrl(slug, d.lang);
  const image = d.ogImage ?? d.hero?.src;
  const isPartOf = {
    "@type": "Blog",
    name: "SVRNOS Insights",
    url: `${SITE}/insights`,
  };

  if (d.jsonLdType === "CollectionPage") {
    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: d.title,
      description: d.description,
      url,
      publisher: { "@type": "Organization", name: "SVRNOS", url: SITE },
      isPartOf,
    };
  }

  const authorName = d.author.split(",")[0].trim();
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: d.title,
    author: {
      "@type": "Person",
      name: authorName,
      affiliation: { "@type": "Organization", name: "SVRNOS" },
    },
    publisher: { "@type": "Organization", name: "SVRNOS", url: SITE },
    datePublished: isoDate(d.date),
    url,
    ...(image ? { image: absUrl(image) } : {}),
    mainEntityOfPage: url,
    description: d.description,
    isPartOf,
  };

  if (d.lang === "fr" && d.translationOf) {
    jsonLd.inLanguage = "fr";
    jsonLd.translationOfWork = {
      "@type": "Article",
      url: canonicalUrl(d.translationOf, "en"),
    };
  }

  return jsonLd;
}

/**
 * Render the canonical markdown alternate for an insight, from the same source
 * the HTML page uses. `body` is the raw markdown body (no frontmatter).
 */
export function renderInsightMarkdown(d: InsightData, slug: string, body: string): string {
  const lines: string[] = [];
  lines.push(`# ${d.title}`, "");
  lines.push(`**Author:** ${d.author}`);
  lines.push(`**Published:** ${fmtDate(d.date, d.lang)}`);
  if (d.gerCode) lines.push(`**Code:** ${d.gerCode}`);
  lines.push(`**Canonical URL:** ${canonicalUrl(slug, d.lang)}`);
  if (d.hero) lines.push(`**Hero image:** ${absUrl(d.hero.src)}`);
  if (d.companion) lines.push(`**Companion:** [${d.companion.label}](${d.companion.href})`);
  lines.push("");
  if (d.dek) lines.push(`> ${d.dek}`, "");
  lines.push("---", "");
  if (d.hero) lines.push(`![${d.hero.alt}](${d.hero.src})`, "");
  if (d.instances && d.instances.length) {
    if (body.trim()) lines.push(body.trim(), "");
    for (const it of d.instances) {
      lines.push(`### ${it.date}`, "", it.body.trim(), "");
      if (it.caseStudy) lines.push(`[${it.caseStudy.label}](${it.caseStudy.href})`, "");
    }
  } else {
    lines.push(body.trim(), "");
  }
  if (d.callout) lines.push("---", "", d.callout.trim(), "");
  if (d.sources && d.sources.length) {
    lines.push("---", "", "**Sources**", "");
    for (const s of d.sources) lines.push(`- ${s}`);
    lines.push("");
  }
  return lines.join("\n");
}
