// ============================================================================
// src/content.config.ts — the single source of truth for insight articles.
// ----------------------------------------------------------------------------
// One markdown file per article in src/content/insights/<slug>.md. Frontmatter
// holds everything structural (the meta block, supplement, sources, jsonLd
// inputs); the body is pure markdown prose + inline images. The renderer
// (src/components/InsightArticle.astro) turns this into the page, and the
// derived surfaces (index, .md alternate, llms.txt, /ask bot) are all
// generated from this collection. Change the template once, it propagates.
//
// French articles use a `.fr.md` filename and `lang: fr`; the URL slug is the
// filename minus the `.fr` suffix.
// ============================================================================

import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const linkRef = z.object({
  label: z.string(),
  href: z.string(),
});

const figure = z.object({
  src: z.string(),
  alt: z.string(),
});

const instance = z.object({
  date: z.string(), // displayed verbatim, e.g. "March 11, 2026"
  body: z.string(), // markdown, rendered inline
  caseStudy: linkRef.optional(),
});

const citation = z.object({
  title: z.string(),
  author: z.string(),
  publicationDate: z.string(),
  onlineDate: z.string().optional(),
  publisher: z.string().optional(),
  abstract: z.string().optional(),
  keywords: z.string().optional(),
});

const insights = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/insights" }),
  schema: z.object({
    // identity / head
    title: z.string(),
    metaTitle: z.string().optional(),
    dek: z.string().optional(),
    description: z.string(),
    date: z.coerce.date(),

    // taxonomy / display
    // indexCategory drives the tab + colored tag on the insights index ONLY.
    // There is no category pill on the article page (by design).
    indexCategory: z.enum(["governance", "identity"]).default("governance"),
    gerCode: z.string().optional(), // "GER-309" -> index tag
    categoryBreadcrumb: z.string().optional(), // "GER-309, Compliant Harm" -> breadcrumb crumb
    group: z.string().default("General"), // llms.txt grouping heading
    readTimeMin: z.number().optional(),

    // media
    hero: figure.optional(),
    ogImage: z.string().optional(), // falls back to hero.src
    ogImageAlt: z.string().optional(),

    // supplement <dl> (NO "Published" row — date renders once in the header)
    author: z.string().default("Sushee Nzeutem, SVRNOS"),
    related: z.array(linkRef).default([]),
    companion: linkRef.optional(),
    companionSpec: linkRef.optional(),
    taxonomy: linkRef.optional(),

    // optional structural blocks
    sources: z.array(z.string()).default([]), // each is a markdown string (may mix text + links)
    callout: z.string().optional(), // markdown
    cta: z.array(linkRef).default([]), // buttons
    citation: citation.optional(),
    instances: z.array(instance).optional(), // GER collection stubs

    // behavior
    showSupplement: z.boolean().default(true),
    showShare: z.boolean().default(true),
    jsonLdType: z.enum(["Article", "CollectionPage"]).default("Article"),

    // i18n
    lang: z.enum(["en", "fr"]).default("en"),
    translationOf: z.string().optional(), // slug of the EN original
    draft: z.boolean().default(false),
  }),
});

export const collections = { insights };
